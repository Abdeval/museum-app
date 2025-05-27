import { Text } from "@/components/nativewindui/Text";
import { useColorScheme } from "@/lib/useColorScheme";
import { MuseumImage } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Image, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import LRView from "./LRView";

type Props = {
  item: MuseumImage;
  index: number;
  scrollX: SharedValue<number>;
};

const { width, height } = Dimensions.get("screen");

export default function SliderItem({ item, index, scrollX }: Props) {
  const { colorScheme } = useColorScheme();
  const rnAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [-width * 0.25, 0, width * 0.25],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.9, 1, 0.9],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[rnAnimatedStyle, { width, height: height * 0.85 }]}
      className=" flex items-center justify-center relative"
    >
      <Image
        source={item.src}
        className="w-[90%] h-[90%] rounded-[16px]"
        resizeMode="cover"
      />

      <LinearGradient
        colors={["transparent", colorScheme === "dark" ? "black" : "white"]}
        style={{ borderRadius: 16 }}
        className="absolute h-[90%] w-[90%]"
      >
        <View className="absolute bottom-0 p-4">
          <LRView>
            <Text className="pr-4 text-foreground/60 text-lg font-bold">
              {item.title}
            </Text>
          </LRView>
          <LRView>
            <Text className="text-muted-foreground text-sm">
            {item.description}
          </Text>
          </LRView>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}
