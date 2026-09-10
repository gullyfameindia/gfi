import Svg, { Path } from "react-native-svg";

interface VideoEditorIconProps {
  size?: number | string;
  color?: string;
}
export const VideoEditorIcon = ({
  size = 24,
  color = "white",
}: VideoEditorIconProps) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.4-2.2 1.5-2.5l13.5-4c1.1-.3 2.2.4 2.5 1.5z" />
      <Path d="m6.2 5.3 3.1 3.9" />
      <Path d="m12.4 3.4 3.1 4" />
      <Path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </Svg>
  );
};
