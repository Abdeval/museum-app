import { useFavoritedExhibit, useRecommendedExhibit } from "@/hooks/useExhibit";
// import { isFavorited } from "@/hooks/useFavorite";
import { MUSEUM_EXHIBITS } from "@/lib/data";
import { ExhibitType } from "@/types";
import { Router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import ExhibitCard from "./ExhibitCard";
import TransText from "./TransText";
import LRView from "./LRView";
import FavoritedExhibitsSkeleton from "./loading/FavoritedExhibitsSkeleton";
import { useVisit } from "@/hooks/useVisit";

export default function RecommendedList({
  userId,
  router,
}: {
  userId: number;
  router: Router;
}) {
  const { data: recommendedExhibits, isLoading } = useRecommendedExhibit();
  // const { data: favoriteExhibits } = useFavoritedExhibit(Number(userId));
  const { addVisit } = useVisit(userId);

  const navigateToExhibit = (exhibitId: number) => {
    router.push(`/exhibit/${exhibitId}`);
  };


  return (
    <View className="p-4">
      {!isLoading && (
        <LRView className="pt-2">
          <TransText
            title="exhibit.recommended"
            className="text-xl font-bold mb-4 text-foreground/80"
          />
        </LRView>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {isLoading ? (
          <FavoritedExhibitsSkeleton />
        ) : !recommendedExhibits ? (
          MUSEUM_EXHIBITS.map((exhibit) => {
            return (
              <ExhibitCard
                // userId={userId}
                // isFavorited={false}
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
                addVisit={(exhibitId: number) => addVisit({ userId, exhibitId})}
                // addToFavorites={handleAddToFavorites}
                // isFavorited={isFavorited(exhibit.id, favoriteExhibits)}
                exhibit={exhibit}
                key={exhibit.id}
                // userId={userId}
                onPress={() => navigateToExhibit(exhibit.id)}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
