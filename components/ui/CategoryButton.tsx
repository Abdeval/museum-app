import { COLORS } from "@/constants/Colors";
import { ExhibitType } from "@/types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Iconify from "react-native-iconify";
import LRView from "./LRView";
import TransText from "./TransText";

interface CategoryButtonProps {
  category: string;
  exhibits: ExhibitType[];
  icon: string;
}

export default function CategoryButton({
  category,
  exhibits,
  icon,
}: CategoryButtonProps) {
  return (
    <TouchableOpacity
      key={category}
      className="bg-white dark:bg-black w-[48%] rounded-lg p-4 mb-4 shadow-sm"
      onPress={() => console.log(`Navigate to ${category}`)}
    >
      <LRView className="justify-between">
        <View>
          <TransText title={`categories.${category}`} className="font-bold text-lg text-foreground"/>
          <LRView className="gap-2">
            <Text className="text-gray-500">
              {
                exhibits.filter(
                  (e: ExhibitType) =>
                    e.thematic_category.toLowerCase() === category
                ).length
              }{" "}
            </Text>
            <TransText title="navigation.exhibits" className="text-gray-500" />
          </LRView>
        </View>
        <Iconify icon={icon} size={40} color={COLORS.light.primary} />
      </LRView>
    </TouchableOpacity>
  );
}
