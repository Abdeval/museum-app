import { cn } from "@/lib/cn";
import { MuseumImage } from "@/types";
import React from "react";
import { Dimensions, View } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  items: MuseumImage[];
  paginationIndex: number;
  scrollX: SharedValue<number>;
};

const { width, height } = Dimensions.get("screen");

export default function Pagination({ items, paginationIndex, scrollX }: Props) {
  

  return (
    <View className="flex-row items-center justify-center gap-1">
      {items.map((_, index) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const paginationStyle = useAnimatedStyle(() => {
            const dotWidth = interpolate(
              scrollX.value,
              [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ],
              [8, 20, 8],
              Extrapolation.CLAMP
            );
            return { width: dotWidth };
          });
        return (
          <Animated.View
            style={[paginationStyle]}
            key={index}
            className={cn(
              paginationIndex === index ? "bg-primary" : "bg-muted-foreground",
              "w-2 h-2 rounded-full"
            )}
          />
        );
      })}
    </View>
  );
}
