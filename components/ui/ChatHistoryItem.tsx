
import { View, Text, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import Iconify from "react-native-iconify"
import { useChatMessages } from "@/hooks/useChat"
import { formatDate } from "@/utils/date-helpers"

interface ChatHistoryItemProps {
  item: any
  deleteChat: () => void
}

export default function ChatHistoryItem({ item, deleteChat }: ChatHistoryItemProps) {
  const router = useRouter()
  const { setCurrentChat } = useChatMessages(item.userId)

  // Format the date for display
  const formattedDate = formatDate(item.createdAt)

  // Get the first message content for preview
  const previewMessage =
    item.messages && item.messages.length > 0
      ? item.messages[0].content.substring(0, 50) + (item.messages[0].content.length > 50 ? "..." : "")
      : "No messages yet"

  const handleSelectChat = async () => {
    // Set this chat as the current chat
    await setCurrentChat(item.id)
    // Navigate to the chat screen
    router.push("/chat")
  }

  return (
    <TouchableOpacity className="bg-card rounded-lg p-4 mb-3 shadow-sm" onPress={handleSelectChat}>
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-2">
          <Text className="text-foreground font-semibold text-base mb-1">{item.title || "Chat " + item.id}</Text>
          <Text className="text-gray-500 text-sm mb-2">{formattedDate}</Text>
          <Text className="text-foreground text-sm" numberOfLines={2}>
            {previewMessage}
          </Text>
        </View>

        <TouchableOpacity
          className="p-2"
          onPress={(e) => {
            e.stopPropagation()
            deleteChat()
          }}
        >
          <Iconify icon="solar:trash-bin-trash-bold-duotone" size={20} color="#FF5555" />
        </TouchableOpacity>
      </View>

      <View className="flex-row mt-3">
        <View className="bg-primary/20 rounded-full px-3 py-1 mr-2">
          <Text className="text-primary text-xs">{item.messages?.length || 0} messages</Text>
        </View>

        {item.exhibits && item.exhibits.length > 0 && (
          <View className="bg-secondary/30 rounded-full px-3 py-1">
            <Text className="text-secondary-foreground text-xs">{item.exhibits.length} exhibits</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}
