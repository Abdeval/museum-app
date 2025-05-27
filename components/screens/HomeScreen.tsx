import { View, TouchableOpacity, ScrollView, I18nManager } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { categories } from "@/lib/data";
import CustomHeader from "../ui/CustomHeader";
import { COLORS } from "@/constants/Colors";
import CategoryButton from "../ui/CategoryButton";
import React from "react";
import RecommendedList from "../ui/RecommendedList";
import { useSession } from "@/context/AuthProvider";
import GlobalLoading from "../ui/loading/GlobalLoading";
import { useExhibit } from "@/hooks/useExhibit";
import TransText from "../ui/TransText";
import { cn } from "@/lib/cn";
import i18n from "@/i18n";
import LRView from "../ui/LRView";
import MaintenanceScreen from "./MaintenanceScreen";

export default function HomeScreen() {
  const router = useRouter();
  const { user, isLoading } = useSession();
  const { exhibits, isLoadingExhibits } = useExhibit({ search: false });

  if (isLoading || isLoadingExhibits) return <GlobalLoading page="Home" />;
  
  // todo: if there is no exhibits yet or a problem in the database 
  if(!exhibits || !user) return <MaintenanceScreen />

  return (
    <View className="flex-1 bg-background">
      <CustomHeader type="welcome" content="home" />
      <View className="h-[80px]" />

      <ScrollView className="flex-1">
        {/* recommended Exhibits */}
        <RecommendedList userId={user?.id as number} router={router} />

        {/* Chat with Guide Button */}
        <View className="mx-4 mb-2 bg-white dark:bg-black rounded-xl shadow-sm overflow-hidden">
          <TouchableOpacity onPress={() => router.push("/chat")}>
            <LRView className="items-center gap-2 p-4">
              <View className="bg-primary/20 p-3 rounded-full">
                <Ionicons
                  name="chatbubble-ellipses"
                  size={28}
                  color={COLORS.light.primary}
                />
              </View>
              <View className="flex-1">
                <LRView className="pr-2">
                  <TransText
                    title="chatbot.title"
                    className="font-bold text-lg text-foreground/80"
                  />
                </LRView>
                <TransText
                  title="chatbot.description"
                  className="text-foreground/60"
                />
              </View>
              <Ionicons
                name={
                  i18n.language === "ar" ? "chevron-back" : "chevron-forward"
                }
                size={24}
                color={COLORS.light.primary}
              />
            </LRView>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="p-4">
          <LRView className="w-full px-2">
            <TransText
              title="categories.explore"
              className="text-xl font-bold mb-4 text-foreground/60"
            />
          </LRView>
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
      {/* <LRView className="absolute bottom-6 px-6"> */}
        <TouchableOpacity
          className={cn(
            "absolute bottom-6 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg",
            i18n.language === "ar" ? "ml-4" : 'right-6'
          )}
          onPress={() => router.push("/chat")}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color="white" />
        </TouchableOpacity>
      {/* </LRView> */}
    </View>
  );
}
