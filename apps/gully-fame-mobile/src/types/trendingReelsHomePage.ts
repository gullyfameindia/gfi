import { ImageSourcePropType } from "react-native";

export interface trendingReelsHomePageDataFromAPI {
    id: number | string;
    rank: number;
    creatorUsername: string;
    title: string;
    views: number;
    likes: number;
    thumbnailUrl?: string;
}
export type trendingReelsHomePageFullData = trendingReelsHomePageDataFromAPI & {
    defaultThumbnailImage: ImageSourcePropType;
};
