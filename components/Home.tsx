import { View, Text, ScrollView, Button } from "react-native";
import React from "react";
import { ThemeToggle } from "./nativewindui/ThemeToggle";
import { Link } from "expo-router";
import BottomSheet from "./ui/BottomSheet";
import { useSheetRef } from "./nativewindui/Sheet";

const Home = () => {
  const bottomSheetModalRef = useSheetRef();

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic" className="p-4">
        <View className="border-border bg-card gap-4 rounded-xl border p-4 pb-6 shadow-sm shadow-black/10 dark:shadow-none">
          <Text className="text-foreground text-center text-sm font-medium tracking-wider opacity-60">
            Bottom Sheet
          </Text>
          <Button
            color={"black"}
            title="Open Bottom Sheet"
            onPress={() => bottomSheetModalRef.current?.present()}
          />
        </View>
        <Text className="font-medium text-3xl text-light-text dark:text-white">
          Home and mother
        </Text>
        <ThemeToggle />
        <Link href={"/(auth)/sign-in"}>sign in</Link>
        <Link href={"/(auth)/welcome"}>welcome</Link>
      </ScrollView>
      <BottomSheet bottomSheetModalRef={bottomSheetModalRef} />
    </>
  );
};

export default Home;
