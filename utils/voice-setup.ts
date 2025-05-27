import { Alert, Platform } from "react-native"
import Voice, { type SpeechResultsEvent } from "@react-native-voice/voice"
import { AudioModule } from "expo-audio"
import * as Speech from "expo-speech"

// Base interface with common properties
interface BaseVoiceProps {
  isMounted?: boolean
}

// Specific interface for voiceSetup function
interface VoiceSetupProps extends BaseVoiceProps {
  setIsVoiceAvailable: (value: boolean) => void
  setIsCheckingVoice: (value: boolean) => void
  setIsRecording: (value: boolean) => void
  stopPulseAnimation: () => void
  setInputText: (value: string) => void
  handleSendMessage: (text: string | undefined, isVoice: boolean) => void
}

// Specific interface for startRecording function
interface StartRecordingProps {
  setIsVoiceAvailable: (value: boolean) => void
  setIsRecording: (value: boolean) => void
  stopPulseAnimation: () => void
  startPulseAnimation: () => void
}

// Specific interface for stopRecording function
interface StopRecordingProps {
  isRecording?: boolean
  setIsRecording: (value: boolean) => void
  stopPulseAnimation: () => void
}

// Specific interface for toggleRecording function
interface ToggleRecordingProps {
  isRecording?: boolean
  setIsRecording: (value: boolean) => void
  setIsVoiceAvailable: (value: boolean) => void
  stopPulseAnimation: () => void
  startPulseAnimation: () => void
}

// Specific interface for speakText function
interface SpeakTextProps {
  text: string;
  setIsSpeaking: (value: boolean) => void;
  isSpeaking: boolean;
  lang: "en" | "fr" | "ar"
}

// Specific interface for stopSpeaking function
interface StopSpeakingProps {
  isSpeaking: boolean
  setIsSpeaking: (value: boolean) => void
}

// Specific interface for cleanupVoice function
interface CleanupVoiceProps {
  isSpeaking: boolean
  setIsSpeaking: (value: boolean) => void
}

// Initialize voice recognition and set up event listeners
export const voiceSetup = async ({
  isMounted = true,
  setIsVoiceAvailable,
  setIsCheckingVoice,
  setIsRecording,
  stopPulseAnimation,
  setInputText,
  handleSendMessage,
}: VoiceSetupProps): Promise<void> => {
  try {
    // Request microphone permission first
    const { granted } = await AudioModule.requestRecordingPermissionsAsync()
    if (!granted && isMounted) {
      console.warn("Microphone permission not granted")
      setIsVoiceAvailable(false)
      setIsCheckingVoice(false)
      return
    }

    // For Android, we need to manually set up Voice
    if (Platform.OS === "android") {
      // On Android, we'll assume voice is available if we have permissions
      // and handle errors when we actually try to use it
      if (isMounted) {
        setIsVoiceAvailable(true)
        setIsCheckingVoice(false)
      }
    } else {
      // For iOS, we can check if Voice is available
      try {
        const isAvailable = await Voice.isAvailable()
        if (isMounted) {
          setIsVoiceAvailable(!!isAvailable)
          setIsCheckingVoice(false)
        }

        if (!isAvailable) {
          console.warn("Voice recognition is not available on this device")
          return
        }
      } catch (error) {
        console.error("Error checking voice availability:", error)
        if (isMounted) {
          setIsVoiceAvailable(false)
          setIsCheckingVoice(false)
        }
        return
      }
    }

    // Set up event listeners
    Voice.onSpeechStart = () => {
      console.log("Speech started")
    }

    Voice.onSpeechEnd = () => {
      console.log("Speech ended")
      if (isMounted) {
        setIsRecording(false)
        stopPulseAnimation()
      }
    }

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value[0] && isMounted) {
        setInputText(e.value[0])
        // Auto-send the message after a short delay
        setTimeout(() => {
          if (isMounted) {
            handleSendMessage(e.value![0], true)
          }
        }, 500)
      }
    }

    Voice.onSpeechError = (e) => {
      console.error("Speech error:", e)
      if (isMounted) {
        setIsRecording(false)
        stopPulseAnimation()
      }

      if (e.error?.message && isMounted) {
        // Check for specific error messages that indicate voice is not available
        if (
          e.error.message.includes("not available") ||
          e.error.message.includes("missing") ||
          e.error.message.includes("permission")
        ) {
          setIsVoiceAvailable(false)
          Alert.alert(
            "Voice Recognition Unavailable",
            "Voice recognition is not available on this device. Please use text input instead."
          )
        } else {
          Alert.alert("Voice Recognition Error", e.error.message)
        }
      }
    }
  } catch (error) {
    console.error("Error setting up voice:", error)
    if (isMounted) {
      setIsVoiceAvailable(false)
      setIsCheckingVoice(false)
    }
  }
}

