import CustomHeader from "@/components/ui/CustomHeader"
import Overlay from "@/components/ui/Overlay"
import { Ionicons } from "@expo/vector-icons"
import { useCameraPermissions } from "expo-camera"
import { useEffect, useRef, useState, useCallback } from "react"
import { ActivityIndicator, AppState, Linking, Text, TouchableOpacity, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import CameraManager from "@/components/ui/CameraManager"
import GlobalLoading from "@/components/ui/loading/GlobalLoading"
import { COLORS } from "@/constants/Colors"

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions()
  const [isScanning, setIsScanning] = useState(true)
  const [flashOn, setFlashOn] = useState(false)
  const [isScreenFocused, setIsScreenFocused] = useState(true)
  const [cameraReady, setCameraReady] = useState(false)

  const qrLock = useRef(false)
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    let isMounted = true

    const initializeCamera = async () => {
      if (!permission?.granted) {
        await requestPermission()
      }

      // Reset scanning state when returning to this screen
      if (isMounted) {
        qrLock.current = false
        setIsScanning(true)
      }
    }

    // Initialize camera when component mounts
    initializeCamera()

    // Handle app state changes
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        // App has come to the foreground
        initializeCamera()
      }
      appState.current = nextAppState
    })

    return () => {
      isMounted = false
      subscription.remove()
    }
  }, [permission, requestPermission])

  const handleBarCodeScanned = ({ data }:{ data: any }) => {
    if (data && !qrLock.current) {
      qrLock.current = true
      setIsScanning(false)

      // Visual feedback before opening URL
      setTimeout(async () => {
        try {
          await Linking.openURL(data)
        } catch (error) {
          console.error("Could not open URL:", error)
          // Reset lock if URL couldn't be opened
          qrLock.current = false
          setIsScanning(true)
        }
      }, 800)
    }
  }

  const toggleFlash = () => {
    setFlashOn((prev) => !prev)
  }

  const resetScanner = () => {
    qrLock.current = false
    setIsScanning(true)
  }

  useFocusEffect(
    useCallback(() => {
      // This runs when the screen comes into focus
      setIsScreenFocused(true)

      const resetCamera = async () => {
        // Small delay to ensure proper initialization
        setTimeout(() => {
          qrLock.current = false
          setIsScanning(true)
          setCameraReady(true)
        }, 300)
      }

      resetCamera()

      return () => {
        // This runs when the screen goes out of focus
        setIsScreenFocused(false)
        setCameraReady(false)
      }
    }, []),
  )
  
  // ! requesting the camera permission
  if (!permission) return <GlobalLoading page="Camera"/>


  if (!permission.granted) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-white text-xl font-bold">Camera Permission Required</Text>
        <Text className="text-white text-base text-center mt-5 px-8">
          We need camera access to scan exhibit QR codes
        </Text>
        <TouchableOpacity className="bg-primary px-8 py-4 rounded-lg mt-5" onPress={requestPermission}>
          <Text className="text-white text-base font-bold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <CustomHeader type="scan" content="Scan exhibit" />

      <View className="flex-1 relative">
        <CameraManager
          isActive={appState.current === "active" && isScreenFocused}
          flashOn={flashOn}
          isScanning={isScanning}
          onBarcodeScanned={handleBarCodeScanned}
        />

        <Overlay isScanning={isScanning} />

        <View className="absolute bottom-24 left-0 right-0 items-center">
          <Text className="text-white text-base bg-white/30 px-5 py-2.5 rounded-full overflow-hidden">
            Position the QR code within the frame to scan
          </Text>
        </View>
      </View>

      <View className="flex-row justify-around items-center py-5 ">
        <TouchableOpacity className="items-center p-2.5" onPress={toggleFlash} activeOpacity={0.7}>
          <Ionicons name={flashOn ? "flash" : "flash-off"} size={24} color={flashOn ? COLORS.light.primary : COLORS.light.icon} />
          <Text className={`mt-1 text-xs ${flashOn ? "text-primary" : "text-foreground"}`}>
            {flashOn ? "Flash On" : "Flash Off"}
          </Text>
        </TouchableOpacity>

        {!isScanning && (
          <TouchableOpacity className="bg-primary px-8 py-3 rounded-full" onPress={resetScanner} activeOpacity={0.7}>
            <Text className="text-white text-base font-bold">Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}
