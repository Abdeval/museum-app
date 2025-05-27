import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { CategoryGroupType, ExhibitType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import TransText from "./TransText";
import LRView from "./LRView";

interface FilteredTabProps {
  filteredExhibits: CategoryGroupType[];
  setFilteredExhibits: (exhibits: ExhibitType[]) => void;
  exhibits: ExhibitType[];
  i18n: any;
}

export default function FilteredTab({
  filteredExhibits,
  setFilteredExhibits,
  exhibits,
  i18n
}: FilteredTabProps) {
  return (
    <View className="mb-6">
      <TransText
        title="search.filterTab"
        className="text-foreground text-lg font-semibold mb-3"
      />
      {filteredExhibits.map((period) => (
        <TouchableOpacity
          key={period.name}
          onPress={() => {
            const periodExhibits = exhibits.filter((exhibit) =>
              period.exhibits.includes(exhibit.id)
            );
            setFilteredExhibits(periodExhibits);
          }}
          className="bg-white dark:bg-black rounded-lg p-3 mb-2 flex-row justify-between items-center"
        >
          <LRView>
            {/* <Text >{period.name}</Text> */}
            <TransText
              title={period.name}
              className="text-foreground/60 font-medium flex-1 text-wrap"
            />
            <LRView className="flex-row items-center">
              <LRView className="mr-2 gap-2">
                <Text className="text-gray-400 ">{period.exhibits.length}</Text>
                <TransText
                  title="navigation.exhibits"
                  className="text-gray-400 "
                />
              </LRView>
              <Ionicons
                name={i18n.language === 'ar' ? "chevron-back" : "chevron-forward"}
                size={16}
                color={COLORS.light.primary}
              />
            </LRView>
          </LRView>
        </TouchableOpacity>
      ))}
    </View>
  );
}
