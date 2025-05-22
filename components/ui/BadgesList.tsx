import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { COLORS } from "@/constants/Colors";

interface BadgesListProps {
    FadeInRight: any;
    FadeInDown: any;
    badges: any
}

export default function BadgesList({
    FadeInDown,
    FadeInRight,
    badges,
}: BadgesListProps) {
  return (
    <Animated.View entering={FadeInRight.duration(400)}>
      <Text className="text-foreground text-lg font-semibold mb-4">
        My Achievements
      </Text>
      <View className="flex-row flex-wrap justify-between">
        {badges.map((badge: any, index: number) => (
          <Animated.View
            key={badge.id}
            entering={FadeInDown.delay(index * 100).duration(400)}
            className="bg-white dark:bg-black rounded-lg p-4 mb-4 w-[48%] items-center"
          >
            <View className="bg-primary/20 p-3 rounded-full mb-2">
              <Ionicons name={badge.icon as any} size={30} color={COLORS.light.primary} />
            </View>
            <Text className="text-foreground font-bold text-center">
              {badge.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
              <Text className="text-gray-400 text-xs ml-1">
                {badge.count}/5
              </Text>
            </View>
            <Text className="text-gray-400 text-xs text-center mt-2">
              {badge.description}
            </Text>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
}
