import { View, Text } from 'react-native'
import React from 'react'

export default function PageNotMounted() {
  return (
    <View className='flex-1 flex items-center justify-center'>
      <Text className='font-semibold text-xl'>Page Not Mounted Yet</Text>
    </View>
  )
}