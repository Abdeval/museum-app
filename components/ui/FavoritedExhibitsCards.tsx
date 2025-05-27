import { ExhibitType, FavoriteType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Router } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import ExhibitCard from "./ExhibitCard";
import FavoritedExhibitsSkeleton from "./loading/FavoritedExhibitsSkeleton";
import TransText from "./TransText";

interface FavoritedExhibitsCardsProps {
  FadeInRight: any;
  FadeInDown: any;
  router: Router;
  exhibits: FavoriteType[];
  userId: number;
  isLoading: boolean;
}

export default function FavoritedExhibitsCards({
  FadeInRight,
  FadeInDown,
  router,
  userId,
  isLoading,
  exhibits,
}: FavoritedExhibitsCardsProps) {
  const navigateToExhibit = (exhibitId: number) => {
    router.push(`/exhibit/${exhibitId}`);
  };

  // ! manage the favorites

  return (
    <Animated.View entering={FadeInRight.duration(400)}>
      {isLoading ? (
        <FavoritedExhibitsSkeleton />
      ) : exhibits && exhibits.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {exhibits.map((favorited: any, index: number) => {
              const exhibit: ExhibitType = favorited.exhibit;
              return (
                <Animated.View
                  key={exhibit.id}
                  entering={FadeInDown.delay(index * 100).duration(400)}
                  className="mb-4"
                >
                  <ExhibitCard
                    // isFavorited={isFavorited(exhibit.id, exhibits)}
                    favId={favorited.id}
                    type={"fav"}
                    exhibit={exhibit}
                    // userId={userId}
                    key={index}
                    onPress={() => navigateToExhibit(exhibit.id)}
                  />
                </Animated.View>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View className="items-center justify-center pt-4">
          <Ionicons name="heart-outline" size={60} color={'red'} />
          <TransText title='favorites.noFavorites' className="text-foreground text-lg mt-4"/>
          <TouchableOpacity
            onPress={() => router.push("/exhibit")}
            className="bg-primary mt-6 py-3 px-6 rounded-lg"
          >
            <TransText title="favorites.explore" className="text-white font-bold"/>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}
