import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { COLORS } from "@/constants/Colors";
import { useColorScheme } from "@/lib/useColorScheme";
import Iconify from "react-native-iconify";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS[colorScheme ?? "light"].tint,
        headerShown: false,
        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        // tabBarIcon: () => <Ionicons name="home" size={32} color="white" />,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Iconify
              icon="solar:home-smile-angle-bold-duotone"
              color={
                colorScheme === "dark" ? COLORS.dark.icon : COLORS.light.icon
              }
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => (
            <Iconify
              icon="solar:face-scan-square-bold-duotone"
              color={
                colorScheme === "dark" ? COLORS.dark.icon : COLORS.light.icon
              }
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="exhibit"
        options={{
          title: "Exhibit",
          tabBarIcon: ({ color }) => (
            <Iconify
              icon="solar:card-search-bold-duotone"
              color={
                colorScheme === "dark" ? COLORS.dark.icon : COLORS.light.icon
              }
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <Iconify
              icon="solar:chat-round-line-bold-duotone"
              color={
                colorScheme === "dark" ? COLORS.dark.icon : COLORS.light.icon
              }
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Iconify
              icon="solar:user-rounded-bold-duotone"
              color={
                colorScheme === "dark" ? COLORS.dark.icon : COLORS.light.icon
              }
              size={28}
            />
          ),
        }}
      />
    </Tabs>
  );
}
