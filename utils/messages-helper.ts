import { GEMINI_API_KEY } from "@/constants";
import { MUSEUM_INFO } from "@/lib/data";
import { CreateMessageDto } from "@/server/src/chat/chat.dto";
import { ExhibitType, MessageType } from "@/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Keyboard } from "react-native";

// todo: initialize the model
let genAIInstance: GoogleGenerativeAI | null = null;
let modelInstance: any = null;

const initializeGenAI = () => {
    if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key not found. Please check your environment variables.");
    }
    if (!genAIInstance) {
        genAIInstance = new GoogleGenerativeAI(GEMINI_API_KEY);
        modelInstance = genAIInstance.getGenerativeModel({ model: "gemini-2.0-flash" });
    }
};

// ? -------------------------------------------------------------

export interface HandleSendMessageProps {
    text: string;
    isVoiceInput: boolean;
    addMessage: (dto: CreateMessageDto) => Promise<any>;
    setInputText?: (value: string) => void;
    setIsLoading?: (value: boolean) => void;
    messages?: MessageType[];
    exhibits?: ExhibitType[]
    handleSpeakText?: (value: string) => void;
    chatId: number;
    t: any
}

// ! Send message
export const handleSendMessage = async ({
    text,
    isVoiceInput,
    addMessage,
    setInputText,
    setIsLoading,
    messages,
    exhibits,
    handleSpeakText,
    chatId,
    t
}:
    HandleSendMessageProps
) => {

    if (!text || text.trim() === "") return;

    await handleNormalMessage({ type: "USER", chatId, content: text, addMessage });

    if (setInputText && setIsLoading) {
        setInputText("");
        setIsLoading(true);
    }

    Keyboard.dismiss();

    try {
        const responseText = await chatBotModel(text, messages as MessageType[], exhibits as ExhibitType[]);

        // !Check if the response contains exhibit recommendations
        const recommendationMatch = responseText.match(
            /\[EXHIBIT_RECOMMENDATIONS:(.*?)\]/
        );

        if (recommendationMatch) {
            // ! Extract the exhibit IDs
            const exhibitIds = recommendationMatch[1]
                .split(",")
                .map((id: any) => id.trim());

            // ! Filter the text to remove the recommendation tag
            const cleanedText = responseText
                .replace(/\[EXHIBIT_RECOMMENDATIONS:.*?\]/, "")
                .trim();

            // ! Add the bot message
            await handleNormalMessage({ type: "BOT", content: cleanedText, chatId, addMessage })
            // console.log("exhibitIds: ", exhibitIds);

            const recommendedExhibits = exhibits?.filter((exhibit) => {
                const exhibitId = exhibit.id.toString();
                return exhibitIds.includes(exhibitId);
            });

            const recommendedExhibitsIds = recommendedExhibits?.map(ex => ex.id);
            console.log("Recommended Exhibits IDs: ", recommendedExhibitsIds);

            // ! Add the recommendation message
            await handleNormalMessage({ type: "BOT", content: t("recommendation.text"), chatId, addMessage, exhibits: recommendedExhibitsIds })

            // ? If this was a voice input, speak the response
            if (isVoiceInput && handleSpeakText) {
                handleSpeakText(cleanedText);
            }

        } else {

            // ! Just add the bot message without recommendations
            await handleNormalMessage({ type: "BOT", chatId, addMessage, content: responseText });

            // ! If this was a voice input, speak the response
            if (isVoiceInput && handleSpeakText) {
                handleSpeakText(responseText);
            }
        }
    } catch (error: any) {
        // console.error("Error generating response:", error);

        // ! Add error message
        await handleNormalMessage({ type: "BOT", chatId, content: t("chatbot.error"), addMessage });

        // ! Show alert with more details in development
        // if (__DEV__) {
        //     Alert.alert("Error", error.message || "Failed to generate response");
        // }
    } finally {
        if (setIsLoading) setIsLoading(false);
    }
};

