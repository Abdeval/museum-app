import { View, Text } from "react-native";
import React from "react";

export default function EmptyHistoryVisits() {
  return (
    <View className="items-center justify-center">
      <Text className="text-semibold text-foreground">No Visits Yet</Text>
    </View>
  );
}
