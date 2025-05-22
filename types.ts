import { Chat, Exhibit, Favorite, Image, Message, Model3D } from "@/server/generated/prisma";
import { ImageSourcePropType } from "react-native";


export type MuseumImage = {
  title: string;
  description: string;
  src: ImageSourcePropType;
};

export interface SliderProps {
  museumImages: MuseumImage[]
}

export interface ExhibitType extends Exhibit {
  images: Image[];
  model: Model3D
}
export interface SignInCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface SignUpCredentials extends SignInCredentials {
  confirmPassword: string;
}

export type UserCredentials = SignUpCredentials | SignInCredentials;

export type UserToken = {
  email: string;
  id: number;
  iat: number
}

export interface FavoriteType extends Favorite {
  exhibit: ExhibitType;
}

export interface VisitDetailType {
  userId: number;
  visitedAt: Date;
  exhibitIds: number[];
  exhibitNumber: number;
}

export interface ChatType extends Chat {
  messages: Message[];
}

export interface ChatHistoryItemType {
  id: number;
  preview: string;
  timestamp: Date;
  isVoice: boolean;
}

export interface MessageType extends Message { 
  exhibits?: ExhibitType[];
  type?: string;
  // chat: ChatType;
}

export interface GroupedChats {
  title: string;
  data: ChatHistoryItemType[];
}

export interface CategoryGroupType {
  name: string;
  exhibits: number[];
}