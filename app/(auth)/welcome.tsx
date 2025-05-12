import {
  View,
} from "react-native";
import React from "react";
import Slider from "@/components/ui/Slider";
import { museumImages } from "@/lib/data";


export default function Welcome() {
  return (
    <View className="">
      <View className="h-[60px]" />
      <Slider museumImages={museumImages}/>
    </View>
      
  );
}
