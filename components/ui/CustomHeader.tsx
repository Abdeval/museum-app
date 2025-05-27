import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/nativewindui/Text";
import React from "react";
import Iconify from "react-native-iconify";
import { COLORS } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TransText from "./TransText";
import { navigationItems } from "@/lib/data";

type HeaderType = "welcome" | "home" | "scan" | "chat" | "exhibit" | "landing";

export default function CustomHeader({
  content,
  type = "welcome",
  handleAddNewChat,
  navigateToHistoryChats,
}: {
  content: string;
  type: HeaderType;
  handleAddNewChat?: () => void;
  navigateToHistoryChats?: () => void;
}) {
  const router = useRouter();

  return (
    <View className="h-[100px] top-0 z-50 justify-end py-4 gap-1 absolute bg-background/80 px-2">
      <View className="w-full flex-row gap-2 items-center justify-between">
        <View className="flex-row gap-2">
          <TouchableOpacity onPress={() => router.back()}>
            <Iconify
              icon="solar:round-arrow-left-bold-duotone"
              size={32}
              color={COLORS.light.primary}
            />
          </TouchableOpacity>

          {/* here if the page is chat */}
          {type === "chat" && (
            <TouchableOpacity onPress={navigateToHistoryChats} className=''>
              <Ionicons name="chatbubble-ellipses" size={30} color={COLORS.light.primary}/>
            </TouchableOpacity>
          )}
          {type === "chat" && (
            <TouchableOpacity onPress={handleAddNewChat}>
              <Iconify
                icon="lets-icons:chat-alt-add-duotone"
                size={34}
                color={COLORS.light.icon}
              />
            </TouchableOpacity>
          )}
        </View>

        <View className="items-center flex-row gap-1 pr-4">
          <TransText title={navigationItems.includes(content) ? `navigation.${content}` : content} className="font-semibold capitalize text-2xl text-foreground"/>
          {type === "welcome" && (
            <Text className="font-bold" variant={"title3"}>
              AMUSE
            </Text>
          )}
        </View>
      </View>
      <View className="flex-row w-full px-4">
        <View className="h-0 w-[70%] " />
        <View className="border-2 h-0 w-[30%] pr-4 rounded border-primary" />
      </View>
    </View>
  );
}
