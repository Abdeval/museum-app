import * as SecureStore from "expo-secure-store"

const API_KEY_STORAGE_KEY = "openai_api_key"

export async function saveApiKey(apiKey: string): Promise<void> {
  await SecureStore.setItemAsync(API_KEY_STORAGE_KEY, apiKey)
}

export async function getApiKey(): Promise<string | null> {
  return await SecureStore.getItemAsync(API_KEY_STORAGE_KEY)
}

export async function hasApiKey(): Promise<boolean> {
  const key = await getApiKey()
  return key !== null
}

export async function deleteApiKey(): Promise<void> {
  await SecureStore.deleteItemAsync(API_KEY_STORAGE_KEY)
}
