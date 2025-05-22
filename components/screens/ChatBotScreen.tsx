
import { COLORS } from "@/constants/Colors"
import { useAddMessage, useChatMessages } from "@/hooks/useChat"
import { handleSendMessage } from "@/utils/messages-helper"
import { cleanupVoice, speakText, toggleRecording, voiceSetup } from "@/utils/voice-setup"
import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import Iconify from "react-native-iconify"
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import RenderedMessage from "../ui/RenderedMessage"
import StartNewChat from "../ui/StartNewChat"
import GlobalLoading from "../ui/loading/GlobalLoading"
import { useExhibit } from "@/hooks/useExhibit"

export default function ChatbotScreen({ userId }: { userId: number }) {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  // Enhanced hooks with better state management
  const { chatId, messages, isLoadingMessages, isLoadingCurrentChat } = useChatMessages(userId)

  const { addMessage, isAddingMessage } = useAddMessage()
  const { exhibits } = useExhibit({ search: false })

  // UI state
  const [inputText, setInputText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isVoiceAvailable, setIsVoiceAvailable] = useState(false)
  const [isCheckingVoice, setIsCheckingVoice] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const flatListRef = useRef<FlatList>(null)

  // Animation for voice recording
  const pulseAnimation = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnimation.value }],
      opacity: pulseAnimation.value * 0.8 + 0.2,
    }
  })

  // Send message handler
  const sendMessage = (text = inputText, isVoice = false) => {
    if (!chatId || !text.trim()) return

    handleSendMessage({
      text,
      isVoiceInput: isVoice,
      addMessage,
      setInputText,
      setIsLoading,
      messages: messages || [],
      exhibits: exhibits || [],
      handleSpeakText,
      chatId,
    })
  }

  // Initialize voice recognition
  useEffect(() => {
    const isMounted = true
    setIsCheckingVoice(true)

    // Set up voice recognition
    voiceSetup({
      isMounted,
      setIsVoiceAvailable,
      setIsCheckingVoice,
      setIsRecording,
      stopPulseAnimation,
      setInputText,
      handleSendMessage: sendMessage,
    })

    // Cleanup
    return () => {
      cleanupVoice({
        isSpeaking,
        setIsSpeaking,
      })
    }
  }, [chatId]) // Re-initialize when chat changes

  // Scroll to bottom when new messages arrive or when keyboard appears
  useEffect(() => {
    if (messages && messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }

    // Add keyboard listeners to scroll to bottom when keyboard appears
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      if (flatListRef.current) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true })
        }, 100)
      }
    })

    return () => {
      keyboardDidShowListener.remove()
    }
  }, [messages])

  // Animation functions
  const startPulseAnimation = () => {
    pulseAnimation.value = withRepeat(withTiming(1.2, { duration: 1000 }), -1, true)
  }

  const stopPulseAnimation = () => {
    pulseAnimation.value = withTiming(1, { duration: 300 })
  }

  // Toggle voice recording
  const handleToggleRecording = () => {
    toggleRecording({
      isRecording,
      setIsRecording,
      setIsVoiceAvailable,
      stopPulseAnimation,
      startPulseAnimation,
    })
  }

  // Handle text-to-speech
  const handleSpeakText = (text: string) => {
    speakText({
      text,
      setIsSpeaking,
      isSpeaking,
    })
  }

  // Navigate to exhibit details
  const navigateToExhibit = (exhibitId: number) => {
    router.push(`/exhibit/${exhibitId}`)
  }

  // Show loading state while fetching chat data
  if (isLoadingCurrentChat) return <GlobalLoading page="chat" />

  // Show start new chat screen if no chat exists
  if (!chatId) return <StartNewChat userId={userId}/>

  // Determine if we're in a loading state
  const isInLoadingState = isLoadingMessages || isAddingMessage || isLoading

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.bottom + 60 : 0}
        style={{ flex: 1 }}
      >
        <View className="flex-1">
          {/* Space for header */}
          <View className="h-[100px]" />

          {/* Messages list */}
          <FlatList
            ref={flatListRef}
            data={messages || []}
            renderItem={({ item }) => (
              <RenderedMessage
                isSpeaking={isSpeaking}
                item={item}
                navigateToExhibit={navigateToExhibit}
                handleSpeakText={handleSpeakText}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 16,
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            // ListEmptyComponent={() => (
            //   <View className="flex-1 justify-center items-center mt-10">
            //     <Iconify icon="mdi:chat-outline" size={40} color={COLORS.light.primary} />
            //     <View className="mt-4 p-4 bg-secondary rounded-lg">
            //       <Iconify icon="mdi:robot-outline" size={24} color={COLORS.light.primary} className="mb-2" />
            //       <View className="h-4 w-20 bg-gray-300 rounded animate-pulse mb-2" />
            //       <View className="h-4 w-40 bg-gray-300 rounded animate-pulse" />
            //     </View>
            //   </View>
            // )}
          />

          {/* Loading indicator */}
          {isInLoadingState && (
            <View className="self-start ml-4 mb-2">
              <View className="bg-secondary rounded-2xl p-3 rounded-tl-none">
                <ActivityIndicator size="small" color={COLORS.light.primary} />
              </View>
            </View>
          )}

          {/* Input area */}
          <View className="sticky border-t border-border p-3 flex-row items-center bg-white dark:bg-background">
            <TextInput
              className="flex-1 bg-primary/40 dark:bg-primary rounded-full px-4 py-2 mr-2 text-base"
              placeholder="Ask about exhibits..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              style={{ maxHeight: 100 }}
            />

            {/* Voice input button */}
            {(isVoiceAvailable || isCheckingVoice) && (
              <TouchableOpacity
                onPress={handleToggleRecording}
                disabled={isCheckingVoice || isInLoadingState}
                className={`rounded-full p-2 mr-2 ${
                  isRecording
                    ? "bg-red-500"
                    : isCheckingVoice
                      ? "bg-gray-200 dark:bg-gray-400"
                      : "bg-gray-300 dark:bg-gray-400"
                }`}
              >
                {isRecording ? (
                  <Animated.View style={animatedStyle}>
                    <Iconify icon="mdi:microphone" size={24} color="white" />
                  </Animated.View>
                ) : isCheckingVoice ? (
                  <ActivityIndicator size="small" color="#555" />
                ) : (
                  <Iconify icon="mdi:microphone-outline" size={24} color="#555" />
                )}
              </TouchableOpacity>
            )}

            {/* Send button */}
            <TouchableOpacity
              onPress={() => sendMessage()}
              disabled={inputText.trim() === "" || isInLoadingState}
              className={`rounded-full p-2 ${
                inputText.trim() === "" || isInLoadingState ? "bg-gray-300" : "bg-primary"
              }`}
            >
              <Iconify
                icon="mingcute:send-fill"
                size={24}
                color={inputText.trim() === "" || isInLoadingState ? "#999" : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
