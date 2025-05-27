
import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Model3DViewer from "./Model3DViewer";
// import { use3DModel } from "@/hooks/use3DModel"
import { COLORS } from "@/constants/Colors";
import { useColorScheme } from "@/lib/useColorScheme";
import { use3DModel } from "@/hooks/use3DModel";

interface Model3DSectionProps {
  exhibitId: number;
  exhibitTitle: string;
}

export default function Model3DSection({
  exhibitId,
  exhibitTitle,
}: Model3DSectionProps) {
  const { colorScheme } = useColorScheme();
  const { model, isLoading3DModel, getModelUrl, error } = use3DModel({
    exhibitId,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render if no model exists
  // if (error) {
  //   return null;
  // }

  if (isLoading3DModel) {
    return (
      <View className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg mb-4 mx-4">
        <View className="flex-row items-center">
          <Ionicons
            name="cube-outline"
            size={24}
            color={COLORS[colorScheme].primary}
          />
          <Text className="text-foreground font-semibold ml-2">
            Loading 3D Model...
          </Text>
        </View>
      </View>
    );
  }

  if (error || !model) {
    return (
      <View className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg mb-4 mx-4">
        <View className="flex-row items-center">
          <Ionicons name="warning-outline" size={24} color="#ef4444" />
          <Text className="text-red-600 dark:text-red-400 font-semibold ml-2">
            3D Model Unavailable
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-6">
      {/* Section Header */}
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center justify-between p-4 bg-primary/10 dark:bg-primary/20 mx-4 rounded-lg"
      >
        <View className="flex-row items-center">
          <Ionicons name="cube" size={24} color={COLORS[colorScheme].primary} />
          <Text className="text-foreground font-bold text-lg ml-2">
            3D Model
          </Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color={COLORS[colorScheme].primary}
        />
      </TouchableOpacity>

      {/* 3D Model Viewer */}
      {isExpanded && (
        <View className="mt-4">
          <Model3DViewer
            modelUrl={getModelUrl(model)}
            title={`${exhibitTitle} - 3D View`}
            height={400}
            enableControls={true}
            autoRotate={false}
          />

          {/* Model Info */}
          {/* <View className="mx-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              Format: {model.format.toUpperCase()} • Size:{" "}
              {(model.size / 1024 / 1024).toFixed(1)} MB
            </Text>
          </View> */}
        </View>
      )}
    </View>
  );
}
