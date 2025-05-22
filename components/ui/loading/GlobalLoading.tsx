import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { COLORS } from "@/constants/Colors";

export default function GlobalLoading({ page = "home" }:{ page: string }) {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <ActivityIndicator size="large" color={COLORS.light.primary} />
      <Text className="mt-4 text-foreground">Loading {page}...</Text>
    </View>
  );
}
