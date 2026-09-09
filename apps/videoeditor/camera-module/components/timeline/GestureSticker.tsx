import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';

export interface TransformData {
  x: number;
  y: number;
  scale: number;
  rotation: number; // in radians
}

interface GestureStickerProps {
  id: string;
  type: 'image' | 'emoji';
  content: string | number;
  isActive: boolean;
  onSelect: (id: string) => void;
  // 🔥 Naye props: Drag-to-delete logic ke liye
  onDragStart?: () => void;
  onDragUpdate?: (x: number, y: number) => void;
  onDragEnd?: (id: string, x: number, y: number) => void;
  onTransformEnd?: (id: string, transform: TransformData) => void;
}

export const GestureSticker: React.FC<GestureStickerProps> = ({
  id,
  type,
  content,
  isActive,
  onSelect,
  onDragStart,
  onDragUpdate,
  onDragEnd,
  onTransformEnd,
}) => {
  // Animating Values
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const sendTransformUpdate = () => {
    if (onTransformEnd) {
      onTransformEnd(id, {
        x: savedTranslateX.value,
        y: savedTranslateY.value,
        scale: savedScale.value,
        rotation: savedRotation.value,
      });
    }
  };

  // 1. Drag (Pan) Gesture - 🔥 Ab ye screen ki exact position track karega
  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(onSelect)(id);
      if (onDragStart) runOnJS(onDragStart)();
    })
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
      
      // Absolute X, Y parent ko bhejna taaki Trash icon highlight ho sake
      if (onDragUpdate) runOnJS(onDragUpdate)(event.absoluteX, event.absoluteY);
    })
    .onEnd((event) => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      runOnJS(sendTransformUpdate)();
      
      // Jab user ungli chode, tab check karenge ki Trash icon pe drop hua ya nahi
      if (onDragEnd) runOnJS(onDragEnd)(id, event.absoluteX, event.absoluteY);
    });

  // 2. Zoom (Pinch) Gesture
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      runOnJS(onSelect)(id);
    })
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      runOnJS(sendTransformUpdate)();
    });

  // 3. Rotation Gesture
  const rotationGesture = Gesture.Rotation()
    .onUpdate((event) => {
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
      runOnJS(sendTransformUpdate)();
    });

  // Teeno gestures ko ek sath combine karna
  const composedGesture = Gesture.Simultaneous(
    panGesture,
    Gesture.Simultaneous(pinchGesture, rotationGesture)
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotation.value}rad` },
      ],
    };
  });

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
          isActive && styles.activeBorder, // Active hone par clean white border aayegi
        ]}
      >
        {/* ❌ Delete (X) button yahan se hamesha ke liye hata diya gaya hai */}
        
        <View style={styles.contentContainer}>
          {type === 'emoji' ? (
            <Text style={styles.emojiText}>{content}</Text>
          ) : (
            <Image 
              source={typeof content === 'string' ? { uri: content } : content} 
              style={styles.imageSticker} 
            />
          )}
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center', 
    top: '35%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  activeBorder: {
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)', // Professional clean white border (CapCut style)
    borderRadius: 8,
  },
  contentContainer: {
    minWidth: 50,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 60,
    color: '#fff',
  },
  imageSticker: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});