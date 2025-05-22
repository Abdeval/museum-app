import React from "react";
import HomeScreen from "@/components/screens/HomeScreen";
import { SafeAreaView} from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Home() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <HomeScreen />
    </SafeAreaView>
  );
}
