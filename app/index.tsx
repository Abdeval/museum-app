import { TouchableOpacity, View } from "react-native";
import React from "react";
import Slider from "@/components/ui/Slider";
import { museumImagesAr, museumImagesEn, museumImagesFr } from "@/lib/data";
import CustomHeader from "@/components/ui/CustomHeader";
import { Text } from "@/components/nativewindui/Text";
import { Redirect, useRouter } from "expo-router";
import { useSession } from "@/context/AuthProvider";
import { useTranslation } from "react-i18next";

export default function Index() {
  const router = useRouter();
  const { user } = useSession();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const isFr = i18n.language === 'fr';
  const isEn = i18n.language === 'en';

  // console.log(user);
  if(user) return <Redirect href={'/home'}/>
  
  return (
    <View className="flex-1 relative bg-background">
      <CustomHeader type="home" content="welcome" />
      <View className="h-[70px]" />
      <Slider museumImages={isAr ? museumImagesAr : isFr ? museumImagesFr : isEn ? museumImagesEn : museumImagesEn } />
      <TouchableOpacity
        onPress={() => router.push(user ? "/home" : "/sign-in")}
        className="bg-white/20 rounded-xl p-4 absolute z-50 top-[50%] left-[35%]"
      >
        <Text className="text-white font-bold">{user ? t("navigation.home") : t("signIn.button")}</Text>
      </TouchableOpacity>
    </View>
  );
}
