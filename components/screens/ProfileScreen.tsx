import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useColorScheme } from "nativewind";
import { Icon } from "@roninoss/icons";
import { COLORS } from "@/constants/Colors";
import FavoritedExhibitsCards from "../ui/FavoritedExhibitsCards";
import { avatarMap, BADGES } from "@/lib/data";
import { useFavoritedExhibit } from "@/hooks/useExhibit";
import GlobalLoading from "../ui/loading/GlobalLoading";
import { useUser } from "@/hooks/useUser";
import HistoryList from "../ui/HistoryList";
import { useVisit } from "@/hooks/useVisit";
import BadgesList from "../ui/BadgesList";
import Settings from "../ui/Settings";
import HistoryVisitsSkeleton from "../ui/loading/HistoryVisitsSkeleton";
import EmptyHistoryVisits from "../ui/EmptyHistoryVisits";

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

// Define user profile type
interface UserProfile {
  name: string;
  email: string;
  memberSince: string;
  membershipType: string;
  profileImage: string | null;
  visitCount: number;
  lastVisit: string;
}

// Default profile data
const DEFAULT_PROFILE: UserProfile = {
  name: "Museum Visitor",
  email: "visitor@example.com",
  memberSince: "May 2023",
  membershipType: "Explorer",
  profileImage: null,
  visitCount: 8,
  lastVisit: "May 10, 2025",
};

interface ProfileProps {
  signOut: () => void;
  userId: number;
}

export default function ProfileScreen({ signOut, userId }: ProfileProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState("favorites");
  const { userInfo } = useUser(userId);
  const { data: favoriteExhibits, isLoading } = useFavoritedExhibit(
    Number(userId)
  );
  const { data: visits, isLoading: isLoadingVisits } = useVisit(userId);

  // ! Handle profile image selection
  const handleChangeProfileImage = async () => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to change your profile picture."
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfile({
          ...profile,
          profileImage: result.assets[0].uri,
        });

        console.log(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  // todo: Remove favorite exhibit

  if (!userInfo) {
    return <GlobalLoading page="Profile" />;
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="h-[100px] bg-background/80" />

      {/* Profile Header */}
      <AnimatedImageBackground
        source={require("@/assets/images/welcome/welcome1.jpg")}
        entering={FadeInDown.duration(600)}
        className="bg-background/80 relative rounded-b-[34px] overflow-hidden
         shadow-md border border-t-0 border-border"
      >
        <View className="w-full h-full bg-background opacity-30 absolute backdrop-blur-md" />

        <View className="items-center p-2">
          <TouchableOpacity
            onPress={handleChangeProfileImage}
            className="relative"
          >
            {userInfo.avatar ? (
              <Image
                source={avatarMap[userInfo.avatar]}
                className="w-28 h-28 rounded-full border-4 border-white"
                resizeMode="cover"
              />
            ) : (
              <View className="w-28 h-28 rounded-full bg-gray-300 items-center justify-center border-4 border-white">
                <Ionicons name="person" size={60} color="#6366f1" />
              </View>
            )}
            <View className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
              <Ionicons name="camera" size={18} color="#6366f1" />
            </View>
          </TouchableOpacity>

          <Text className="text-foreground text-2xl font-bold mt-3">
            {userInfo.name}
          </Text>
          <Text className="text-white">{userInfo.email}</Text>

          <View className="flex-row items-center mt-2 bg-white/20 px-4 py-1 rounded-full">
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text className="text-foreground ml-1">Member</Text>
          </View>
        </View>

        <View className="flex-row justify-around mt-6 pb-6">
          <View className="items-center">
            <Text className="text-foreground text-xl font-bold">
              {/* here will be the number of the visits of the user */}
              {profile.visitCount}
            </Text>
            <Text className="text-foreground/80">Visits</Text>
          </View>
          <View className="items-center">
            <Text className="text-foreground text-xl font-bold">
              {favoriteExhibits?.length || 0}
            </Text>
            <Text className="text-foreground/80">Favorites</Text>
          </View>
          <View className="items-center">
            <Text className="text-foreground text-xl font-bold">
              {BADGES.length}
            </Text>
            <Text className="text-foreground/80">Badges</Text>
          </View>
        </View>
      </AnimatedImageBackground>

      {/* Tab Navigation */}
      <View className="flex-row border-b border-border mt-4">
        <TouchableOpacity
          className={`flex-1 py-3 ${activeTab === "favorites" ? "border-b-2 border-primary" : ""}`}
          onPress={() => setActiveTab("favorites")}
        >
          <Text
            className={`text-center ${activeTab === "favorites" ? "text-primary font-bold" : "text-foreground"}`}
          >
            Favorites
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 ${activeTab === "history" ? "border-b-2 border-primary" : ""}`}
          onPress={() => setActiveTab("history")}
        >
          <Text
            className={`text-center ${activeTab === "history" ? "text-primary font-bold" : "text-foreground"}`}
          >
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 ${activeTab === "badges" ? "border-b-2 border-primary" : ""}`}
          onPress={() => setActiveTab("badges")}
        >
          <Text
            className={`text-center ${activeTab === "badges" ? "text-primary font-bold" : "text-foreground"}`}
          >
            Badges
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View className="p-4">
        {/* Favorites Tab */}
        {activeTab === "favorites" && (
          <FavoritedExhibitsCards
            isLoading={isLoading}
            exhibits={favoriteExhibits}
            FadeInDown={FadeInDown}
            FadeInRight={FadeInRight}
            router={router}
            userId={userInfo.id}
          />
        )}

        {/* History Tab */}
        {activeTab === "history" &&
          (isLoadingVisits ? (
            <HistoryVisitsSkeleton count={4} />
          ) : visits && visits.length > 0 ? (
            <HistoryList
              visits={visits}
              FadeInDown={FadeInDown}
              FadeInRight={FadeInRight}
            />
          ) : (
            <EmptyHistoryVisits />
          ))}

        {/* Badges Tab */}
        {activeTab === "badges" && (
          <BadgesList
            badges={BADGES}
            FadeInDown={FadeInDown}
            FadeInRight={FadeInRight}
          />
        )}
      </View>

      {/* Settings Section */}
      <Settings signOut={signOut} />

      {/* App Version */}
      <View className="items-center py-6">
        <Text className="text-gray-500">AMUSE Museum App v1.0.0</Text>
      </View>
    </ScrollView>
  );
}
