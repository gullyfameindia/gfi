import { ImageSourcePropType } from "react-native";

export interface competitionsDataFromAPI {
  id: number | string;
  title: string;
  prize?: number | string;
  status: "UPCOMING" | "COMPLETED" | "LIVE";
  dayLeft?: number;
  people?: number | string;
  entryFee?: number;
  image?: string;
  startDate?: string;
  subTitle?: string;
  endDate?: string;
  participants?: number;
  winner?: string;
  views?: number | string;
}
export type competitionsFullData = competitionsDataFromAPI & {
  defaultThumbnailImage: ImageSourcePropType;
};
