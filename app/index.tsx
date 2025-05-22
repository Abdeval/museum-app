import { TouchableOpacity, View } from "react-native";
import React from "react";
import Slider from "@/components/ui/Slider";
import { museumImages } from "@/lib/data";
import CustomHeader from "@/components/ui/CustomHeader";
import { Text } from "@/components/nativewindui/Text";
import { Redirect, useRouter } from "expo-router";
import { useSession } from "@/context/AuthProvider";

export default function Index() {
  const router = useRouter();
  const { user } = useSession();
  // console.log(user);
  if(user) return <Redirect href={'/home'}/>
  
  return (
    <View className="flex-1 relative">
      <CustomHeader type="welcome" content="welcome to " />
      <View className="h-[70px]" />
      <Slider museumImages={museumImages} />
      <TouchableOpacity
        onPress={() => router.push(user ? "/home" : "/sign-in")}
        className="bg-white/20 rounded-xl p-4 absolute z-50 top-[50%] left-[40%]"
      >
        <Text className="text-white font-bold">{user ? "Home" : "sign in"}</Text>
      </TouchableOpacity>
    </View>
  );
}
