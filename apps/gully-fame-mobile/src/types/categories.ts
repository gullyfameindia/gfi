import { ImageSourcePropType } from "react-native";

export interface categoriesDataFromAPI {
    id: string | number;
    name: string;
    imageUrl?: string;
}
export type categoriesFullData = categoriesDataFromAPI & {
    icon: "cook" | "dance" | "comedy" | "music";
    defaultImage?: ImageSourcePropType;
};
