import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  runOnJS, 
  withSpring,
  withTiming
} from 'react-native-reanimated';
import type { CameraClip } from '../../types/camera.types';

interface TimelineClipProps {
  clip: CameraClip;
  width: number;
  thumbnailUri?: string; 
  isSelected: boolean;
  pixelsPerSecond: number;
  onPress?: (clip: CameraClip) => void;
  onTrimStart?: (clip: CameraClip, newStart: number) => void;
  onTrimEnd?: (clip: CameraClip, newEnd: number) => void;
  onDragStart?: (clip: CameraClip) => void; 
  onDrag?: (clip: CameraClip, pageX: number) => void; 
  onDragEnd?: (clip: CameraClip) => void; 
}

const HANDLE_WIDTH = 16;

const TimelineClip: React.FC<TimelineClipProps> = ({
  clip,
  width,
  thumbnailUri,
  isSelected,
  pixelsPerSecond,
  onPress,
  onTrimStart,
  onTrimEnd,
  onDragStart,
  onDrag,
  onDragEnd
}) => {
  
  const speedConfig = clip.speedConfig || { type: 'constant', value: 1 };
  const speedValue = speedConfig.type === 'constant' ? (speedConfig.value ?? 1) : 1;

  
  const leftTrimOffset = useSharedValue(0);
  const rightTrimOffset = useSharedValue(0);
  const isDraggingState = useSharedValue(false);

  

  
  const tapGesture = Gesture.Tap().onEnd(() => {
    if (onPress) runOnJS(onPress)(clip);
  });

  
  const longPressDragGesture = Gesture.Pan()
    .activateAfterLongPress(250) 
    .onStart(() => {
      isDraggingState.value = true;
      if (onDragStart) runOnJS(onDragStart)(clip);
    })
    .onUpdate((e) => {
      if (onDrag) runOnJS(onDrag)(clip, e.absoluteX);
    })
    .onEnd(() => {
      isDraggingState.value = false;
      if (onDragEnd) runOnJS(onDragEnd)(clip);
    });

  
  const clipGestures = Gesture.Simultaneous(tapGesture, longPressDragGesture);

  
  const leftTrimDrag = Gesture.Pan()
    .onUpdate((e) => {
      
      leftTrimOffset.value = Math.max(0, Math.min(e.translationX, width - HANDLE_WIDTH * 2));
    })
    .onEnd((e) => {
      const translation = leftTrimOffset.value;
      leftTrimOffset.value = withTiming(0, { duration: 100 }); 

      if (!onTrimStart) return;
      const timeDelta = (translation / pixelsPerSecond) * speedValue;
      const currentStart = clip.trimStart ?? 0;
      const newStart = Math.max(0, currentStart + timeDelta);
      
      const limitEnd = clip.trimEnd ?? clip.duration;
      if (newStart < limitEnd) {
        runOnJS(onTrimStart)(clip, newStart);
      }
    });

  
  const rightTrimDrag = Gesture.Pan()
    .onUpdate((e) => {
      
      rightTrimOffset.value = Math.min(0, Math.max(e.translationX, -(width - HANDLE_WIDTH * 2)));
    })
    .onEnd((e) => {
      const translation = rightTrimOffset.value;
      rightTrimOffset.value = withTiming(0, { duration: 100 });

      if (!onTrimEnd) return;
      const timeDelta = (translation / pixelsPerSecond) * speedValue;
      const currentEnd = clip.trimEnd ?? clip.duration;
      const newEnd = Math.min(clip.duration, currentEnd + timeDelta);
      
      const limitStart = clip.trimStart ?? 0;
      if (newEnd > limitStart) {
        runOnJS(onTrimEnd)(clip, newEnd);
      }
    });

  

  
  const animatedClipStyle = useAnimatedStyle(() => {
    return {
      marginLeft: leftTrimOffset.value,
      marginRight: -rightTrimOffset.value,
      width: width - leftTrimOffset.value + rightTrimOffset.value,
      transform: [
        { scale: withSpring(isDraggingState.value ? 1.05 : 1) } 
      ],
      opacity: isDraggingState.value ? 0.8 : 1,
      zIndex: isDraggingState.value ? 100 : 1,
    };
  });

  return (
    <GestureDetector gesture={clipGestures}>
      <Animated.View style={[styles.clipContainer, animatedClipStyle]}>
        
        {}
        {thumbnailUri ? (
          <Image 
            source={{ uri: thumbnailUri }} 
            style={styles.thumbnail} 
            resizeMode="cover"
          />
        ) : (
          <View style={styles.fallbackBackground}>
            <Text style={styles.clipText} numberOfLines={1}>
              {clip.type === 'video' ? `Vid (${speedValue}x)` : 'Photo'}
            </Text>
          </View>
        )}

        {}
        {isSelected && <View style={styles.selectedOverlay} />}

        {}
        {isSelected && clip.type === 'video' && (
          <GestureDetector gesture={leftTrimDrag}>
            <View style={styles.leftHandle}>
               {}
               <View style={styles.gripLine} />
            </View>
          </GestureDetector>
        )}

        {}
        {isSelected && clip.type === 'video' && (
          <GestureDetector gesture={rightTrimDrag}>
            <View style={styles.rightHandle}>
               <View style={styles.gripLine} />
            </View>
          </GestureDetector>
        )}
        
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  clipContainer: {
    height: 50,
    backgroundColor: '#222',
    borderRadius: 6,
    marginHorizontal: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  fallbackBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clipText: {
    color: '#aaa',
    fontSize: 10,
    fontWeight: '600',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderColor: '#ffffff', 
    borderTopWidth: 2,
    borderBottomWidth: 2,
    pointerEvents: 'none', 
  },
  leftHandle: {
    position: 'absolute',
    left: 0,
    width: HANDLE_WIDTH,
    height: '100%',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    zIndex: 10,
  },
  rightHandle: {
    position: 'absolute',
    right: 0,
    width: HANDLE_WIDTH,
    height: '100%',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    zIndex: 10,
  },
  gripLine: {
    width: 2,
    height: 16,
    backgroundColor: '#000000',
    borderRadius: 2,
  }
});

export default TimelineClip;