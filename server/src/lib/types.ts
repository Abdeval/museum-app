export interface ChatHistoryItemType {
  id: number;
  preview: string;
  timestamp: string;
  isVoice: boolean;
  messages?: number;
  exhibits?: number;
}

export interface GroupedChats {
  title: string;
  data: ChatHistoryItemType[];
}
