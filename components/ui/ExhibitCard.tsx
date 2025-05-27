import { BACKEND_BASE_URL } from "@/constants";
import { ExhibitType } from "@/types";
import { Image, Text, TouchableOpacity, View } from "react-native";
import TransText from "./TransText";
import LRView from "./LRView";
import Iconify from "react-native-iconify";
import FavoriteButton from "./FavoriteButton";
import { useManageFavorites } from "@/hooks/useFavorite";
import { useSession } from "@/context/AuthProvider";

interface ExhibitCardProps {
  type?: "fav" | "default";
  exhibit: ExhibitType | any;
  onPress: () => void;
  // userId: number;
  addToFavorites?: (exhibitId: number) => void;
  favId?: number;
  addVisit?: (exhibitId: number) => void;
  deleteFromFavorites?: (id: number) => void;
  // isFavorited: boolean;
}

export default function ExhibitCard({
  type = "default",
  exhibit,
  onPress,
  // userId,
  favId,
  addVisit
}: ExhibitCardProps) {

  // const { addVisit } = useVisit(0);
  const { handleFavoriteChange } = useManageFavorites();
  const { user } = useSession();

  const handleAddingToVisits = (exhibitId: number) => {
    if(addVisit) { 
      console.log('visit created...');
      addVisit(exhibitId);
    }
  }


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
      <View className="p-2 py-4">
        <Text
          className="text-primary font-bold text-base mb-1"
          numberOfLines={1}
        >
          {exhibit.title}
        </Text>
        <Text className="text-gray-500 text-xs mb-2">
          <TransText
            title={`categories.${exhibit.thematic_category.toLowerCase()}`}
          />{" "}
          • {exhibit.year}
        </Text>
        <Text className="text-foreground/60 text-sm" numberOfLines={2}>
          {exhibit.description}
        </Text>
      </View>

      {type === "fav" && (
        <LRView className="px-2 pb-2">
          <TouchableOpacity
            onPress={onPress}
            className="bg-primary/10 py-2 px-4 rounded-lg mt-3 self-start"
          >
            <TransText
              title="favorites.viewDetail"
              className="text-primary font-medium"
            />
          </TouchableOpacity>
        </LRView>
      )}
      <View className="top-2 right-2 absolute flex-row gap-2">
        <TouchableOpacity onPress={() => handleAddingToVisits(exhibit.id)}>
          <Iconify
            icon="solar:add-circle-bold-duotone"
            size={24}
            color={'white'}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => handleFavoriteChange(exhibit.id)}>
          <Ionicons
            name="heart"
            size={24}
            color={isFavorited ? "red" : COLORS.light.primary}
          />
        </TouchableOpacity> */}
        <FavoriteButton exhibitId={exhibit.id} onToggle={(isFavorite: boolean) => handleFavoriteChange({
          exhibitId: exhibit.id,
          userId: Number(user?.id),
          isFavorite,
          favId
        })}/>
      </View>
    </TouchableOpacity>
  );
}
