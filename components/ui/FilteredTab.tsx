import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { CategoryGroupType, ExhibitType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";

interface FilteredTabProps {
  filteredExhibits: CategoryGroupType[];
  setFilteredExhibits: (exhibits: ExhibitType[]) => void;
  exhibits: ExhibitType[];
}

export default function FilteredTab({
  filteredExhibits,
  setFilteredExhibits,
  exhibits,
}: FilteredTabProps) {
  return (
    <View className="mb-6">
      <Text className="text-foreground text-lg font-semibold mb-3">
        Time Periods
      </Text>
      {filteredExhibits.map((period) => (
        <TouchableOpacity
          key={period.name}
          onPress={() => {
            const periodExhibits = exhibits.filter((exhibit) =>
              period.exhibits.includes(exhibit.id)
            );
            setFilteredExhibits(periodExhibits);
          }}
          className="bg-white rounded-lg p-3 mb-2 flex-row justify-between items-center"
        >
          <Text className="text-foreground font-medium">{period.name}</Text>
          <View className="flex-row items-center">
            <Text className="text-gray-400 mr-2">
              {period.exhibits.length} exhibits
            </Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={COLORS.light.primary}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
