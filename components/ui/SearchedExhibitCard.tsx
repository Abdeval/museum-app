import { BACKEND_BASE_URL } from "@/constants";
import { ExhibitType } from "@/types";
import { Image, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import FavoriteButton from "./FavoriteButton";
import { Text } from "../nativewindui/Text";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { EXHIBIT_RATINGS } from "@/lib/data";
import { useManageFavorites } from "@/hooks/useFavorite";
import { useSession } from "@/context/AuthProvider";

interface SearchedExhibitCardProps {
  item: ExhibitType;
  // userId: number;
}

export default function SearchedExhibitCard({
  item,
  // userId,
}: SearchedExhibitCardProps) {
  const { handleFavoriteChange } = useManageFavorites();
  const { user } = useSession();
  const router = useRouter();
  // ! fake rating
  const rating = EXHIBIT_RATINGS[item.id] || { rating: 4.0, reviews: 0 };

  const navigateToExhibit = (exhibitId: number) => {
    router.push(`/exhibit/${exhibitId}`);
  };

  return (
    <Animated.View
      key={item.id}
      entering={FadeInDown.duration(400)}
      className="mb-4"
    >
      <TouchableOpacity
        onPress={() => navigateToExhibit(item.id)}
        className="bg-white dark:bg-black rounded-lg overflow-hidden shadow-sm"
      >
        <View className="relative">
          <Image
            source={{
              uri: `${BACKEND_BASE_URL}/public${item?.images[0]?.url}`,
            }}
            className="w-full h-[180px]"
            resizeMode="cover"
          />
          <View className="absolute top-2 right-2">
            <FavoriteButton
              onToggle={(isFavorite: boolean) =>
                handleFavoriteChange({
                  exhibitId: item.id,
                  userId: Number(user?.id),
                  isFavorite,
                })
              }
              exhibitId={item.id}
            />
          </View>
          <View className="absolute bottom-0 left-0 right-0 bg-black/20 px-3 py-2">
            <Text className="text-primary-foreground font-bold">
              {item.title}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text className="text-primary-foreground ml-1">
                {rating.rating.toFixed(1)} ({rating.reviews})
              </Text>
            </View>
          </View>
        </View>
        <View className="p-3">
          <View className="flex-row justify-between items-center mb-2">
            <View className="bg-primary/10 px-2 py-1 rounded-full">
              <Text className="text-primary text-xs">
                {item.thematic_category}
              </Text>
            </View>
            <Text className="text-gray-500 text-xs">{item.year}</Text>
          </View>
          <Text className="text-gray-700 dark:text-gray-300" numberOfLines={2}>
            {item.description}
          </Text>
          <View className="flex-row justify-between items-center mt-3">
            <Text className="text-gray-500 text-xs">alger</Text>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text className="text-gray-500 text-xs ml-1">~15 min</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
