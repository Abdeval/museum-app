import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

export default function HistoryVisitsSkeleton({ count = 3 }) {
  // Animation for the skeleton pulse effect
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.6, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });
  return (
    <View className="gap-2">
      {Array.from({ length: count }, (_, index) => (
        <Animated.View key={index} className="w-full flex-row justify-between items-center p-2 bg-white/50 rounded-lg">
          <View className="gap-1">
            <Animated.View
              style={animatedStyle}
              className="w-[140px] h-[20px] bg-gray-300 rounded-md"
            />
            <Animated.View
              style={animatedStyle}
              className="w-[140px] h-[20px] bg-gray-300 rounded-md"
            />
          </View>

          <Animated.View
            style={animatedStyle}
            className="w-[100px] h-[40px] bg-gray-300 rounded-xl"
          />
        </Animated.View>
      ))}
    </View>
  );
}
