
import { COLORS } from "@/constants/Colors"
import { useEffect, useRef } from "react"
import { View, Dimensions, Animated, Text, ActivityIndicator } from "react-native"
import Svg, { Rect, Defs, Mask, Line } from "react-native-svg"
import { Ionicons } from "@expo/vector-icons"

const { width, height } = Dimensions.get("window")
const cutOutSize = 250
const cornerLength = 30
const cornerWidth = 4

interface OverlayProps {
  isScanning: boolean
  scanResult: string | null
}

export default function Overlay({ isScanning, scanResult }: OverlayProps) {
  const centerX = width / 2 - cutOutSize / 2
  const centerY = height / 2 - cutOutSize / 2

  // Animation for scanning effect
  const scanAnimation = useRef(new Animated.Value(0)).current
  
  // Animation for success/error feedback
  const feedbackOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isScanning) {
      // Start scanning animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnimation, {
            toValue: cutOutSize,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ).start()
      
      // Reset feedback opacity
      feedbackOpacity.setValue(0)
    } else {
      // Stop scanning animation
      scanAnimation.stopAnimation()
      
      // Show feedback
      Animated.timing(feedbackOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }

    return () => {
      scanAnimation.stopAnimation()
    }
  }, [isScanning, scanAnimation, feedbackOpacity])

  return (
    <View className="absolute w-full h-full">
      {/* Semi-transparent overlay with cutout */}
      <Svg height="100%" width="100%">
        <Defs>
          <Mask id="mask">
            <Rect x="0" y="0" width={width} height={height} fill="white" />
            <Rect x={centerX} y={centerY} width={cutOutSize} height={cutOutSize} fill="black" rx="10" ry="10" />
          </Mask>
        </Defs>
        <Rect x="0" y="0" width={width} height={height} fill="black" opacity={0.7} mask="url(#mask)" />

        {/* Corner indicators */}
        {/* Top Left */}
        <Line
          x1={centerX}
          y1={centerY}
          x2={centerX + cornerLength}
          y2={centerY}
          stroke={COLORS.light.primary}
          strokeWidth={cornerWidth}
        />
        <Line
          x1={centerX}
          y1={centerY}
          x2={centerX}
          y2={centerY + cornerLength}
          stroke={COLORS.light.primary}
          strokeWidth={cornerWidth}
        />

        {/* Top Right */}
        <Line
          x1={centerX + cutOutSize}
          y1={centerY}
          x2={centerX + cutOutSize - cornerLength}
          y2={centerY}
          stroke={COLORS.light.primary}
          strokeWidth={cornerWidth}
        />
        <Line
          x1={centerX + cutOutSize}
          y1={centerY}
          x2={centerX + cutOutSize}
          y2={centerY + cornerLength}
          stroke={COLORS.light.primary}
          strokeWidth={cornerWidth}
        />

        {/* Bottom Left */}
        <Line
          x1={centerX}
          y1={centerY + cutOutSize}
          x2={centerX + cornerLength}
          y2={centerY + cutOutSize}
          stroke={COLORS.light.primary}
          strokeWidth={cornerWidth}
        />
        <Line
          x1={centerX}
          y1={centerY + cutOutSize}
          x2={centerX}
          y2={centerY + cutOutSize - cornerLength}
          stroke={COLORS.light.primary}
          strokeWidth={cornerWidth}
        />

        {/* Bottom Right */}
        <Line
          x1={centerX + cutOutSize}
          y1={centerY + cutOutSize}
          x2={centerX + cutOutSize - cornerLength}
          y2={centerY + cutOutSize}
          stroke={COLORS.light.primary}
          strokeWidth={cornerWidth}
        />
        <Line
          x1={centerX + cutOutSize}
          y1={centerY + cutOutSize}
          x2={centerX + cutOutSize}
          y2={centerY + cutOutSize - cornerLength}
          stroke={COLORS.light.primary}
          strokeWidth={cornerWidth}
        />
      </Svg>

      {/* Scanning animation line */}
      {isScanning && (
        <Animated.View
          style={[
            {
              height: 2,
              backgroundColor: COLORS.light.primary,
              position: "absolute",
              transform: [{ translateY: scanAnimation }],
              top: centerY,
              width: cutOutSize - 10,
              left: centerX + 5,
            },
          ]}
        />
      )}

      {/* Success/Error Feedback Overlay */}
      {!isScanning && (
        <Animated.View
          style={{
            position: "absolute",
            top: centerY,
            left: centerX,
            width: cutOutSize,
            height: cutOutSize,
            backgroundColor: "rgba(0,0,0,0.7)",
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            opacity: feedbackOpacity,
          }}
        >
          {scanResult ? (
            <View className="items-center">
              <View className="bg-primary/90 rounded-full p-3 mb-2">
                <Ionicons name="checkmark" size={30} color="white" />
              </View>
              <ActivityIndicator size="small" color={COLORS.light.primary} />
              <Text className="text-white text-sm mt-2">Processing...</Text>
            </View>
          ) : (
            <View className="items-center">
              <View className="bg-red-500/90 rounded-full p-3 mb-2">
                <Ionicons name="close" size={30} color="white" />
              </View>
              <Text className="text-white text-sm mt-2">Invalid QR Code</Text>
            </View>
          )}
        </Animated.View>
      )}
    </View>
  )
}
