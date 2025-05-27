import { VisitDetailType } from "@/types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import TransText from "./TransText";
import LRView from "./LRView";
import { useRouter } from "expo-router";

interface HistoryListProps {
  FadeInRight: any;
  FadeInDown: any;
  visits: VisitDetailType[];
}

const AnimatedRLView = Animated.createAnimatedComponent(LRView);

export default function HistoryList({
  FadeInDown,
  FadeInRight,
  visits,
}: HistoryListProps) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  const router = useRouter();
  
  return (
    <Animated.View entering={FadeInRight.duration(400)}>
      <TransText
        title="history.title"
        className="text-foreground text-lg font-semibold mb-4"
      />
      {visits.map((visit: VisitDetailType, index: number) => {
        const date = new Date(visit.visitedAt).toLocaleString(
          "en-US",
          options as any
        );

        return (
          <AnimatedRLView
            key={new Date(visit.visitedAt).getDay()}
            entering={FadeInDown.delay(index * 100).duration(400)}
            className="bg-white dark:bg-black rounded-lg p-4 mb-3 flex-row justify-between items-center"
          >
            <View>
              <LRView>
                <Text className="text-foreground font-medium">{date}</Text>
              </LRView>
              <LRView className="gap-2">
                <Text className="text-gray-400"> {visit.exhibitNumber}</Text>
                {/* <Text> </Text> */}
                <TransText
                  title="navigation.exhibits"
                  className="text-gray-400"
                />
                <TransText title="profile.visited" className="text-gray-400" />
              </LRView>
            </View>
            <TouchableOpacity onPress={() => router.push(`/exhibit/${visit.exhibitIds[0]}`)}  className="bg-primary/20 p-2 rounded-lg">
              <TransText title="history.details" className="text-primary"/>
            </TouchableOpacity>
          </AnimatedRLView>
        );
      })}
      <TouchableOpacity className="bg-primary/10 dark:bg-white/30  p-4 rounded-lg items-center">
          <TransText title="history.viewHistory" className="text-primary font-medium"/>
      </TouchableOpacity>
    </Animated.View>
  );
}
