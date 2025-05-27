import { useState } from "react";
import { Picker, PickerItem } from "../nativewindui/Picker";
// import { COLORS } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useColorScheme } from "@/lib/useColorScheme";
import { COLORS } from "@/theme/colors";
import LRView from "./LRView";

export default function LanguagePicker() {
  const { i18n, t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const [picker, setPicker] = useState(() => {
    const lang = i18n.language;
    return lang;
  });

  const toggleLanguage = async (lang: string) => {
    await AsyncStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
  };

  return (
    <LRView className="justify-between items-center px-4 pr-6 border-b border-border w-full">
      <Ionicons name="language" size={20} color={COLORS.light.primary} />
      <Picker
        selectedValue={picker}
        onValueChange={(itemValue) => {
          toggleLanguage(itemValue);
          setPicker(itemValue);
        }}
        className="z-50 relative w-full"
        style={{
          backgroundColor: COLORS[colorScheme].card,
          color: COLORS[colorScheme].foreground, // Optional: Text color
          borderWidth: 0,
          borderRadius: 8,
        }}
        dropdownIconColor={COLORS[colorScheme].primary} 
      >
        <PickerItem
          label={t(`languages.ar`)}
          value="ar"
          color={COLORS[colorScheme].foreground}
          style={{
            backgroundColor: COLORS[colorScheme].card,
            borderWidth: 1,
            borderColor: 'red'
          }}
        />
        <PickerItem
          label={t(`languages.fr`)}
          value="fr"
          color={COLORS[colorScheme].foreground}
          style={{
            backgroundColor: COLORS[colorScheme].card,
          }}
        />
        <PickerItem
          label={t(`languages.en`)}
          value="en"
          color={COLORS[colorScheme].foreground}
          style={{
            backgroundColor: COLORS[colorScheme].card,
          }}
        />
      </Picker>
    </LRView>
  );
}
