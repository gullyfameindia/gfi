import { scale } from "@/utils/responsive";
import { ImageStyle } from "expo-image";
import {
  Image,
  ImageResizeMode,
  ImageSourcePropType,
  StyleProp,
} from "react-native";

const CATEGORY_IMAGES = {
  dance: require("@assets/images/Dancing_category.png"),
  music: require("@assets/images/Music_category.png"),
  comedy: require("@assets/images/Comedy_category.png"),
  cook: require("@assets/images/Cook_category.png"),
} as const;
interface BaseImageIconProps {
  source: ImageSourcePropType;
  styles?: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode;
}
type BaseImageIconPropsForChild = Omit<BaseImageIconProps, "source">;
function BaseImageIcon({
  source,
  styles,
  resizeMode = "contain",
}: BaseImageIconProps) {
  return (
    <Image
      source={source}
      resizeMode={resizeMode}
      style={[{ width: scale(30), height: scale(30) }, styles]}
    ></Image>
  );
}
export const NotificationIcon = ({
  styles = { width: scale(40), height: scale(40) },
}: BaseImageIconPropsForChild) => {
  return (
    <BaseImageIcon
      styles={styles}
      source={require("@assets/images/Notification.png")}
    ></BaseImageIcon>
  );
};
export const ChatIcon = ({ styles }: BaseImageIconPropsForChild) => {
  return (
    <BaseImageIcon
      source={require("@assets/images/Chat.png")}
      styles={styles}
    ></BaseImageIcon>
  );
};
export const CategoryIcon = ({
  type,
  styles = { width: scale(28), height: scale(28) },
}: BaseImageIconPropsForChild & {
  type: "cook" | "dance" | "comedy" | "music";
}) => {
  return (
    <BaseImageIcon
      source={CATEGORY_IMAGES[type]}
      styles={styles}
    ></BaseImageIcon>
  );
};
