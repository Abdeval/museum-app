import { BACKEND_BASE_URL } from "@/constants";
import { COLORS } from "@/constants/Colors";
import { ExhibitType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ExhibitCardProps {
  type?: "fav" | "default";
  exhibit: ExhibitType | any;
  onPress: () => void;
  addToFavorites?: (exhibitId: number) => void;
  favId?: number;
  deleteFromFavorites?: (id: number) => void;
  isFavorited: boolean;
}

export default function ExhibitCard({
  type = "default",
  exhibit,
  onPress,
  addToFavorites,
  favId,
  deleteFromFavorites,
  isFavorited = false,
}: ExhibitCardProps) {
  
  const handleFavoriteChange = (exhibitId: number) => {
    if (isFavorited && deleteFromFavorites) {
      console.log("deleting : favorites", isFavorited);
      deleteFromFavorites(favId as number);
    }
    if (!isFavorited && addToFavorites) {
      console.log("adding : favorites", isFavorited);
      addToFavorites(exhibitId);
    }
  };
  
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white dark:bg-black rounded-lg overflow-hidden mr-4 w-[250px]"
      activeOpacity={0.7}
    >
      <Image
        source={{
          // ! here whenever you changed the backend url you must change it in the env file first
          uri: `${BACKEND_BASE_URL}/public${exhibit?.images[0]?.url}`,
        }}
        className="w-full h-[150px]"
        resizeMode="cover"
      />
      <View className="p-2">
        <Text
          className="text-primary font-bold text-base mb-1"
          numberOfLines={1}
        >
          {exhibit.title}
        </Text>
        <Text className="text-gray-500 text-xs mb-2">
          {exhibit.thematic_category} • {exhibit.year}
        </Text>
        <Text className="text-gray-700 text-sm" numberOfLines={2}>
          {exhibit.description}
        </Text>
      </View>

      {type === "fav" && (
        <View className="px-2 pb-2">
          <TouchableOpacity
            onPress={onPress}
            className="bg-primary/10 py-2 px-4 rounded-lg mt-3 self-start"
          >
            <Text className="text-primary font-medium">View Details</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        onPress={() => handleFavoriteChange(exhibit.id)}
        className="top-2 right-2 absolute"
      >
        <Ionicons
          name="heart"
          size={24}
          color={isFavorited ? "red" : COLORS.light.primary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
