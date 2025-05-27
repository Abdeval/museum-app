import { View } from "react-native";
import React from "react";
import TransText from "./TransText";

export default function EmptyHistoryVisits() {
  return (
    <View className="items-center justify-center">
      <TransText title="history.noHistory" className="text-semibold text-gray-400 text-xl"/>
    </View>
  );
}
