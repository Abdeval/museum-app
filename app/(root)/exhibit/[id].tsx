import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// import FavoriteButton from "@/components/ui/FavoriteButton"
import CustomHeader from "@/components/ui/CustomHeader";
import { useExhibitInfo } from "@/hooks/useExhibit";
import { BACKEND_BASE_URL } from "@/constants";

export default function ExhibitDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: exhibit, isLoading } = useExhibitInfo(Number(id));

  if (isLoading) return <Text>loading...</Text>;

  if (!exhibit) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Exhibit not found</Text>
        <TouchableOpacity
          className="mt-4 bg-primary px-4 py-2 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <CustomHeader type="home" content={exhibit.title} />
      <View className="h-[100px]" />
      <ScrollView>
        <Image
          source={{
            uri: `${BACKEND_BASE_URL}/public${exhibit?.images[0]?.url}`,
          }}
          className="w-full h-[250px]"
          resizeMode="cover"
        />
        <View className="p-4">
          <Text className="text-2xl font-bold">{exhibit.title}</Text>

          <View className="flex-row items-center my-2">
            <View className="bg-primary/10 px-3 py-1 rounded-full mr-2">
              <Text className="text-primary font-medium">
                {exhibit.thematic_category}
              </Text>
            </View>
            <View className="bg-gray-400 opacity-20 px-3 py-1 rounded-full mr-2">
              <Text className="text-black font-medium">
                {exhibit.chronological_category}
              </Text>
            </View>
            <Text className="text-gray-500">{exhibit.year}</Text>
          </View>

          {exhibit.artist && (
            <View className="flex-row items-center mb-4">
              <Ionicons name="person-outline" size={16} color="#666" />
              <Text className="text-gray-700 ml-1">
                Artist: {exhibit.artist}
              </Text>
            </View>
          )}

          <View className="flex-row items-center mb-4">
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text className="text-gray-700 ml-1">Location: Alger</Text>
          </View>

          <Text className="text-lg font-bold mt-4 mb-2">
            About this Exhibit
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            {exhibit.description}
          </Text>

          {/* Additional content like related exhibits could go here */}
        </View>
      </ScrollView>

      {/* Chat about this exhibit button */}
      <TouchableOpacity
        className="absolute bottom-20 right-6 bg-primary flex-row items-center px-4 py-3 rounded-full shadow-lg"
        onPress={() => {
          router.push({
            pathname: "/chat",
            params: { exhibitId: exhibit.id },
          });
        }}
      >
        <Ionicons name="chatbubble-ellipses" size={20} color="white" />
        <Text className="text-white font-medium ml-2">
          Ask about this exhibit
        </Text>
      </TouchableOpacity>
    </View>
  );
}
