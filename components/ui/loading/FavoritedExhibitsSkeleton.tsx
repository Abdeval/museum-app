import { View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"
import ExhibitCardSkeleton from "./ExhibitCardSkeleton"

interface FavoritedExhibitsSkeletonProps {
  count?: number
}

export default function FavoritedExhibitsSkeleton({ count = 3 }: FavoritedExhibitsSkeletonProps) {
  return (
    <Animated.View entering={FadeIn.duration(300)}>
      {/* Title placeholder */}
      <View className="h-7 bg-gray-300 rounded-md w-1/2 mb-4 opacity-30" />

      {/* Skeleton cards */}
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <View key={index} className="mb-4">
            <ExhibitCardSkeleton type="fav" />
          </View>
        ))}
    </Animated.View>
  )
}
