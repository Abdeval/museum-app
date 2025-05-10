import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

export default function SignIn() {
  return (
    <View className="w-full h-full flex items-center justify-center">
      <View>
        <TouchableOpacity>
          <Text className="text-xl font-regular">create a free account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
