
import CustomHeader from "@/components/ui/CustomHeader"
import Overlay from "@/components/ui/Overlay"
import { Ionicons } from "@expo/vector-icons"
import { useCameraPermissions } from "expo-camera"
import { useEffect, useRef, useState, useCallback } from "react"
import { AppState, Alert, TouchableOpacity, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { useRouter } from "expo-router"
import CameraManager from "@/components/ui/CameraManager"
import GlobalLoading from "@/components/ui/loading/GlobalLoading"
import { COLORS } from "@/constants/Colors"
import TransText from "@/components/ui/TransText"
// import { useExhibit } from "@/hooks/useExhibit"
import { vibrate } from "@/utils/haptics"
import { getExhibitById } from "@/hooks/useExhibit"

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions()
  const [isScanning, setIsScanning] = useState(true)
  const [flashOn, setFlashOn] = useState(false)
  const [isScreenFocused, setIsScreenFocused] = useState(true)
  const [cameraReady, setCameraReady] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)

  const router = useRouter()
  // const { getExhibitById } = useExhibit({ search: false })

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
        setScanResult(null)
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

  // Function to parse exhibit QR codes
  const parseExhibitQR = (data: string): { isExhibit: boolean; exhibitId?: number } => {
    try {
      // Check if it's a URL with our exhibit format
      if (data.includes("exhibit=")) {
        // Extract exhibit ID from URL parameter
        const match = data.match(/exhibit=(\d+)/)
        if (match && match[1]) {
          return { isExhibit: true, exhibitId: Number.parseInt(match[1], 10) }
        }
      }

      // Check if it's a direct exhibit ID format (e.g., "EXHIBIT:123")
      if (data.startsWith("EXHIBIT:")) {
        const id = Number.parseInt(data.split(":")[1], 10)
        if (!isNaN(id)) {
          return { isExhibit: true, exhibitId: id }
        }
      }

      // Check if it's just a number (simple exhibit ID)
      const numericId = Number.parseInt(data, 10)
      if (!isNaN(numericId) && data.trim() === numericId.toString()) {
        return { isExhibit: true, exhibitId: numericId }
      }

      // Not an exhibit QR code
      return { isExhibit: false }
    } catch (error) {
      console.error("Error parsing QR code:", error)
      return { isExhibit: false }
    }
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (data && !qrLock.current) {
      qrLock.current = true
      setIsScanning(false)
      setScanResult(data)

      // Provide haptic feedback
      vibrate()

      // Parse the QR code
      const { isExhibit, exhibitId } = parseExhibitQR(data)

      if (isExhibit && exhibitId) {
        // Check if the exhibit exists in our database
        const exhibit = await getExhibitById(exhibitId)
        console.log("exhibit: ", exhibit);
        if (exhibit) {
          // Navigate to the exhibit detail page after a short delay
          setTimeout(() => {
            router.push(`/exhibit/${exhibitId}`)
          }, 800)
        } else {
          // Exhibit not found
          setTimeout(() => {
            Alert.alert(
              "Exhibit Not Found",
              "The scanned exhibit could not be found. Please try scanning a different QR code.",
              [{ text: "OK", onPress: resetScanner }],
            )
          }, 500)
        }
      } else {
        // Not an exhibit QR code
        setTimeout(() => {
          Alert.alert(
            "Invalid QR Code",
            "This QR code is not associated with any exhibit. Please scan an exhibit QR code.",
            [{ text: "OK", onPress: resetScanner }],
          )
        }, 500)
      }
    }
  }

  const toggleFlash = () => {
    setFlashOn((prev) => !prev)
  }

  const resetScanner = () => {
    qrLock.current = false
    setIsScanning(true)
    setScanResult(null)
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
          setScanResult(null)
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

  // Requesting the camera permission
  if (!permission) return <GlobalLoading page="Camera" />

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <TransText title="scanner.camera.title" className="text-foreground text-xl font-bold" />
        <TransText title="scanner.camera.message" className="text-foreground text-base text-center mt-5 px-8" />
        <TouchableOpacity className="bg-primary px-8 py-4 rounded-lg mt-5" onPress={requestPermission}>
          <TransText title="scanner.camera.button" className="text-foreground text-base font-bold" />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <CustomHeader type="scan" content="scanner" />

      <View className="flex-1 relative">
        <CameraManager
          isActive={appState.current === "active" && isScreenFocused}
          flashOn={flashOn}
          isScanning={isScanning}
          onBarcodeScanned={handleBarCodeScanned}
        />

        <Overlay isScanning={isScanning} scanResult={scanResult} />

        <View className="absolute bottom-24 left-0 right-0 items-center">
          <TransText
            title={isScanning ? "scanner.instructions" : "scanner.processing"}
            className="text-white text-base bg-white/30 px-5 py-2.5 rounded-full overflow-hidden"
          />
        </View>
      </View>

      <View className="flex-row justify-around items-center py-5">
        <TouchableOpacity className="items-center p-2.5" onPress={toggleFlash} activeOpacity={0.7}>
          <Ionicons
            name={flashOn ? "flash" : "flash-off"}
            size={24}
            color={flashOn ? COLORS.light.primary : COLORS.light.icon}
          />
          <TransText
            title={`scanner.flash.${flashOn ? "on" : "off"}`}
            className={`mt-1 text-xs ${flashOn ? "text-primary" : "text-foreground"}`}
          />
        </TouchableOpacity>

        {!isScanning && (
          <TouchableOpacity className="bg-primary px-8 py-3 rounded-full" onPress={resetScanner} activeOpacity={0.7}>
            <TransText title="scanner.scanAgain" className="text-foreground text-base font-bold" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}
