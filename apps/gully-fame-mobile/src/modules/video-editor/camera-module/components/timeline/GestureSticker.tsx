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
  rotation: number; 
}

interface GestureStickerProps {
  id: string;
  type: 'image' | 'emoji';
  content: string | number;
  isActive: boolean;
  onSelect: (id: string) => void;
  
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

  
  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(onSelect)(id);
      if (onDragStart) runOnJS(onDragStart)();
    })
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
      
      
      if (onDragUpdate) runOnJS(onDragUpdate)(event.absoluteX, event.absoluteY);
    })
    .onEnd((event) => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      runOnJS(sendTransformUpdate)();
      
      
      if (onDragEnd) runOnJS(onDragEnd)(id, event.absoluteX, event.absoluteY);
    });

  
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

  
  const rotationGesture = Gesture.Rotation()
    .onUpdate((event) => {
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
      runOnJS(sendTransformUpdate)();
    });

  
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
          isActive && styles.activeBorder, 
        ]}
      >
        {}
        
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
    borderColor: 'rgba(255, 255, 255, 0.8)', 
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