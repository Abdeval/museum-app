import { View, Text, TouchableOpacity } from "react-native";
import { COLORS } from "@/constants/Colors";
import { useAddMessage, useChat } from "@/hooks/useChat";
import { useRouter } from "expo-router";
import Iconify from "react-native-iconify";
import { useState } from "react";
import GlobalLoading from "./loading/GlobalLoading";
import { Ionicons } from "@expo/vector-icons";
import TransText from "./TransText";

export default function StartNewChat({ userId }: { userId: number }) {
  const router = useRouter();
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const { addChat } = useChat(userId);
  // const { addFirstMessage } = useAddMessage();

  // ! Handle creating a new chat
  const handleAddNewChat = async () => {
    setIsCreatingChat(true);
    try {
      // ! Create a new chat and get the chat data
      const chatData: any = await addChat({ userId, title: "new chat" });
      // const chatId = chatData.data.id;

      if (chatData) {
        // todo: Add the first bot message
        // await addFirstMessage(chatId);
        // console.log("added chat id :", chatData.data.id);
        // ! Navigate to chat screen
        // console.log("from the start a new chat , creating a new chat : ", chatData);
        // router.push("/chat")
      } else {
        console.error("Failed to create new chat");
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
    } finally {
      setIsCreatingChat(false);
    }
  };

  if (isCreatingChat) {
    return <GlobalLoading page="Creating new chat" />;
  }

  return (
    <View className="flex-1 justify-center items-center p-6 bg-background">
      <Iconify
        icon="mdi:robot-outline"
        size={80}
        color={COLORS.light.primary}
      />

      <TransText
        title="chatbot.welcome"
        className="text-foreground/60 text-2xl font-bold mt-6 text-center"
      />

      <TransText title="chatbot.description" className="text-gray-500 text-center mt-4 mb-8"/>

      <TouchableOpacity
        className="bg-primary rounded-full p-4 items-center px-8"
        onPress={handleAddNewChat}
      >
        <View className="flex-row items-center">
          <Ionicons name="add" size={20} color="white" />
          <TransText
            title="chatbot.start"
            className="text-white font-bold text-base ml-2"
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-4"
        onPress={() => router.push("/chat-history")}
      >
        <TransText title="history.viewHistory" className="text-primary font-medium text-base"/>
      </TouchableOpacity>
    </View>
  );
}
