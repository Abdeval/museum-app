import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { categories, MUSEUM_EXHIBITS } from "@/lib/data";
import CustomHeader from "../ui/CustomHeader";
import { COLORS } from "@/constants/Colors";
import CategoryButton from "../ui/CategoryButton";
import React from "react";
import RecommendedList from "../ui/RecommendedList";
import { useSession } from "@/context/AuthProvider";
import GlobalLoading from "../ui/loading/GlobalLoading";
import { useExhibit } from "@/hooks/useExhibit";

export default function HomeScreen() {
  const router = useRouter();
  const { user, isLoading } = useSession();
  const { exhibits, isLoadingExhibits } = useExhibit({ search: false});

  if(isLoading || isLoadingExhibits) return <GlobalLoading page="Home"/>


  return (
    <View className="flex-1 bg-background">
      <CustomHeader type="welcome" content="home of" />
      <View className="h-[80px]" />
      <ScrollView className="flex-1">
        {/* recommended Exhibits */}
        <RecommendedList userId={user?.id as number} router={router}/>
        
        {/* Chat with Guide Button */}
        <View className="mx-4 mb-6 bg-white dark:bg-black rounded-xl shadow-sm overflow-hidden">
          <TouchableOpacity
            className="flex-row items-center p-4"
            onPress={() => router.push("/chat")}
          >
            <View className="bg-primary/20 p-3 rounded-full mr-4">
              <Ionicons
                name="chatbubble-ellipses"
                size={28}
                color={COLORS.light.primary}
              />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-lg text-foreground/80">
                Museum Bot Guide
              </Text>
              <Text className="text-gray-600">
                Get personalized recommendations and answers
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={COLORS.light.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="p-4">
          <Text className="text-xl font-bold mb-4 text-foreground/60">
            Explore by Category
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {categories.map((category) => (
              <CategoryButton
                category={category.name}
                icon={category.icon}
                key={category.name}
                exhibits={exhibits}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      {/* Floating Chat Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push("/chat")}
      >
        <Ionicons name="chatbubble-ellipses" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
