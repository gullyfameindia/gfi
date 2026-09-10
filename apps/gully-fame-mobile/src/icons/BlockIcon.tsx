import React from "react";
import { Svg, Circle, Line } from "react-native-svg";

export const BlockIcon = ({ color = "#fff", size = 20 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Circle cx="12" cy="12" r="10" />
    <Line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </Svg>
);
