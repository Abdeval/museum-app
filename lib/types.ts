import { ImageSourcePropType } from "react-native";


export type MuseumImage = {
    title: string;
    description: string;
    src: ImageSourcePropType;
};

export interface SliderProps {
    museumImages: MuseumImage[]
}