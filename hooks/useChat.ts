import { deleteApi, getApi, postApi } from "@/lib/api/axios-apis"
import type { CreateChatDto, CreateMessageDto } from "@/server/src/chat/chat.dto"
import { useIsFocused } from "@react-navigation/native"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { FIRST_MESSAGE } from "@/lib/data"

// Enhanced useChat hook with better state management
export const useChat = (userId: number) => {
  const queryClient = useQueryClient()

  const {
    data,
    isLoading: isLoadingChats,
    isError,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: () => getApi(`/chats/history/${userId}`),
    enabled: !!userId,
  })

  const {
    mutate: add,
    data: newAddedChat,
    isPending: isAdding,
  } = useMutation({
    mutationKey: ["add-chat"],
    mutationFn: (dto: CreateChatDto) => postApi("/chats/create", dto),
    onSuccess: async (response: any) => {
      const newChatId = response?.data?.data?.id

      if (newChatId) {
        await AsyncStorage.setItem("currentChatId", newChatId.toString())

        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["chats"] })
        queryClient.invalidateQueries({ queryKey: ["currentChat"] })
        queryClient.invalidateQueries({ queryKey: ["chatMessages"] })

        return response.data.data
      }
    },
  })

  const { mutate: deleteM, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-chat"],
    mutationFn: (chatId: number) => deleteApi(`/chats/delete/${chatId}`),
    onSuccess: async () => {
      // Clear the current chat ID if it was deleted
      const currentChatId = await AsyncStorage.getItem("currentChatId")
      if (currentChatId) {
        await AsyncStorage.removeItem("currentChatId")
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["chats"] })
      queryClient.invalidateQueries({ queryKey: ["currentChat"] })
      queryClient.invalidateQueries({ queryKey: ["chatMessages"] })
    },
    onError: (err) => {
      console.error("Delete error:", err)
    },
  })

  // Function to create a new chat with initial bot message
  const createNewChat = async () => {
    return new Promise((resolve) => {
      add(
        { userId },
        {
          onSuccess: (data) => {
            resolve(data)
          },
          onError: () => {
            resolve(null)
          },
        },
      )
    })
  }

  return {
    chats: data,
    isLoadingChats,
    isError,
    createNewChat,
    addChat: add,
    newAddedChat,
    deleteChat: deleteM,
    isAdding,
    isDeleting,
  }
}

// Enhanced hook to get current chat and messages
export const useChatMessages = (userId: number) => {
  const isFocused = useIsFocused()
  const queryClient = useQueryClient()

  // Get the current chat ID from AsyncStorage
  const { data: currentChatId, isLoading: isLoadingChatId } = useQuery({
    queryKey: ["currentChatId"],
    queryFn: async () => {
      const storedChatId = await AsyncStorage.getItem("currentChatId")
      return storedChatId ? Number.parseInt(storedChatId) : null
    },
    staleTime: 0, // Always refetch to ensure we have the latest
  })

  // Get the current chat details
  const { data: currentChat, isLoading: isLoadingCurrentChat } = useQuery({
    queryKey: ["currentChat", currentChatId],
    queryFn: () => getApi(`/chats/latest/${userId}/${currentChatId}`),
    enabled: !!currentChatId && isFocused,
  })

  // Fallback to latest chat if no current chat is set
  const { data: latestChat, isLoading: isLoadingLatestChat } = useQuery({
    queryKey: ["latestChat", userId],
    queryFn: () => getApi(`/chats/latest/${userId}/null`),
    enabled: !currentChatId && !!userId && isFocused,
  })

  // Determine which chat ID to use
  const chatId = currentChatId || (latestChat && latestChat.id)

  // Get messages for the current chat
  const {
    data: messages,
    isLoading: isLoadingMessages,
    isError: isGettingMessagesError,
  } = useQuery({
    queryKey: ["chatMessages", chatId],
    queryFn: () => getApi(`/chats/messages/${chatId}`),
    enabled: !!chatId && isFocused,
  })

  // Function to set a specific chat as current
  const setCurrentChat = async (id: number) => {
    await AsyncStorage.setItem("currentChatId", id.toString())
    queryClient.invalidateQueries({ queryKey: ["currentChatId"] })
  }

  // Function to clear the current chat
  const clearCurrentChat = async () => {
    await AsyncStorage.removeItem("currentChatId")
    queryClient.invalidateQueries({ queryKey: ["currentChatId"] })
  }

  return {
    chatId,
    currentChat: currentChat || latestChat,
    messages,
    isLoadingMessages,
    isGettingMessagesError,
    isLoadingCurrentChat: isLoadingCurrentChat || isLoadingLatestChat || isLoadingChatId,
    setCurrentChat,
    clearCurrentChat,
  }
}

// Enhanced hook for message operations
export const useAddMessage = () => {
  const queryClient = useQueryClient()

  const {
    mutate,
    data: addedMessage,
    isPending: isAddingMessage,
  } = useMutation({
    mutationKey: ["add-message"],
    mutationFn: (message: CreateMessageDto) => postApi(`/chats/messages/create`, message),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chatMessages"],
      })
    },
    onError: (err) => {
      console.error("Error adding message:", err)
    },
  })

  // Function to add the first bot message to a new chat
  const addFirstMessage = async (chatId: number) => {
    if (!chatId) return

    const firstMessage: CreateMessageDto = {
      content: FIRST_MESSAGE,
      type: "BOT",
      chatId,
    }

    mutate(firstMessage)
  }

  return {
    addMessage: mutate,
    addedMessage,
    isAddingMessage,
    addFirstMessage,
  }
}

export const useDeleteChat = () => {
  const queryClient = useQueryClient()

  const deleteAllMutation = useMutation({
    mutationKey: ["delete-all"],
    mutationFn: (userId: number) => deleteApi(`/chats/delete/all/${userId}`),
    onSuccess: async () => {
      // Clear current chat when all chats are deleted
      await AsyncStorage.removeItem("currentChatId")
      queryClient.invalidateQueries({
        queryKey: ["chats"],
      })
      queryClient.invalidateQueries({
        queryKey: ["currentChatId"],
      })
    },
  })

  return {
    deleteAllChats: deleteAllMutation.mutate,
    isDeleting: deleteAllMutation.isPending,
  }
}
