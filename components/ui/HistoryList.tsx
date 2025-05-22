import { VisitDetailType } from "@/types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";

interface HistoryListProps {
  FadeInRight: any;
  FadeInDown: any;
  visits: VisitDetailType[];
}

export default function HistoryList({
  FadeInDown,
  FadeInRight,
  visits,
}: HistoryListProps) {

  const options = { month: "long", day: "numeric", year: "numeric" };

  return (
    <Animated.View entering={FadeInRight.duration(400)}>
      <Text className="text-foreground text-lg font-semibold mb-4">
        Visit History
      </Text>
      {visits.map((visit: VisitDetailType, index: number) => {
        const date = new Date(visit.visitedAt).toLocaleString("en-US", options as any);

        return (
          <Animated.View
            key={new Date(visit.visitedAt).getDay()}
            entering={FadeInDown.delay(index * 100).duration(400)}
            className="bg-white rounded-lg p-4 mb-3 flex-row justify-between items-center"
          >
            <View>
              <Text className="text-foreground font-medium">{date}</Text>
              <Text className="text-gray-400">
                Visited {visit.exhibitNumber} exhibits
              </Text>
            </View>
            <TouchableOpacity className="bg-primary/20 p-2 rounded-lg">
              <Text className="text-primary">Details</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
      <TouchableOpacity className=" bg-white/10 p-4 rounded-lg items-center">
        <Text className="text-primary font-medium">View Complete History</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
