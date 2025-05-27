import { ActivityIndicator } from "react-native";
import React from "react";
import { COLORS } from "@/constants/Colors";
import TransText from "../TransText";
import LRView from "../LRView";

export default function GlobalLoading({ page = "home" }:{ page: string }) {
  return (
    <LRView className="flex-1 justify-center items-center bg-background gap-2">
      <ActivityIndicator size="large" color={COLORS.light.primary} />
      <TransText title="chatbot.loading" page={page} className="text-foreground"/>
    </LRView>
  );
}
