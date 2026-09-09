import { Dimensions, Platform, PixelRatio } from "react-native";


const getDimensions = () => {
  const dims = Dimensions.get("window");
  return {
    width: Math.min(dims.width, dims.height), 
    height: Math.max(dims.width, dims.height), 
    scale: PixelRatio.get(),
    fontScale: PixelRatio.getFontScale(),
  };
};


const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;


export const scale = (size: number): number => {
  const { width, scale: pixelRatio } = getDimensions();
  const scaleFactor = width / BASE_WIDTH;
  const scaledSize = size * scaleFactor;
  
  return Math.round(scaledSize * pixelRatio) / pixelRatio;
};

export const scaleVertical = (size: number): number => {
  const { height, scale: pixelRatio } = getDimensions();
  const scaleFactor = height / BASE_HEIGHT;
  const scaledSize = size * scaleFactor;
  
  return Math.round(scaledSize * pixelRatio) / pixelRatio;
};


export const getFontSize = (size: number): number => {
  const { fontScale } = getDimensions();
  const scaled = scale(size);
  
  const minSize = size * 0.75;
  const maxSize = size * 1.2;
  const finalSize = scaled * fontScale;
  return Math.max(minSize, Math.min(maxSize, finalSize));
};


export const getResponsiveDimensions = () => {
  const dimensions = getDimensions();
  const isPortrait = dimensions.height > dimensions.width;
  
  return {
    width: dimensions.width,
    height: dimensions.height,
    scale,
    scaleVertical,
    getFontSize,
    isSmallScreen: dimensions.width < 375,
    isMediumScreen: dimensions.width >= 375 && dimensions.width < 414,
    isLargeScreen: dimensions.width >= 414,
    isTablet: dimensions.width >= 768,
    isPortrait,
    isLandscape: !isPortrait,
    pixelRatio: dimensions.scale,
    fontScale: dimensions.fontScale,
  };
};


export const wp = (percentage: number): number => {
  const { width } = getDimensions();
  return (width * percentage) / 100;
};


export const hp = (percentage: number): number => {
  const { height } = getDimensions();
  return (height * percentage) / 100;
};


export const platformScale = (ios: number, android: number): number => {
  const baseSize = Platform.OS === "ios" ? ios : android;
  return scale(baseSize);
};


export const getSafeAreaPadding = (insets: {
  top: number;
  bottom: number;
  left: number;
  right: number;
}) => {
  return {
    paddingTop: Math.max(insets.top || 0, scale(Platform.OS === "ios" ? 20 : 16)),
    paddingBottom: Math.max(insets.bottom || 0, scale(Platform.OS === "ios" ? 20 : 16)),
    paddingLeft: Math.max(insets.left || 0, scale(16)),
    paddingRight: Math.max(insets.right || 0, scale(16)),
  };
};


export const MIN_TOUCH_TARGET = Math.max(scale(44), 44);


export const getBorderRadius = (size: number): number => {
  return scale(size);
};


export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  xxl: scale(24),
  xxxl: scale(32),
};


export const getStatusBarHeight = (): number => {
  if (Platform.OS === "ios") {
    
    return 44;
  } else {
    
    const { StatusBar } = require("react-native");
    return StatusBar?.currentHeight || scale(24);
  }
};


const dims = getDimensions();
export const SCREEN_WIDTH = dims.width;
export const SCREEN_HEIGHT = dims.height;

