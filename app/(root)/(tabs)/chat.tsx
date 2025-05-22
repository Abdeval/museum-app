"use client"

import { View } from "react-native"
import CustomHeader from "@/components/ui/CustomHeader"
import { useSession } from "@/context/AuthProvider"
import ChatbotScreen from "@/components/screens/ChatBotScreen"
import { useRouter } from "expo-router"
import GlobalLoading from "@/components/ui/loading/GlobalLoading"
import { useChatMessages } from "@/hooks/useChat"

export default function Chat() {
  const router = useRouter()
  const { user } = useSession()
  const userId = user?.id as number

  // Get current chat information
  const { chatId, isLoadingCurrentChat, clearCurrentChat } = useChatMessages(userId)

  // Navigate to chat history
  const navigateToHistoryChats = () => {
    router.push("/chat-history")
  }

  // Handle creating a new chat
  const handleAddNewChat = () => {
    // Clear the current chat and navigate to chat page
    // This will trigger the StartNewChat component to show
    clearCurrentChat()
    router.push("/chat")
  }

  if (!userId) {
    return <GlobalLoading page="Loading user" />
  }

  return (
    <View className="flex-1 w-full">
      <CustomHeader
        type="chat"
        content="Museum Guide"
        navigateToHistoryChats={navigateToHistoryChats}
        handleAddNewChat={handleAddNewChat}
      />
      <ChatbotScreen userId={userId} />
    </View>
  )
}
