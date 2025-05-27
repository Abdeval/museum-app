
import { View, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import Iconify from "react-native-iconify"
import { useChat, useDeleteChat } from "@/hooks/useChat"
import GlobalLoading from "../ui/loading/GlobalLoading"
import CustomHeader from "../ui/CustomHeader"
import EmptyHistory from "@/assets/images/history-empty.svg"
import { COLORS } from "@/constants/Colors"
import ChatHistoryItem from "../ui/ChatHistoryItem"
import { useState, useCallback, useMemo } from "react"
import TransText from "../ui/TransText"
import LRView from "../ui/LRView"
import type { ListRenderItem } from "react-native"

interface ChatGroup {
  title: string
  data: any[]
}

export default function ChatHistoryScreen({ userId }: { userId: number }) {
  const router = useRouter()
  const [isCreatingChat, setIsCreatingChat] = useState(false)

  // Get chat data and operations
  const { chats, isLoadingChats, deleteChat, addChat } = useChat(userId)
  const { deleteAllChats, isDeleting } = useDeleteChat()

  // Memoize callbacks
  const navigateToChat = useCallback(() => {
    router.push("/chat")
  }, [router])

  const handleDeleteChat = useCallback(
    (chatId: number) => {
      deleteChat(chatId)
    },
    [deleteChat],
  )

  const handleDeleteAllChats = useCallback(() => {
    deleteAllChats(userId)
  }, [deleteAllChats, userId])

  // Handle creating a new chat
  const handleAddNewChat = useCallback(async () => {
    setIsCreatingChat(true)
    try {
      const chatData: any = await addChat({ userId, title: "new chat" })

      if (chatData) {
        console.log("created a new chat from the chatHistory: ", chatData)
        navigateToChat()
      } else {
        console.error("Failed to create new chat")
      }
    } catch (error) {
      console.error("Error creating new chat:", error)
    } finally {
      setIsCreatingChat(false)
    }
  }, [addChat, userId, navigateToChat])

  // Memoize the renderSectionHeader function
  const renderSectionHeader = useCallback(
    ({ section, index }: { section: any; index: number }) => (
      <LRView className="flex-row w-full justify-between items-center mb-2">
        <TransText title={`date.${section.title}`} className="text-foreground font-bold text-lg" />
        {index === 0 && chats && chats.length > 0 && (
          <TouchableOpacity className="pr-4" onPress={handleDeleteAllChats} disabled={isDeleting}>
            {isDeleting ? (
              <ActivityIndicator size="small" color={COLORS.light.primary} />
            ) : (
              <TransText title="history.clearAll" className="text-lg text-gray-600 dark:text-gray-300" />
            )}
          </TouchableOpacity>
        )}
      </LRView>
    ),
    [chats, isDeleting, handleDeleteAllChats],
  )

  // Memoize the renderItem function
  const renderChatGroup: ListRenderItem<ChatGroup> = useCallback(
    ({ item, index }) => (
      <View>
        {renderSectionHeader({ section: item, index })}
        {item.data.map((chat: any) => (
          <ChatHistoryItem userId={userId} key={chat.id} item={chat} deleteChat={() => handleDeleteChat(chat.id)} />
        ))}
      </View>
    ),
    [renderSectionHeader, userId, handleDeleteChat],
  )

  // Memoize the keyExtractor
  const keyExtractor = useCallback((item: ChatGroup) => item.title, [])

  // Memoize the empty component
  const EmptyComponent = useMemo(
    () => (
      <View className="flex-1 justify-center items-center">
        <Iconify icon="mdi:chat-outline" size={60} color={COLORS.light.primary} />
        <EmptyHistory width={200} height={200} />
        <TransText title="history.noHistory" className="text-foreground text-lg mt-4" />
        <TransText title="history.start" className="text-gray-400 text-center mt-2 px-10 text-xl" />
      </View>
    ),
    [],
  )

  if (isLoadingChats) {
    return <GlobalLoading page="chat" />
  }

  return (
    <SafeAreaView className="flex-1">
      <CustomHeader content="history" type="home" />
      <View className="h-[100px]" />
      <View className="flex-1 px-4">
        {chats && chats.length > 0 ? (
          <FlatList
            data={chats}
            keyExtractor={keyExtractor}
            renderItem={renderChatGroup}
            showsVerticalScrollIndicator={false}
            // Performance optimizations
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            updateCellsBatchingPeriod={50}
            initialNumToRender={5}
            windowSize={5}
          />
        ) : (
          EmptyComponent
        )}

        <TouchableOpacity
          className="bg-primary rounded-full p-4 items-center mb-14"
          onPress={handleAddNewChat}
          disabled={isCreatingChat}
        >
          <View className="flex-row items-center">
            {isCreatingChat ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="add" size={20} color="white" />
                <TransText title="chatbot.start" className="text-primary-foreground font-bold text-base ml-2" />
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
