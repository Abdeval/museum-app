import { View } from 'react-native'
import React from 'react'
import MaintenanceImage from '@/assets/images/fix-maitenance.svg'
import TransText from '../ui/TransText'

export default function MaintenanceScreen() {
  return (
    <View className='flex-1 gap-2 items-center justify-center bg-background'>
      <MaintenanceImage width={160} height={160}/>
      <TransText title='fix.database' className='text-foreground/60 text-xl'/>
    </View>
  )
}