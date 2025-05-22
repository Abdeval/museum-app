import { View } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated"
import { useEffect } from "react"

interface SkeletonExhibitCardProps {
  type?: "fav" | "default"
}

export default function SkeletonExhibitCard({ type = "default" }: SkeletonExhibitCardProps) {
  // Animation for the skeleton pulse effect
  const opacity = useSharedValue(0.3)

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.6, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  return (
    <View className="bg-white rounded-lg overflow-hidden shadow-md mr-4 w-[250px]">
      {/* Image placeholder */}
      <Animated.View style={animatedStyle} className="w-full h-[150px] bg-gray-300" />

      <View className="p-3">
        {/* Title placeholder */}
        <Animated.View style={animatedStyle} className="h-5 bg-gray-300 rounded-md w-3/4 mb-2" />

        {/* Category and year placeholder */}
        <Animated.View style={animatedStyle} className="h-3 bg-gray-300 rounded-md w-1/2 mb-3" />

        {/* Description placeholder - two lines */}
        <Animated.View style={animatedStyle} className="h-4 bg-gray-300 rounded-md w-full mb-2" />
        <Animated.View style={animatedStyle} className="h-4 bg-gray-300 rounded-md w-4/5" />

        {/* View Details button for fav type */}
        {type === "fav" && <Animated.View style={animatedStyle} className="h-8 bg-gray-300 rounded-lg w-28 mt-3" />}
      </View>
    </View>
  )
}
