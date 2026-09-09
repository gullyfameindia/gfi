




import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  ViewStyle,
} from "react-native";

export interface SkeletonLoaderProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: "rectangular" | "circular";
  animated?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = "100%",
  height = 100,
  borderRadius = 8,
  style,
  variant = "rectangular",
  animated = true,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated, shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const containerStyle: ViewStyle = {
    width,
    height,
    borderRadius: variant === "circular" ? (height as number) / 2 : borderRadius,
  };

  return (
    <Animated.View
      style={[
        styles.skeleton,
        containerStyle,
        style,
        {
          opacity: animated ? opacity : 0.3,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#2d2420",
  },
});

export default SkeletonLoader;




export interface SkeletonGridProps {
  count?: number;
  size?: number;
  columns?: number;
  gap?: number;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  count = 6,
  size = 150,
  columns = 2,
  gap = 4,
}) => {
  const { width: screenWidth } = Dimensions.get("window");
  const itemSize = (screenWidth - gap * (columns + 1)) / columns;

  return (
    <View style={{ flex: 1, paddingHorizontal: gap }}>
      {Array.from({ length: count }).map((_, idx) => (
        <View
          key={idx}
          style={{
            marginBottom: gap,
            marginRight: idx % columns !== columns - 1 ? gap : 0,
            width: itemSize,
            height: itemSize,
          }}
        >
          <SkeletonLoader
            width={itemSize}
            height={itemSize}
            borderRadius={8}
            animated={true}
          />
        </View>
      ))}
    </View>
  );
};




export const SkeletonVideoStats: React.FC = () => {
  return (
    <View style={styles.statsContainer}>
      <SkeletonLoader width={80} height={16} borderRadius={4} />
      <SkeletonLoader width={60} height={16} borderRadius={4} />
      <SkeletonLoader width={70} height={16} borderRadius={4} />
    </View>
  );
};




const extendedStyles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
  },
});

Object.assign(styles, extendedStyles);
