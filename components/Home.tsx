import { View, Text } from "react-native";
import React from "react";
import { ThemeToggle } from "./nativewindui/ThemeToggle";
import { Link } from "expo-router";

const Home = () => {
  return (
    <View className="h-screen w-screen flex items-center justify-center ">
      <Text className="font-medium text-3xl text-light-text dark:text-white">Home</Text>
      <ThemeToggle />
      <Link href={'/(auth)/sign-in'}>
        sign in
      </Link>
    </View>
  );
};

export default Home;
