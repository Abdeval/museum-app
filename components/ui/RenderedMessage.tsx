import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { Message } from '@/server/generated/prisma';
import ExhibitCard from './ExhibitCard';
import Iconify from 'react-native-iconify';
import { MessageType } from '@/types';
import { COLORS } from '@/constants/Colors';

interface RenderedMessageProps {
  item: MessageType;
  handleSpeakText: (text: string) => void;
  navigateToExhibit: (exhibitId: number) => void;
  isSpeaking: boolean;
}

export default function RenderedMessage({
    item,
    handleSpeakText,
    navigateToExhibit,
    isSpeaking
}: RenderedMessageProps) {
  
  if (item?.exhibits && item.exhibits.length > 0) {
      return (
        <View className="mb-4">
          <Text className="text-gray-600 mb-2 ml-4">{item.content}</Text>
          <FlatList
            data={item.exhibits}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: exhibit }) => (
              <ExhibitCard
                isFavorited={false}
                exhibit={exhibit}
                onPress={() => navigateToExhibit(exhibit.id)}
              />
            )}
            keyExtractor={(exhibit) => exhibit.id.toString()}
            className="pl-2"
          />
        </View>
      );
    }

    return (
      <View
        className={`rounded-2xl px-4 py-3 max-w-[85%] mb-2 ${
          item.sender === "USER"
            ? "bg-primary self-end rounded-tr-none"
            : "bg-secondary self-start rounded-tl-none"
        }`}
      >
        <View className="flex-row items-center">
          {item.isVoice && item.sender === "USER" && (
            <Iconify
              icon="mdi:microphone"
              size={16}
              color="white"
              style={{ marginRight: 6 }}
            />
          )}
          <Text
            className={`text-base ${item.sender === "USER" ? "text-white" : "text-gray-800 dark:text-white"}`}
          >
            {item.content}
          </Text>
        </View>

        {item.sender === "BOT" && (
          <TouchableOpacity
            onPress={() => handleSpeakText(item.content)}
            className="self-end mt-1"
          >
            <Iconify
              icon={isSpeaking ? "mdi:volume-high" : "mdi:volume-medium"}
              size={18}
              color={COLORS.light.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    );
}