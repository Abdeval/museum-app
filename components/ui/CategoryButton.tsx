import { COLORS } from "@/constants/Colors";
import { ExhibitType } from "@/types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Iconify from "react-native-iconify";

interface CategoryButtonProps {
    category: string,
    exhibits: ExhibitType[],
    icon: string
} 

export default function CategoryButton({ category, exhibits, icon }:CategoryButtonProps) {
  return (
    <TouchableOpacity
      key={category}
      className="bg-white dark:bg-black w-[48%] rounded-lg p-4 mb-4 shadow-sm flex-row justify-between"
      onPress={() => console.log(`Navigate to ${category}`)}
    >
      <View>
        <Text className="font-bold text-lg text-foreground">{category}</Text>
        <Text className="text-gray-500">
          {exhibits.filter((e: ExhibitType) => e.thematic_category.toLowerCase() === category).length}{" "}
          exhibits
        </Text>
      </View>
      <Iconify icon={icon} size={40} color={COLORS.light.primary}/>
    </TouchableOpacity>
  );
}
