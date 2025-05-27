import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useColorScheme } from "@/lib/useColorScheme";
import { Icon } from "@roninoss/icons";
import { COLORS } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
// import TransText from "./TransText";
import LanguagePicker from "./LanguagePicker";
import TransText from "./TransText";
import LRView from "./LRView";

export default function Settings({ signOut }: { signOut: () => void }) {
  const { colorScheme, setColorScheme } = useColorScheme();

  return (
    <View className="px-4">
      <TransText
        className="text-foreground text-lg font-semibold mb-4"
        title="settings.title"
      />
      <View className="bg-primary-foreground dark:bg-black rounded-lg overflow-hidden">
        <TouchableOpacity
          onPress={() => {
            setColorScheme(colorScheme === "dark" ? "light" : "dark");
          }}
          className="p-4 pr-6 border-b border-border"
        >
          <LRView className="justify-between w-full items-center">
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
            <TransText
              title={`settings.${colorScheme}Mode`}
              className="text-foreground ml-3"
            />
          </LRView>
        </TouchableOpacity>
        {/* change the lang */}
        <LanguagePicker />

        <TouchableOpacity className="p-4 pr-6 border-b border-border">
          <LRView className="justify-between w-full items-center">
            <Ionicons
              name="notifications-outline"
              size={20}
              color={COLORS.light.primary}
            />
            <TransText
              title="settings.notifications"
              className="text-foreground ml-3"
            />
          </LRView>
        </TouchableOpacity>

        <TouchableOpacity className="p-4 pr-6">
          <LRView className="justify-between w-full items-center">
            <Ionicons
              name="help-circle-outline"
              size={20}
              color={COLORS.light.primary}
            />
            <TransText title="settings.help" className="text-foreground ml-3" />
          </LRView>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={signOut}
        className="bg-red-500/20 p-4 rounded-lg mt-6 items-center"
      >
        <TransText title="signOut" className="text-red-500 font-medium" />
      </TouchableOpacity>
    </View>
  );
}
