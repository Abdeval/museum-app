import React from 'react'
import { useSession } from '@/context/AuthProvider'
import ChatHistoryScreen from '@/components/screens/ChatHistoryScreen';

export default function ChatHistory() {
    const { user } = useSession();
  return (
   <ChatHistoryScreen userId={user?.id as number} />
  )
}