import { useState, useEffect } from "react";
import { TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoriteButtonProps {
  exhibitId: number;
  size?: number;
  onToggle?: (isFavorite: boolean) => void;
}

export default function FavoriteButton({
  exhibitId,
  size = 24,
  onToggle,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // ! Load favorite status on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favorites = await AsyncStorage.getItem("favoriteExhibits");
        if (favorites) {
          const favoriteIds = JSON.parse(favorites) as number[];
          setIsFavorite(favoriteIds.includes(exhibitId));
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [exhibitId]);

  // ! Toggle favorite status
  const toggleFavorite = async () => {
    try {
      // Get current favorites
      const favorites = await AsyncStorage.getItem("favoriteExhibits");
      let favoriteIds: number[] = favorites ? JSON.parse(favorites) : [];

      // ! Update favorites
      if (isFavorite) {
        console.log("deleting...");
        favoriteIds = favoriteIds.filter((id) => id !== exhibitId);
      } else {
        favoriteIds.push(exhibitId);
      }

      // Save updated favorites
      await AsyncStorage.setItem(
        "favoriteExhibits",
        JSON.stringify(favoriteIds)
      );

      // Update state
      setIsFavorite(!isFavorite);

      // ! add it to the db
      if (onToggle) {
        onToggle(isFavorite);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Error", "Failed to update favorites. Please try again.");
    }
  };

  return (
    <TouchableOpacity onPress={toggleFavorite}>
      <Ionicons
        name="heart"
        size={24}
        color={isFavorite ? "red" : COLORS.light.primary}
      />
    </TouchableOpacity>
  );
}
