import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useColorScheme } from "@/lib/useColorScheme";
import { Icon } from "@roninoss/icons";
import { COLORS } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import TransText from "./TransText";

export default function Settings({ signOut }: { signOut: () => void }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { i18n } = useTranslation();

  const toggleLanguage = async (lang: string) => {
    await AsyncStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
  };

  return (
    <View className="px-4">
      <Text className="text-foreground text-lg font-semibold mb-4">
        Settings
      </Text>
      <View className="bg-primary-foreground dark:bg-black rounded-lg overflow-hidden">
        <TouchableOpacity
          onPress={() => {
            setColorScheme(colorScheme === "dark" ? "light" : "dark");
          }}
          className="flex-row justify-between items-center p-4 border-b border-border"
        >
          <View className="flex-row items-center">
            {colorScheme === "dark" ? (
              <Icon
                namingScheme="sfSymbol"
                name="moon.stars"
                color={COLORS.light.primary}
              />
            ) : (
              <Icon
                namingScheme="sfSymbol"
                name="sun.min"
                color={COLORS.light.primary}
              />
            )}
            <Text className="text-foreground ml-3 capitalize">
              {colorScheme} theme
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORS.light.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row justify-between items-center p-4 border-b border-border">
          <View className="flex-row items-center">
            <Ionicons
              name="person-outline"
              size={20}
              color={COLORS.light.primary}
            />
            <Text className="text-foreground ml-3">Edit Profile</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORS.light.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => toggleLanguage("en")}
          className="flex-row justify-between items-center p-4 border-b border-border"
        >
          <View className="flex-row items-center">
            <Ionicons name="language" size={20} color={COLORS.light.primary} />
            <TransText className="text-foreground ml-3" title="settings.selectLanguage"/>
          </View>
          {/* <Ionicons name="chevron-forward" size={20} color={COLORS.light.primary} /> */}
          <TransText className="text-foreground" title={`languages.${i18n.language}`}/>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row justify-between items-center p-4 border-b border-border">
          <View className="flex-row items-center">
            <Ionicons
              name="notifications-outline"
              size={20}
              color={COLORS.light.primary}
            />
            <Text className="text-foreground ml-3">Notifications</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORS.light.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row justify-between items-center p-4">
          <View className="flex-row items-center">
            <Ionicons
              name="help-circle-outline"
              size={20}
              color={COLORS.light.primary}
            />
            <Text className="text-foreground ml-3">Help & Support</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORS.light.primary}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={signOut}
        className="bg-red-500/20 p-4 rounded-lg mt-6 items-center"
      >
        <Text className="text-red-500 font-medium">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
