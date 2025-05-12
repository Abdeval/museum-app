import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/nativewindui/Text";
import React from "react";
import Iconify from "react-native-iconify";
import { COLORS } from "@/constants/Colors";
import { useRouter } from "expo-router";

type HeaderType = "welcome" | "home" | "scan" | "chat" | "exhibit" | 'landing';

export default function CustomHeader({
  content,
  type = "welcome",
}: {
  content: string;
  type: HeaderType;
}) {

    const router = useRouter();
  return (
    <View className="h-[100px] justify-end py-4 gap-1 absolute bg-background/80 px-2">
      <View className="w-full flex-row gap-2 items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Iconify
            icon="solar:round-arrow-left-bold-duotone"
            size={32}
            color={COLORS.light.primary}
          />
        </TouchableOpacity>
        <View className="items-center flex-row gap-1 pr-4">
          <Text className="font-semibold capitalize" variant={"title2"}>
            {content}
          </Text>
          {type === "welcome" && (
            <Text className="font-bold" variant={"title3"}>
              AMUSE
            </Text>
          )}
        </View>
      </View>
      <View className="flex-row w-full px-4">
        <View className="h-0 w-[70%] " />
        <View className="border-2 h-0 w-[30%] pr-4 rounded" />
      </View>
    </View>
  );
}
