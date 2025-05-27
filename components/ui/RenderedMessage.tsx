
import { View, Text, FlatList, TouchableOpacity } from "react-native"
import { memo, useCallback, useMemo } from "react"
import ExhibitCard from "./ExhibitCard"
import Iconify from "react-native-iconify"
import type { MessageType } from "@/types"
import { COLORS } from "@/constants/Colors"

interface RenderedMessageProps {
  item: MessageType
  handleSpeakText: (text: string) => void
  navigateToExhibit: (exhibitId: number) => void
  isSpeaking: boolean
}

// Memoized ExhibitCard wrapper to prevent unnecessary re-renders
const MemoizedExhibitCard = memo(({ exhibit, onPress }: { exhibit: any; onPress: () => void }) => (
  <ExhibitCard exhibit={exhibit} onPress={onPress} />
))

const RenderedMessage = memo(({ item, handleSpeakText, navigateToExhibit, isSpeaking }: RenderedMessageProps) => {
  // Memoize callbacks to prevent re-creation on every render
  const onSpeakPress = useCallback(() => {
    handleSpeakText(item.content)
  }, [handleSpeakText, item.content])

  // Memoize the exhibit navigation callback
  const onExhibitPress = useCallback(
    (exhibitId: number) => {
      navigateToExhibit(exhibitId)
    },
    [navigateToExhibit],
  )

  // Memoize the renderItem function for the exhibits FlatList
  const renderExhibitItem = useCallback(
    ({ item: exhibit }: { item: any }) => (
      <MemoizedExhibitCard exhibit={exhibit} onPress={() => onExhibitPress(exhibit.id)} />
    ),
    [onExhibitPress],
  )

  // Memoize the keyExtractor for exhibits
  const exhibitKeyExtractor = useCallback((exhibit: any) => exhibit.id.toString(), [])

  // Memoize computed values
  const isUserMessage = useMemo(() => item.sender === "USER", [item.sender])
  const isBotMessage = useMemo(() => item.sender === "BOT", [item.sender])
  const hasExhibits = useMemo(() => item?.exhibits && item.exhibits.length > 0, [item.exhibits])

  // If message has exhibits, render the horizontal exhibit list
  if (hasExhibits) {
    return (
      <View className="mb-4">
        <Text className="text-gray-600 mb-2 ml-4">{item.content}</Text>
        <FlatList
          data={item.exhibits}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderExhibitItem}
          keyExtractor={exhibitKeyExtractor}
          className="pl-2"
          // Performance optimizations for horizontal list
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={50}
          initialNumToRender={3}
          windowSize={5}
        />
      </View>
    )
  }

  // Regular message rendering
  return (
    <View
      className={`rounded-2xl px-4 py-3 max-w-[85%] mb-2 ${
        isUserMessage ? "bg-primary self-end rounded-tr-none" : "bg-secondary self-start rounded-tl-none"
      }`}
    >
      <View className="flex-row items-center">
        {item.isVoice && isUserMessage && (
          <Iconify icon="mdi:microphone" size={16} color="white" style={{ marginRight: 6 }} />
        )}
        <Text className={`text-base ${isUserMessage ? "text-white" : "text-gray-800 dark:text-white"}`}>
          {item.content}
        </Text>
      </View>

      {isBotMessage && (
        <TouchableOpacity onPress={onSpeakPress} className="self-end mt-1" activeOpacity={0.7}>
          <Iconify icon={isSpeaking ? "mdi:volume-high" : "mdi:volume-medium"} size={18} color={COLORS.light.primary} />
        </TouchableOpacity>
      )}
    </View>
  )
})

MemoizedExhibitCard.displayName = "MemoizedExhibitCard"
RenderedMessage.displayName = "RenderedMessage"

export default RenderedMessage
