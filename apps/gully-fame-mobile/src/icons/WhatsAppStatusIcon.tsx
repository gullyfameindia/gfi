import React from "react";
import { Svg, Circle, Path, G, Line } from "react-native-svg";

export const WhatsAppStatusIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <G>
      <Circle cx="12" cy="12" r="9" fill="#67C15E" />
      <Path
        d="M21.5,12A9.5,9.5,0,1,0,12,21.5h9.5l-2.66-2.92A9.43,9.43,0,0,0,21.5,12Z"
        fill="#fff"
      />
      <Line
        x1="8.2"
        y1="12"
        x2="15.8"
        y2="12"
        stroke="#67C15E"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <Line
        x1="12"
        y1="8.2"
        x2="12"
        y2="15.8"
        stroke="#67C15E"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </G>
  </Svg>
);
