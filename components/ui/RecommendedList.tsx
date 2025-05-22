import { useFavoritedExhibit, useRecommendedExhibit } from "@/hooks/useExhibit";
import { isFavorited, useManageFavorites } from "@/hooks/useFavorite";
import { MUSEUM_EXHIBITS } from "@/lib/data";
import { ExhibitType } from "@/types";
import { Router } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import ExhibitCard from "./ExhibitCard";

export default function RecommendedList({
  userId,
  router,
}: {
  userId: number;
  router: Router;
}) {
  const { data: recommendedExhibits, isLoading } = useRecommendedExhibit();
  const { data: favoriteExhibits } = useFavoritedExhibit(
      Number(userId)
  );
  const { addToFavorites } = useManageFavorites();
  const navigateToExhibit = (exhibitId: number) => {
    router.push(`/exhibit/${exhibitId}`);
  };

  const handleAddToFavorites = (exhibitId: number) => {
    addToFavorites({ userId, exhibitId });    
  }

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4 text-foreground/80">
        Featured Exhibits
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {isLoading ? (
          <Text>loading...</Text>
        ) : !recommendedExhibits ? (
          MUSEUM_EXHIBITS.map((exhibit) => {
            return (
              <ExhibitCard
                isFavorited={false}
                exhibit={exhibit}
                key={exhibit.id}
                onPress={() => navigateToExhibit(exhibit.id)}
              />
            );
          })
        ) : (
          recommendedExhibits.map((exhibit: ExhibitType) => {
            return (
              <ExhibitCard
                addToFavorites={handleAddToFavorites}
                isFavorited={isFavorited(exhibit.id, favoriteExhibits)} 
                exhibit={exhibit}
                key={exhibit.id}
                onPress={() => navigateToExhibit(exhibit.id)}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
