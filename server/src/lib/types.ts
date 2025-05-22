export interface ChatHistoryItemType {
  id: number;
  preview: string;
  timestamp: Date;
  isVoice: boolean;
}

export interface GroupedChats {
  title: string;
  data: ChatHistoryItemType[];
}
