import { View } from "react-native";
import React from "react";
import SearchExhibitsScreen from "@/components/screens/SearchExhibitsScreen";
import { useExhibit } from "@/hooks/useExhibit";
import GlobalLoading from "@/components/ui/loading/GlobalLoading";

export default function Exhibit() {
  const { exhibits, exhibitsByCategories, isLoadingExhibits, isLoadingExhibitsByCategories } = useExhibit({
    search: true,
  });

  if (isLoadingExhibits || isLoadingExhibitsByCategories) return <GlobalLoading page="Search" />;
  console.log("categories", exhibitsByCategories);

  return (
    <View className="flex-1 relative bg-background">
      <SearchExhibitsScreen
        exhibits={exhibits}
        thematicCategories={exhibitsByCategories.thematic}
        chronologicalCategories={exhibitsByCategories.chronological}
      />
    </View>
  );
}
