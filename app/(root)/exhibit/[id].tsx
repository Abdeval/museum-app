import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  type ListRenderItem,
} from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import CustomHeader from "@/components/ui/CustomHeader"
import { useExhibit, useExhibitInfo } from "@/hooks/useExhibit"
import { BACKEND_BASE_URL } from "@/constants"
import { COLORS } from "@/theme/colors"
import { useColorScheme } from "@/lib/useColorScheme"
import LRView from "@/components/ui/LRView"
import TransText from "@/components/ui/TransText"
import GlobalLoading from "@/components/ui/loading/GlobalLoading"
import { useAddMessage, useChat } from "@/hooks/useChat"
import { useSession } from "@/context/AuthProvider"
import { chatBotModel, handleNormalMessage } from "@/utils/messages-helper"
import { postApi } from "@/lib/api/axios-apis"
import type { CheckExistingChatDto } from "@/server/src/chat/chat.dto"
import { useCallback, useRef, useState } from "react"
import Model3DSection from "@/components/ui/Model3DSection"

const { width: screenWidth } = Dimensions.get("window")

interface ExhibitImage {
  id: number
  url: string
}

// Declare __DEV__ if it's not already defined (e.g., in a .env file or build process)
// declare const __DEV__: boolean

export default function ExhibitDetailScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { exhibit, isLoadingExhibit } = useExhibitInfo(Number(id))
  const { colorScheme } = useColorScheme()
  const { user } = useSession()
  const { addChat } = useChat(user?.id || 0)
  const { addMessage } = useAddMessage()
  const { exhibits } = useExhibit({ search: false })

  // State for image gallery
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({})
  const mainFlatListRef = useRef<FlatList>(null)
  const thumbnailFlatListRef = useRef<FlatList>(null)

  // ? just Debug logging
  // useEffect(() => {
  //   if (exhibit) {
  //     console.log("Exhibit data:", exhibit)
  //     console.log("Images array:", exhibit.images)
  //     console.log("Images length:", exhibit.images?.length)
  //     console.log("BACKEND_BASE_URL:", BACKEND_BASE_URL)

  //     // Log each image URL
  //     exhibit.images?.forEach((img: any, index: number) => {
  //       const fullUrl = `${BACKEND_BASE_URL}/public${img?.url}`
  //       console.log(`Image ${index}:`, fullUrl)
  //     })
  //   }
  // }, [exhibit])

  // Handle image load error
  const handleImageError = useCallback((imageId: string, error: any) => {
    console.error(`Failed to load image ${imageId}:`, error)
    setImageErrors((prev) => ({ ...prev, [imageId]: true }))
  }, [])

  // Handle main image scroll
  const onMainScroll = useCallback(
    (event: any) => {
      const contentOffset = event.nativeEvent.contentOffset.x
      const index = Math.round(contentOffset / screenWidth)

      if (index !== currentImageIndex && index >= 0 && exhibit?.images && index < exhibit.images.length) {
        setCurrentImageIndex(index)

        // Scroll thumbnail to center the active thumbnail
        if (thumbnailFlatListRef.current && exhibit.images.length > 1) {
          try {
            thumbnailFlatListRef.current.scrollToIndex({
              index,
              animated: true,
              viewPosition: 0.5,
            })
          } catch (error) {
            console.warn("Error scrolling thumbnail:", error)
          }
        }
      }
    },
    [currentImageIndex, exhibit?.images],
  )

  // Handle thumbnail press
  const onThumbnailPress = useCallback((index: number) => {
    setCurrentImageIndex(index)

    // Scroll main FlatList to the selected image
    if (mainFlatListRef.current) {
      try {
        mainFlatListRef.current.scrollToIndex({
          index,
          animated: true,
        })
      } catch (error) {
        console.warn("Error scrolling main gallery:", error)
      }
    }
  }, [])
  
  // Main image render item with error handling
  const renderMainImage: ListRenderItem<ExhibitImage> = useCallback(
    ({ item, index }) => {
      if (!item || !item.url) {
        console.warn(`Invalid image data at index ${index}:`, item)
        return (
          <View style={{ width: screenWidth, height: 300 }} className="bg-gray-200 justify-center items-center">
            <Ionicons name="image-outline" size={50} color="#999" />
            <Text className="text-gray-500 mt-2">Image not available</Text>
          </View>
        )
      }

      const imageUrl = `${BACKEND_BASE_URL}/public${item.url}`
      const hasError = imageErrors[item.id.toString()]

      if (hasError) {
        return (
          <View style={{ width: screenWidth, height: 300 }} className="bg-gray-200 justify-center items-center">
            <Ionicons name="image-outline" size={50} color="#999" />
            <Text className="text-gray-500 mt-2">Failed to load image</Text>
            <TouchableOpacity
              onPress={() => {
                setImageErrors((prev) => ({ ...prev, [item.id.toString()]: false }))
              }}
              className="mt-2 bg-primary px-3 py-1 rounded"
            >
              <Text className="text-white text-sm">Retry</Text>
            </TouchableOpacity>
          </View>
        )
      }

      return (
        <View style={{ width: screenWidth }}>
          <Image
            source={{ uri: imageUrl }}
            style={{ width: screenWidth, height: 300 }}
            resizeMode="cover"
            onError={(error) => handleImageError(item.id.toString(), error)}
            onLoad={() => console.log(`Successfully loaded image: ${imageUrl}`)}
          />
        </View>
      )
    },
    [imageErrors, handleImageError],
  )

  // ! Thumbnail render item with error handling
  const renderThumbnail: ListRenderItem<ExhibitImage> = useCallback(
    ({ item, index }) => {
      if (!item || !item.url) {
        return (
          <View className="w-16 h-16 mr-2 rounded-lg bg-white dark:bg-black justify-center items-center border border-gray-300">
            <Ionicons name="image-outline" size={20} color="#999" />
          </View>
        )
      }

      const isActive = index === currentImageIndex
      const imageUrl = `${BACKEND_BASE_URL}/public${item.url}`
      const hasError = imageErrors[`thumb_${item.id}`]

      return (
        <TouchableOpacity
          onPress={() => onThumbnailPress(index)}
          className={`mr-2 rounded-[12px] overflow-hidden ${
            isActive ? "border-2 border-primary" : "border border-gray-300"
          }`}
          activeOpacity={0.7}
        >
          {hasError ? (
            <View className="w-16 h-16 bg-gray-200 justify-center items-center">
              <Ionicons name="image-outline" size={20} color="#999" />
            </View>
          ) : (
            <Image
              source={{ uri: imageUrl }}
              className="w-16 h-16 rounded-[12px]"
              resizeMode="cover"
              onError={(error) => handleImageError(`thumb_${item.id}`, error)}
            />
          )}
          {isActive && <View className="absolute inset-0 bg-primary/20" />}
        </TouchableOpacity>
      )
    },
    [currentImageIndex, onThumbnailPress, imageErrors, handleImageError],
  )

  // Key extractors
  const keyExtractor = useCallback((item: ExhibitImage) => item.id.toString(), [])

  // Create a new chat and start asking about this exhibit
  const handleCreateNewChat = useCallback(async () => {
    if (!user || !exhibit) {
      return
    }

    const text = `${exhibit.title} اريد المزيد من المعلومات حول هذا المعرض `

    // Check if we had already talked about this exhibit
    const dto: CheckExistingChatDto = {
      userId: user.id,
      message: text,
    }

    try {
      const chatExist = await postApi("/chats/history/existingChat", dto)

      let chatId: number

      if (chatExist.data) {
        chatId = chatExist.data.id
        router.push("/chat")
      } else {
        // Create new chat
        const chat = {
          userId: user.id,
          title: exhibit.title,
        }

        const addedChat = await addChat(chat)
        chatId = addedChat.data.id

        if (chatId === 0) {
          console.log("no chat id")
          return
        }

        await handleNormalMessage({
          type: "USER",
          content: text,
          chatId,
          addMessage,
        })

        // Get response from the model
        const responseText = await chatBotModel(
          text,
          [], // No previous message available
          exhibits,
        )

        const addedMessageByBot = await handleNormalMessage({
          type: "BOT",
          content: responseText,
          chatId,
          addMessage,
        })

        if (addedMessageByBot) {
          router.push("/chat")
        }
      }
    } catch (error) {
      console.error("Error creating chat:", error)
    }
  }, [user, exhibit, addChat, addMessage, exhibits, router])

  if (isLoadingExhibit) return <GlobalLoading page="details" />

  if (!exhibit) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Exhibit not found</Text>
        <TouchableOpacity className="mt-4 bg-primary px-4 py-2 rounded-lg" onPress={() => router.back()}>
          <Text className="text-foreground">Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Check if images exist and are valid
  const hasValidImages = exhibit.images && Array.isArray(exhibit.images) && exhibit.images.length > 0

  return (
    <View className="flex-1 bg-background">
      <CustomHeader type="home" content={exhibit.title} />
      <View className="h-[100px]" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Main Image Gallery */}
        {hasValidImages ? (
          <View className="mb-4">
            <FlatList
              ref={mainFlatListRef}
              data={exhibit.images}
              renderItem={renderMainImage}
              keyExtractor={keyExtractor}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onMainScroll}
              // ! Performance optimizations
              removeClippedSubviews={false} // Disable for debugging
              maxToRenderPerBatch={3}
              updateCellsBatchingPeriod={50}
              initialNumToRender={1}
              windowSize={3}
              getItemLayout={(data, index) => ({
                length: screenWidth,
                offset: screenWidth * index,
                index,
              })}
            />

            {/* Image Counter */}
            {exhibit.images.length > 1 && (
              <View className="absolute bottom-4 right-4 bg-black/50 rounded-full px-3 py-1">
                <Text className="text-white text-sm">
                  {currentImageIndex + 1} / {exhibit.images.length}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View className="h-[300px] bg-gray-200 justify-center items-center mx-4 rounded-lg mb-4">
            <Ionicons name="image-outline" size={50} color="#999" />
            <Text className="text-gray-500 mt-2">No images available</Text>
          </View>
        )}

        {/* Thumbnail Gallery */}
        {hasValidImages && exhibit.images.length > 1 && (
          <View className="mb-4 items-center">
            <FlatList
              ref={thumbnailFlatListRef}
              data={exhibit.images}
              renderItem={renderThumbnail}
              keyExtractor={keyExtractor}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
              }}
              // Performance optimizations
              removeClippedSubviews={false} // Disable for debugging
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              initialNumToRender={1}
              windowSize={10}
            />
          </View>
        )}

        {/* 3D Model Section */}
        <Model3DSection exhibitId={Number(id)} exhibitTitle={exhibit.title} />


        {/* Exhibit Details */}
        <View className="p-4">
          <Text className="text-2xl font-bold text-foreground mb-4">{exhibit.title}</Text>
          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ marginBottom: 8, padding: 4, alignItems: 'center' }}
          > 
            <View className="bg-primary/10 px-3 py-1 rounded-full mr-2">
              <Text className="text-primary font-medium">{exhibit.thematic_category}</Text>
            </View>
            <View className="px-3 py-1 rounded-full mr-2">
              <Text className="text-foreground opacity-100 font-medium">{exhibit.chronological_category}</Text>
            </View>
            <Text className="text-gray-500">{exhibit.year}</Text>
          </ScrollView>

          {/* Artist */}
          {exhibit.artist && (
            <View className="flex-row items-center mb-4">
              <Ionicons name="person-outline" size={16} color="#666" />
              <Text className="text-gray-700 ml-1">Artist: {exhibit.artist}</Text>
            </View>
          )}

          {/* Location */}
          <View className="flex-row items-center mb-4">
            <Ionicons name="location-outline" size={16} color={COLORS[colorScheme].primary} />
            <Text className="text-foreground ml-1">Location: Alger</Text>
          </View>

          {/* Description */}
          <LRView>
            <TransText title="exhibit.about" className="text-lg text-foreground/60 font-bold mt-4 mb-2" />
          </LRView>
          <LRView>
            <Text className="text-foreground/60 text-base leading-6">{exhibit.description}</Text>
          </LRView>

          {/* Additional spacing for floating button */}
          <View className="h-20" />
        </View>
      </ScrollView>

      {/* Floating Chat Button */}
      <TouchableOpacity
        className="absolute bottom-10 right-6 bg-primary flex-row items-center py-3 px-4 rounded-full shadow-lg"
        onPress={handleCreateNewChat}
        activeOpacity={0.8}
      >
        <LRView className="gap-2">
          <Ionicons name="chatbubble-ellipses" size={20} color="white" />
          <TransText title="exhibit.askAbout" className="text-white font-medium" />
        </LRView>
      </TouchableOpacity>
    </View>
  )
}
