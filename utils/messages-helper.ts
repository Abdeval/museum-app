import { GEMINI_API_KEY } from "@/constants";
import { MUSEUM_INFO } from "@/lib/data";
import { Message } from "@/server/generated/prisma";
import { CreateMessageDto } from "@/server/src/chat/chat.dto";
import { ExhibitType } from "@/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { add } from "lodash";
import { Alert, Keyboard } from "react-native";

export interface HandleSendMessageProps {
    text: string;
    isVoiceInput: boolean;
    addMessage: (dto: CreateMessageDto) => void;
    setInputText: (value: string) => void;
    setIsLoading: (value: boolean) => void;
    messages: Message[];
    exhibits: ExhibitType[]
    handleSpeakText: (value: string) => void;
    chatId: number;
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
    chatId
}:
    HandleSendMessageProps
) => {
   
    if (!text || text.trim() === "") return;

    const userMessage = {
        content: text,
        type: "USER",
        chatId,
    };

    // todo: add the test to the message
    addMessage(userMessage);
    setInputText("");
    setIsLoading(true);
    Keyboard.dismiss();

    // ! train the model to deal with arabic and english
    const SYSTEM_PROMPT = `
You are a helpful and bilingual (Arabic/English) museum guide chatbot for the AMUSE museum. You should respond in the language the user used (Arabic or English).

- If the user speaks Arabic, respond in Arabic.
- If the user speaks English, respond in English.

Museum Information (in Arabic):
الاسم: ${MUSEUM_INFO.name}
الوصف: ${MUSEUM_INFO.description}
الموقع: ${MUSEUM_INFO.location}
ساعات العمل: ${MUSEUM_INFO.hours}
رسوم الدخول: ${MUSEUM_INFO.admission}
الميزات الخاصة: ${MUSEUM_INFO.specialFeatures}

When recommending exhibits, use the tag [EXHIBIT_RECOMMENDATIONS] followed by the exhibit IDs separated by commas.
Example: [EXHIBIT_RECOMMENDATIONS:1,3,5]

Available Exhibits:
${exhibits.map(ex => `ID: ${ex.id} - ${ex.title} - ${ex.thematic_category} - ${ex.description.substring(0, 100)}...`).join("\n")}

Keep your tone friendly and informative. If unsure about a question, admit it politely and suggest alternatives.
`;

    try {
        const apiKey = GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error(
                "Gemini API key not found. Please check your environment variables."
            );
        }
        // ! Initialize the Gemini API
        const genAI = new GoogleGenerativeAI(apiKey);

        //!  For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // ! Create the conversation history for context
        const conversationHistory = messages
            .map((msg) => {
                if (msg.sender === "USER") return `User: ${msg.content}`;
                if (msg.sender === "BOT") return `Guide: ${msg.content}`;
                return "";
            })
            .filter(Boolean)
            .join("\n");

        // todo: Prepare the prompt with system instructions and conversation history
        const fullPrompt = `${SYSTEM_PROMPT}\n\n${conversationHistory}\nUser: ${text}\nGuide:`;

        // ! Generate content
        const result = await model.generateContent(fullPrompt);
        const responseText = result.response.text();

        // Check if the response contains exhibit recommendations
        const recommendationMatch = responseText.match(
            /\[EXHIBIT_RECOMMENDATIONS:(.*?)\]/
        );

        if (recommendationMatch) {
            // ! Extract the exhibit IDs
            const exhibitIds = recommendationMatch[1]
                .split(",")
                .map((id) => id.trim());

            // ! Filter the text to remove the recommendation tag
            const cleanedText = responseText
                .replace(/\[EXHIBIT_RECOMMENDATIONS:.*?\]/, "")
                .trim();

            // ! Add the bot message
            const botMessage = {
                content: cleanedText,
                type: "BOT",
                chatId: chatId,
            };

            // ! here the message will be added to the messages list of the chat
            addMessage(botMessage);

            // Find the recommended exhibits
            console.log("exhibitIds: ", exhibits);

            const recommendedExhibits = exhibits.filter((exhibit) => {
                const exhibitId = exhibit.id.toString();
                return exhibitIds.includes(exhibitId);
            });
            
            const recommendedExhibitsIds = recommendedExhibits.map(ex => ex.id);
            console.log("Recommended Exhibits IDs: ", recommendedExhibitsIds);

            // todo: Add the recommendation message
            const recommendationMessage = {
                content: "Here are some exhibits you might enjoy:",
                type: "BOT",
                exhibits: recommendedExhibitsIds,
                chatId: chatId,
            };

            addMessage(recommendationMessage);

            // If this was a voice input, speak the response
            if (isVoiceInput) {
                handleSpeakText(cleanedText);
            }
        } else {

            // ! Just add the bot message without recommendations
            const botMessage: CreateMessageDto = {
                content: responseText,
                type: "BOT",
                chatId: chatId,
            };

            addMessage(botMessage);

            // ! If this was a voice input, speak the response
            if (isVoiceInput) {
                handleSpeakText(responseText);
            }
        }
    } catch (error: any) {
        console.error("Error generating response:", error);

        // ! Add error message
        const errorMessage: CreateMessageDto = {
            content:
                "I'm sorry, I'm having trouble connecting right now. Please check your API key or try again later.",
            type: "BOT",
            chatId: chatId
        };

        // ! just render the message without adding it in the db
        // ? but in this case we will add it 
        addMessage(errorMessage);

        // ! Show alert with more details in development
        if (__DEV__) {
            Alert.alert("Error", error.message || "Failed to generate response");
        }
    } finally {
        setIsLoading(false);
    }
};