import { isFavorited, useManageFavorites } from "@/hooks/useFavorite";
import { ExhibitType, FavoriteType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import ExhibitCard from "./ExhibitCard";
import FavoritedExhibitsSkeleton from "./loading/FavoritedExhibitsSkeleton";

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
  const { deleteFromFavorites } = useManageFavorites();

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
                    isFavorited={isFavorited(exhibit.id, exhibits)}
                    favId={favorited.id}
                    // addToFavorites={handleAddToFavorites}
                    deleteFromFavorites={deleteFromFavorites}
                    type={"fav"}
                    exhibit={exhibit}
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
          <Text className="text-foreground text-lg mt-4">
            No favorite exhibits yet
          </Text>
          <Text className="text-gray-400 text-center mt-2 px-10">
            Tap the heart icon on any exhibit to add it to your favorites
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/exhibit")}
            className="bg-primary mt-6 py-3 px-6 rounded-lg"
          >
            <Text className="text-white font-bold">Explore Exhibits</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}
