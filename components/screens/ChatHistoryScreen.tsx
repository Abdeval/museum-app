
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import Iconify from "react-native-iconify"
import { useAddMessage, useChat, useDeleteChat } from "@/hooks/useChat"
import GlobalLoading from "../ui/loading/GlobalLoading"
import CustomHeader from "../ui/CustomHeader"
import EmptyHistory from "@/assets/images/history-empty.svg"
import { COLORS } from "@/constants/Colors"
import ChatHistoryItem from "../ui/ChatHistoryItem"
import { useState } from "react"

export default function ChatHistoryScreen({ userId }: { userId: number }) {
  const router = useRouter()
  const [isCreatingChat, setIsCreatingChat] = useState(false)

  // Get chat data and operations
  const { chats, isLoadingChats, createNewChat, deleteChat } = useChat(userId)

  const { addFirstMessage } = useAddMessage()
  const { deleteAllChats, isDeleting } = useDeleteChat()

  // Navigate to chat screen
  const navigateToChat = () => {
    router.push("/chat")
  }

  // Handle creating a new chat
  const handleAddNewChat = async () => {
    setIsCreatingChat(true)
    try {
      // Create a new chat and get the chat data
      const chatData: any = await createNewChat()

      if (chatData && chatData.id) {
        // Add the first bot message
        await addFirstMessage(chatData.id)

        // Navigate to chat screen
        navigateToChat()
      } else {
        console.error("Failed to create new chat")
      }
    } catch (error) {
      console.error("Error creating new chat:", error)
    } finally {
      setIsCreatingChat(false)
    }
  }

  // Render section header with clear all button
  const renderSectionHeader = ({
    section,
    index,
  }: {
    section: any
    index: number
  }) => (
    <View className="flex-row w-full justify-between items-center mb-2">
      <Text className="text-foreground font-bold text-lg">{section.title}</Text>
      {index === 0 && chats && chats.length > 0 && (
        <TouchableOpacity className="pr-4" onPress={() => deleteAllChats(userId)} disabled={isDeleting}>
          {isDeleting ? (
            <ActivityIndicator size="small" color={COLORS.light.primary} />
          ) : (
            <Text className="text-lg text-gray-600 dark:text-gray-300">Clear all</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  )

  if (isLoadingChats) {
    return <GlobalLoading page="Loading chats" />
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <CustomHeader content="Chat History" type="home" />
      <View className="h-[100px]" />
      <View className="flex-1 px-4">
        {chats && chats.length > 0 ? (
          <FlatList
            data={chats}
            keyExtractor={(item) => item.title}
            renderItem={({ item, index }) => (
              <View>
                {renderSectionHeader({ section: item, index })}
                {item.data.map((chat: any) => (
                  <ChatHistoryItem key={chat.id} item={chat} deleteChat={() => deleteChat(chat.id)} />
                ))}
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Iconify icon="mdi:chat-outline" size={60} color={COLORS.light.primary} />
            <EmptyHistory width={200} height={200} />
            <Text className="text-foreground text-lg mt-4">[ No chat history yet ]</Text>
            <Text className="text-gray-400 text-center mt-2 px-10">Start a new chat to begin exploring the museum</Text>
          </View>
        )}

        <TouchableOpacity
          className="bg-primary rounded-full p-4 items-center mb-[68px]"
          onPress={handleAddNewChat}
          disabled={isCreatingChat}
        >
          <View className="flex-row items-center">
            {isCreatingChat ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="add" size={20} color="white" />
                <Text className="text-white font-bold text-base ml-2">Start new chat</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
