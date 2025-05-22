// import { View, Text, Image, TouchableOpacity } from "react-native";
// import React from "react";
// import { Ionicons } from "@expo/vector-icons";

// interface StartNewChatProps {
//   handleAddNewChat: () => void;
// }

// export default function StartNewChat({ handleAddNewChat }: StartNewChatProps) {
//   return (
//     <View className="items-center gap-4 justify-center flex-1 bg-background">
//       <Image
//         source={require("@/assets/images/chatbot.png")}
//         resizeMode="contain"
//         className="w-[100px] h-[100px]"
//       />

//       <TouchableOpacity
//         className="mt-4 bg-primary rounded-full p-4 items-center mb-[68px]"
//         onPress={handleAddNewChat}
//       >
//         <View className="flex-row items-center">
//           <Ionicons name="add" size={24} color="white" />
//           <Text className="text-white font-bold text-base ml-2">
//             Start new chat
//           </Text>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// }



import { View, Text, TouchableOpacity } from "react-native"
import { COLORS } from "@/constants/Colors"
import { useAddMessage, useChat } from "@/hooks/useChat"
import { useRouter } from "expo-router"
import Iconify from "react-native-iconify"
import { useState } from "react"
import GlobalLoading from "./loading/GlobalLoading"
import { Ionicons } from "@expo/vector-icons"

export default function StartNewChat({ userId }: { userId: number }) {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const { createNewChat } = useChat(userId)
  const { addFirstMessage } = useAddMessage()

  const handleAddNewChat = async () => {
    setIsCreating(true)
    try {
      // Create a new chat and get the chat data
      const chatData:any = await createNewChat()

      if (chatData && chatData.id) {
        // Add the first bot message
        await addFirstMessage(chatData.id)

        // Navigate to chat history to see all chats
        router.push("/chat-history")
      } else {
        console.error("Failed to create new chat")
      }
    } catch (error) {
      console.error("Error creating new chat:", error)
    } finally {
      setIsCreating(false)
    }
  }

  if (isCreating) {
    return <GlobalLoading page="Creating new chat" />
  }

  return (
    <View className="flex-1 justify-center items-center p-6 bg-background">
      <Iconify icon="mdi:robot-outline" size={80} color={COLORS.light.primary} />

      <Text className="text-foreground text-2xl font-bold mt-6 text-center">Welcome to the Museum Guide</Text>

      <Text className="text-gray-500 text-center mt-4 mb-8">
        Start a new chat to begin exploring the museum with our AI assistant. You can ask about exhibits, get
        recommendations, or learn about the museum{"'"}s history.
      </Text>

      <TouchableOpacity className="bg-primary rounded-full py-4 px-8 w-full items-center" onPress={handleAddNewChat}>
        <View className="flex-row items-center">
          <Ionicons name="add" size={24} color="white" />
          <Text className="text-white font-bold text-lg ml-2">Start New Chat</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity className="mt-4" onPress={() => router.push("/chat-history")}>
        <Text className="text-primary font-medium text-base">View Chat History</Text>
      </TouchableOpacity>
    </View>
  )
}

