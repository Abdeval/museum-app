import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import React from "react";
import { Link } from "expo-router";
import Iconify from "react-native-iconify";

export default function SignIn() {
  return (
    <ImageBackground
      source={require("@/assets/images/sign-in-image.jpg")}
      className="w-full h-full flex items-center justify-between flex-col"
    >
      {/* the header */}
      <View></View>

      {/* bottom container */}
      <View className="shadow-xl shadow-black bg-background/80 pt-6 border border-border w-full flex items-center rounded-t-[38px] h-[40%] gap-2">
        <TouchableOpacity className="bg-primary p-4 rounded-2xl w-[80%]">
          <Text className="text-xl font-regular capitalize text-white text-center">
            create a free account
          </Text>
        </TouchableOpacity>
        <View className="flex-row items-center gap-3 w-[80%] justify-center">
          <View className="border w-[42%] h-0 border-border" />
          <Text className="font-medium text-xl text-muted-foreground">or</Text>
          <View className="border w-[42%] border-border" />
        </View>
        <View className="w-full flex flex-col gap-2 items-center">
          <View className="flex flex-row items-center justify-between gap-4 w-[80%] py-2">
            <TouchableOpacity className="py-2 bg-white rounded-lg w-[45%] flex items-center justify-center">
              <Iconify icon="logos:google-icon" size={30} />
            </TouchableOpacity>
            <TouchableOpacity className="py-2 bg-white rounded-lg w-[45%] flex items-center justify-center">
              <Iconify icon="ic:sharp-apple" size={30} color={"black"} />
            </TouchableOpacity>
          </View>
          <Text className="text-[16px] ">
            already have an account{" "}
            <Link href={"/(auth)/sign-in"} className="underline text-primary">
              sign in
            </Link>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}
