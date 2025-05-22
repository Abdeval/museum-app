"use client"

import { COLORS } from "@/constants/Colors"
import { useEffect, useRef } from "react"
import { View, Dimensions, Animated } from "react-native"
import Svg, { Rect, Defs, Mask, Line } from "react-native-svg"

const { width, height } = Dimensions.get("window")
const cutOutSize = 250
const cornerLength = 30
const cornerWidth = 4

export default function Overlay({ isScanning }: { isScanning: boolean }) {
  const centerX = width / 2 - cutOutSize / 2
  const centerY = height / 2 - cutOutSize / 2

  // Animation for scanning effect
  const scanAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isScanning) {
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
    } else {
      scanAnimation.stopAnimation()
    }

    return () => {
      scanAnimation.stopAnimation()
    }
  }, [isScanning, scanAnimation])

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

      {/* Border around the cutout */}
      {/* <View
        style={{
          position: "absolute",
          top: centerY,
          left: centerX,
          width: cutOutSize,
          height: cutOutSize,
          borderWidth: 2,
          borderColor: COLORS.light.primary,
          borderRadius: 10,
        }}
      /> */}
    </View>
  )
}