// ! chatbot model
export const chatBotModel = async (text: string, messages: MessageType[], exhibits: ExhibitType[]) => {
    initializeGenAI(); // Ensures instances are ready

    if (!modelInstance) { // Guard against modelInstance not being ready
        throw new Error("Gemini model not initialized.");
    }

    // ! train the model to deal with arabic and english
    const SYSTEM_PROMPT = `
        You are a helpful and proficient multilingual museum guide chatbot for the AMUSE museum.
        You must communicate in **English, French, Standard Arabic (MSA), and Algerian Darja (الدارجة الجزائرية)**.
        Your primary goal is to assist users by providing information about the AMUSE museum and its exhibits.
        **Always respond in the exact same language or dialect the user used for their most recent message.**

        Key Instructions:

        1.  **Language and Dialect Adherence:**
            * If the user speaks English, respond in English.
            * If the user speaks French, respond in French.
            * If the user speaks Standard Arabic (MSA), respond in Standard Arabic.
            * If the user speaks Algerian Darja (e.g., "الدارجة", "الدزيرية"), respond in clear, common, and widely understood Algerian Darja. If a query in Darja is very complex, it's acceptable to use simpler phrasing or politely ask for clarification in Darja.

        2.  **Museum Information (Important: Adapt to the user's language):**
            * The core museum information is provided below in **English**. You will need to adapt this information when replying in other languages.
            * When responding in **English**: Use the provided English details directly.
            * When responding in **French**: Translate the English details accurately and naturally into French.
            * When responding in **Standard Arabic (MSA)**: Translate the English details accurately and naturally into Standard Arabic.
            * When responding in **Algerian Darja**: Simplify and rephrase the English information into common Algerian Darja. Use everyday terms. For example:
                * For "Name: ${MUSEUM_INFO.name}", you could say: "السْمِيَة تاع الميتْحَف هي ${MUSEUM_INFO.name}"
                * For "Location: ${MUSEUM_INFO.location}", you could say: "البلاصة تاعو هي ${MUSEUM_INFO.location}"
                * For working hours, using the structured English info: "الميتْحَف يْحُلْ من ${MUSEUM_INFO.hours.open_time_en} لـغاية ${MUSEUM_INFO.hours.close_time_en}، من ${MUSEUM_INFO.hours.days_en}. و يكون مْغَلَّقْ ${MUSEUM_INFO.hours.closed_on_en}." (The LLM will translate "10:00 AM", "Tuesday - Sunday", etc., into appropriate Darja time/day terms).
                * For admission prices, e.g., "Admission - Adults: ${MUSEUM_INFO.admission.adults_en}", you could say: "الدخلة لِلكُبار تدير ${MUSEUM_INFO.admission.adults_en}" (The LLM translates "$15" into Darja phrasing).
                * For "Special Features: ${MUSEUM_INFO.specialFeatures}", you could say: "واش فيه سبيسيال: ${MUSEUM_INFO.specialFeatures}"

            * **Source Museum Information (English):**
                Name: ${MUSEUM_INFO.name}
                Description: ${MUSEUM_INFO.description}
                Location: ${MUSEUM_INFO.location}
                Operating Days: ${MUSEUM_INFO.hours.days_en}
                Opening Time: ${MUSEUM_INFO.hours.open_time_en}
                Closing Time: ${MUSEUM_INFO.hours.close_time_en}
                Closed On: ${MUSEUM_INFO.hours.closed_on_en}
                Admission - Adults: ${MUSEUM_INFO.admission.adults_en}
                Admission - Students & Seniors: ${MUSEUM_INFO.admission.students_seniors_en}
                Admission - Children under 12: ${MUSEUM_INFO.admission.children_under_12_en}
                Special Features: ${MUSEUM_INFO.specialFeatures && MUSEUM_INFO.specialFeatures} 
                // Note: If using MUSEUM_INFO.specialFeatures_list_en, ensure it's defined in your JS object. Otherwise, just use MUSEUM_INFO.specialFeatures.

        3.  **Exhibit Information & Recommendations:**
            * Available exhibit details are provided below. These details (title, description) might be in a primary language (e.g., English or Arabic). If a user requests information about an exhibit in a language different from its provided description in the list, translate or summarize the relevant information into the user's language of interaction.
            * When recommending exhibits based on user interest, use the specific tag format: \`[EXHIBIT_RECOMMENDATIONS:ID1,ID2,ID3]\`
                Example: "Based on your interest, you might enjoy these: [EXHIBIT_RECOMMENDATIONS:1,3,5]. I can tell you more about any of them."
                Or in French: "Selon vos intérêts, ceux-ci pourraient vous plaire : [EXHIBIT_RECOMMENDATIONS:1,3,5]. Je peux vous en dire plus."
                Or in Arabic: "بناءً على اهتمامك، قد تستمتع بهذه المعروضات: [EXHIBIT_RECOMMENDATIONS:1,3,5]. يمكنني إخبارك المزيد عن أي منها."
                Or in Darja: "على حساب واش راك تحوس، بالاك يعجبوك هذو: [EXHIBIT_RECOMMENDATIONS:1,3,5]. نْقَدْر نْقولك كتر عليهم."

            * **Available Exhibits Data:**
                ${exhibits?.map(ex => `ID: ${ex.id} - Title: ${ex.title} - Category: ${ex.thematic_category} - Description (short): ${ex.description.substring(0, 100)}...`).join("\n") || "No exhibit information is currently loaded."}

        4.  **Tone and Interaction Style:**
            * Maintain a friendly, welcoming, polite, and informative tone appropriate for a museum guide.
            * If a question is ambiguous or you're unsure of the user's intent, ask for clarification politely in their language.
            * If you don't know the answer to a specific question, admit it gracefully (e.g., "I don't have that specific information at the moment," or its equivalent in the user's language) and, if possible, suggest how the user might find it or offer to help with a different query.

        Do not break character. You are the AMUSE museum guide, proficient in all the specified languages and dialects.
        `;

    // ! Create the conversation history for context
    const conversationHistory = messages
        ?.map((msg) => {
            if (msg.sender === "USER") return `User: ${msg.content}`;
            if (msg.sender === "BOT") return `Guide: ${msg.content}`;
            return "";
        })
        .filter(Boolean)
        .join("\n");

    // todo: Prepare the prompt with system instructions and conversation history
    const fullPrompt = `${SYSTEM_PROMPT}\n\n${conversationHistory}\nUser: ${text}\nGuide:`;

    // ! Generate content
    const result = await modelInstance.generateContent(fullPrompt);
    const responseText = result.response.text();

    return responseText;
}


interface HandleNormalMessageProps extends CreateMessageDto {
    addMessage: (message: CreateMessageDto) => Promise<any>;
}

// ! normal message
export const handleNormalMessage = async ({
    type,
    content,
    chatId,
    addMessage, 
    exhibits
}: HandleNormalMessageProps): Promise<any> => {
    try {
        const message: CreateMessageDto = {
            type,
            content,
            chatId,
            exhibits
        };

        return await addMessage(message);
    } catch (err: any) {
        console.error(err.message);
        return err;
    }
}
