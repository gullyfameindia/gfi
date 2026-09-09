// PATH: apps/gully-fame-mobile/src/modules/video-editor/camera-module/components/CaptureButton.tsx

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { CameraModeEnum } from '../utils/mediaTypes';

interface CaptureButtonProps {
  mode: CameraModeEnum;
  isRecording: boolean;
  progress?: number; 
  hasClips?: boolean; // Naya prop: Agar clip hai, toh progress ring show karega
  disabled?: boolean;
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

const CaptureButton: React.FC<CaptureButtonProps> = ({
  mode,
  isRecording,
  progress = 0,
  hasClips = false,
  disabled,
  onPress,
  onPressIn,
  onPressOut,
}) => {
  const outerScale = useRef(new Animated.Value(1)).current;
  const innerScale = useRef(new Animated.Value(1)).current;
  const innerBorderRadius = useRef(new Animated.Value(30)).current;

  // SVG Circle progress calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  // Make sure progress doesn't exceed 1
  const safeProgress = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = circumference - (safeProgress * circumference);

  useEffect(() => {
    if (isRecording) {
      Animated.parallel([
        Animated.spring(outerScale, { toValue: 1.25, friction: 6, useNativeDriver: false }),
        Animated.spring(innerScale, { toValue: 0.45, friction: 6, useNativeDriver: false }),
        Animated.timing(innerBorderRadius, { toValue: 12, duration: 200, useNativeDriver: false }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(outerScale, { toValue: 1, friction: 6, useNativeDriver: false }),
        Animated.spring(innerScale, { toValue: 1, friction: 6, useNativeDriver: false }),
        Animated.timing(innerBorderRadius, { toValue: 30, duration: 200, useNativeDriver: false }),
      ]).start();
    }
  }, [isRecording, outerScale, innerScale, innerBorderRadius]);

  const label = mode === CameraModeEnum.Photo ? 'Capture' : isRecording ? 'Stop' : 'Record';

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      activeOpacity={1}
      onPress={onPress}
      onPressIn={() => {
        if (!isRecording) Animated.spring(innerScale, { toValue: 0.85, useNativeDriver: false }).start();
        if (onPressIn) onPressIn();
      }}
      onPressOut={() => {
        if (!isRecording) Animated.spring(innerScale, { toValue: 1, useNativeDriver: false }).start();
        if (onPressOut) onPressOut();
      }}
      style={styles.hitSlopContainer}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.svgWrapper, { transform: [{ scale: outerScale }] }]}>
          {/* Agar record ho raha hai YA pehle se koi clip hai, toh Gradient Ring dikhao */}
          {(isRecording || hasClips) ? (
            <Svg height="90" width="90" viewBox="0 0 90 90">
              <Defs>
                <LinearGradient id="instaGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#FF007F" />
                  <Stop offset="100%" stopColor="#7F00FF" />
                </LinearGradient>
              </Defs>
              <Circle
                cx="45" cy="45" r={radius}
                stroke="url(#instaGrad)"
                strokeWidth="6"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                rotation="-90"
                origin="45, 45"
              />
            </Svg>
          ) : (
            <View style={styles.defaultOuterRing} />
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.innerCircle,
            {
              transform: [{ scale: innerScale }],
              borderRadius: innerBorderRadius,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  hitSlopContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgWrapper: {
    position: 'absolute',
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultOuterRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  innerCircle: {
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
  },
});

export default CaptureButton;