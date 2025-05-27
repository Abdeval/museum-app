
import { View, Text, TouchableOpacity } from "react-native"
import { memo, useCallback, useMemo } from "react"
import { useRouter } from "expo-router"
import Iconify from "react-native-iconify"
import { useChatMessages } from "@/hooks/useChat"
import { formatDate } from "@/utils/date-helpers"
import TransText from "./TransText"
import { useTranslation } from "react-i18next"
import LRView from "./LRView"
import type { ChatHistoryItemType } from "@/types"

interface ChatHistoryItemProps {
  item: ChatHistoryItemType
  deleteChat: () => void
  userId: number
}

const ChatHistoryItem = memo(({ item, deleteChat, userId }: ChatHistoryItemProps) => {
  const router = useRouter()
  const { setCurrentChat } = useChatMessages(userId)
  const { t } = useTranslation()

  // Memoize computed values
  const formattedDate = useMemo(() => formatDate(item.timestamp, t), [item.timestamp, t])
  const chatTitle = useMemo(() => `${t("navigation.chatbot")} ${item.id}`, [t, item.id])
  const messageCount = useMemo(() => item?.messages || 0, [item.messages])
  const exhibitCount = useMemo(() => item?.exhibits || 0, [item.exhibits])

  // Memoize callbacks
  const handleSelectChat = useCallback(async () => {
    await setCurrentChat(item.id)
    router.push("/chat")
  }, [setCurrentChat, item.id, router])

  const handleDeletePress = useCallback(
    (e: any) => {
      e.stopPropagation()
      deleteChat()
    },
    [deleteChat],
  )

  return (
    <TouchableOpacity
      className="bg-card dark:bg-black rounded-lg p-4 mb-3 shadow-sm"
      onPress={handleSelectChat}
      activeOpacity={0.7}
    >
      <LRView className="justify-between items-start">
        <View className="mr-2">
          <Text className="text-foreground font-semibold text-base mb-1">{chatTitle}</Text>
          <Text className="text-gray-500 text-sm mb-2">{formattedDate}</Text>
          <TransText title={item.preview} className="text-foreground text-sm" numberOfLines={2} />
        </View>
        <TouchableOpacity className="p-2" onPress={handleDeletePress}>
          <Iconify icon="solar:trash-bin-trash-bold-duotone" size={20} color="#FF5555" />
        </TouchableOpacity>
      </LRView>

      <LRView className="mt-3 gap-40">
        <View className="bg-primary/20 rounded-full px-3 py-1 mr-2">
          <TransText title="chatbot.messages" number={messageCount} className="text-primary text-xs" />
        </View>

        <View className="bg-secondary/30 rounded-full px-3 py-1">
          <Text className="text-secondary-foreground text-xs">{exhibitCount} exhibits</Text>
        </View>
      </LRView>
    </TouchableOpacity>
  )
})

ChatHistoryItem.displayName = "ChatHistoryItem"

export default ChatHistoryItem
