import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { COLORS } from "@/theme/colors";
import { useColorScheme } from "@/lib/useColorScheme";
import Iconify from "react-native-iconify";
import CustomHeader from "@/components/ui/CustomHeader";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const { t, i18n } = useTranslation();
  const isRL = i18n.language === "ar";
  // console.log(isRL);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS[colorScheme ?? "light"].primary,
        headerShown: false,
        tabBarStyle: {
          ...Platform.select({
            ios: {
              position: "absolute",
            },
            default: {
              backgroundColor: COLORS[colorScheme ?? "light"].card,
              borderTopWidth: 0,
              elevation: 0,
            },
          }),
          flexDirection: isRL ? "row-reverse" : "row",
          paddingVertical: 10,
          zIndex: 10,
          // display: keyboardVisible ? 'none' : 'flex'
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("navigation.home"),
          tabBarIcon: ({ color }) => (
            <Iconify
              icon="solar:home-smile-angle-bold-duotone"
              color={
                colorScheme === "dark" ? COLORS.dark.grey2 : COLORS.light.grey4
              }
              size={28}
            />
          ),
          header: () => <CustomHeader type="home" content="home of" />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: t("navigation.scanner"),
          tabBarIcon: ({ color }) => (
            <Iconify
              icon="solar:face-scan-square-bold-duotone"
              color={
                colorScheme === "dark" ? COLORS.dark.grey2 : COLORS.light.grey4
              }
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="exhibit"
        options={{
          title: t("navigation.exhibits"),
          tabBarIcon: ({ color }) => (
            <Iconify
              icon="solar:card-search-bold-duotone"
              color={
                colorScheme === "dark" ? COLORS.dark.grey2 : COLORS.light.grey4
              }
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: t("navigation.chatbot"),
          tabBarIcon: ({ color }) => (
            <Iconify
              icon="solar:chat-round-line-bold-duotone"
              color={
                colorScheme === "dark" ? COLORS.dark.grey2 : COLORS.light.grey4
              }
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("navigation.profile"),
          tabBarIcon: ({ color }) => (
            <Iconify
              icon="solar:user-rounded-bold-duotone"
              color={
                colorScheme === "dark" ? COLORS.dark.grey2 : COLORS.light.grey4
              }
              size={28}
            />
          ),
        }}
      />
    </Tabs>
  );
}
