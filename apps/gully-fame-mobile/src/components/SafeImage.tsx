import { memo, useState } from "react";
import { Image, ImageProps, ImageSourcePropType } from "react-native";

type SafeImageProps = Omit<ImageProps, "source"> & {
  defaultImage: ImageSourcePropType;
  imageUrl?: string;
};
const SafeImage = memo(
  ({ defaultImage, imageUrl, ...image }: SafeImageProps) => {
    const [imageFailedToLoad, setImageFailedToLoad] = useState(false);
    return (
      <Image
        source={
          imageUrl && !imageFailedToLoad ? { uri: imageUrl } : defaultImage
        }
        onError={() => setImageFailedToLoad(true)}
        {...image}
      ></Image>
    );
  },
);
SafeImage.displayName = "SafeImage";
export default SafeImage;