// Start voice recording
export const startRecording = async ({
  setIsVoiceAvailable,
  setIsRecording,
  stopPulseAnimation,
  startPulseAnimation,
}: StartRecordingProps): Promise<void> => {
  try {
    // Request microphone permission
    const { granted } = await AudioModule.requestRecordingPermissionsAsync()
    if (!granted) {
      Alert.alert("Permission Required", "Microphone permission is required for voice input")
      setIsVoiceAvailable(false)
      return
    }

    // Try to initialize Voice
    try {
      // Make sure Voice is destroyed and recreated to avoid issues
      await Voice.destroy()

      // Start voice recognition
      await Voice.start(Platform.OS === "ios" ? "en-US" : "")
      setIsRecording(true)
      startPulseAnimation()
    } catch (error: any) {
      // ! console.error("Error starting voice recording:", error)

      // Check if this is a "not available" error
      const errorMessage = error.message || String(error)
      if (
        errorMessage.includes("not available") ||
        errorMessage.includes("missing") ||
        errorMessage.includes("permission") ||
        errorMessage.includes("null") ||
        errorMessage.includes("undefined")
      ) {
        setIsVoiceAvailable(false)
        Alert.alert(
          "Voice Recognition Unavailable",
          "Voice recognition is not available on this device. Please use text input instead."
        )
      } else {
        Alert.alert(
          "Voice Recording Error",
          "Could not start voice recording. Please try again or use text input instead."
        )
      }

      setIsRecording(false)
      stopPulseAnimation()
    }
  } catch (error) {
    console.error("Error with permissions:", error)
    setIsVoiceAvailable(false)
    setIsRecording(false)
    stopPulseAnimation()
  }
}

// Stop voice recording
export const stopRecording = async ({
  isRecording,
  setIsRecording,
  stopPulseAnimation,
}: StopRecordingProps): Promise<void> => {
  try {
    if (isRecording) {
      await Voice.stop()
      setIsRecording(false)
      stopPulseAnimation()
    }
  } catch (error) {
    console.error("Error stopping voice recording:", error)
    setIsRecording(false)
    stopPulseAnimation()
  }
}

// Toggle voice recording
export const toggleRecording = ({
  isRecording,
  setIsRecording,
  setIsVoiceAvailable,
  stopPulseAnimation,
  startPulseAnimation,
}: ToggleRecordingProps): void => {
  if (isRecording) {
    stopRecording({ isRecording, setIsRecording, stopPulseAnimation })
  } else {
    startRecording({ setIsVoiceAvailable, setIsRecording, stopPulseAnimation, startPulseAnimation })
  }
}

// Speak text using text-to-speech
export const speakText = async ({ text, setIsSpeaking, isSpeaking, lang }: SpeakTextProps): Promise<void> => {
  // Stop any ongoing speech
  if (isSpeaking) {
    Speech.stop()
    setIsSpeaking(false);
    return;
  }

  // Start new speech
  setIsSpeaking(true)
  Speech.speak(text, {
    language: lang,
    pitch: 1.0,
    rate: 0.9,
    onDone: () => setIsSpeaking(false),
    onError: (error) => {
      console.error("Speech error:", error)
      setIsSpeaking(false)
    },
  })
}

// Stop speaking
export const stopSpeaking = ({ isSpeaking, setIsSpeaking }: StopSpeakingProps): void => {
  if (isSpeaking) {
    Speech.stop()
    setIsSpeaking(false)
  }
}

// Clean up voice resources
export const cleanupVoice = ({ isSpeaking, setIsSpeaking }: CleanupVoiceProps): void => {
  Voice.destroy().then(Voice.removeAllListeners)
  if (isSpeaking) {
    Speech.stop()
    setIsSpeaking(false)
  }
}
