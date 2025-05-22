
import { useState, useEffect } from "react"
import { TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import SecureStorage, { getItem, setItem } from 'expo-secure-store';

interface FavoriteButtonProps {
  exhibitId: number
  size?: number
  onToggle?: (isFavorite: boolean) => void
}

export default function FavoriteButton({ exhibitId, size = 24, onToggle }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  // Load favorite status on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favorites = getItem("favoriteExhibits")
        if (favorites) {
          const favoriteIds = JSON.parse(favorites) as number[]
          setIsFavorite(favoriteIds.includes(exhibitId))
        }
      } catch (error) {
        console.error("Error checking favorite status:", error)
      }
    }

    checkFavoriteStatus()
  }, [exhibitId])

  // Toggle favorite status
  const toggleFavorite = async () => {
    try {
      // Get current favorites
      const favorites = await getItem("favoriteExhibits")
      let favoriteIds: number[] = favorites ? JSON.parse(favorites) : []

      // Update favorites
      if (isFavorite) {
        favoriteIds = favoriteIds.filter((id) => id !== exhibitId)
      } else {
        favoriteIds.push(exhibitId)
      }

      // Save updated favorites
      setItem("favoriteExhibits", JSON.stringify(favoriteIds))

      // Update state
      setIsFavorite(!isFavorite)

      // Call onToggle callback if provided
      if (onToggle) {
        onToggle(!isFavorite)
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      Alert.alert("Error", "Failed to update favorites. Please try again.")
    }
  }

  return (
    <TouchableOpacity onPress={toggleFavorite} className="p-1">
      <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={size} color={isFavorite ? "#FF4136" : "#ffffff"} />
    </TouchableOpacity>
  )
}
