import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import ExhibitCardSkeleton from "./ExhibitCardSkeleton";

interface FavoritedExhibitsSkeletonProps {
  count?: number;
}

export default function FavoritedExhibitsSkeleton({
  count = 3,
}: FavoritedExhibitsSkeletonProps) {
  return (
    <Animated.View entering={FadeIn.duration(300)} className="mt-1">
      {/* Title placeholder */}
      <View className="h-7 w-[60px] bg-gray-300 dark:bg-gray-800 rounded-md mb-4 opacity-30" />

      {/* Skeleton cards */}
      <View className="flex-row">
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <View key={index} className="mb-4">
              <ExhibitCardSkeleton type="fav" />
            </View>
          ))}
      </View>
    </Animated.View>
  );
}
