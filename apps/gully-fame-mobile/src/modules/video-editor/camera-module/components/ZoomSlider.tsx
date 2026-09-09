import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface ZoomSliderProps {
  zoom: number; // Current zoom level (1-4)
  onZoomChange: (zoom: number) => void; // Callback for real-time zoom updates
  minZoom?: number;
  maxZoom?: number;
  disabled?: boolean;
}

const SLIDER_WIDTH = 200;
const HANDLE_SIZE = 32;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const AVAILABLE_WIDTH = SLIDER_WIDTH - HANDLE_SIZE;

/**
 * Horizontal zoom slider positioned just before the capture button.
 * - 1x is on the RIGHT (rightmost position)
 * - 4x is on the LEFT (leftmost position)
 * - Drag LEFT → Zoom IN (1x → 2x → 3x → 4x)
 * - Drag RIGHT → Zoom OUT (4x → 3x → 2x → 1x)
 * - Smooth, continuous zoom with real-time preview
 */
const ZoomSlider: React.FC<ZoomSliderProps> = ({
  zoom,
  onZoomChange,
  minZoom = MIN_ZOOM,
  maxZoom = MAX_ZOOM,
  disabled = false,
}) => {
  const ZOOM_RANGE = maxZoom - minZoom;

  // Convert zoom level to slider position
  // zoom = 1x → position = AVAILABLE_WIDTH (rightmost)
  // zoom = 4x → position = 0 (leftmost)
  // Formula: position = ((maxZoom - zoom) / ZOOM_RANGE) * AVAILABLE_WIDTH
  const zoomToPosition = (z: number): number => {
    return ((maxZoom - z) / ZOOM_RANGE) * AVAILABLE_WIDTH;
  };

  // Convert slider position to zoom level
  // position = AVAILABLE_WIDTH → zoom = 1x
  // position = 0 → zoom = 4x
  // Formula: zoom = maxZoom - (position / AVAILABLE_WIDTH) * ZOOM_RANGE
  const positionToZoom = (pos: number): number => {
    const clampedPos = Math.max(0, Math.min(AVAILABLE_WIDTH, pos));
    return maxZoom - (clampedPos / AVAILABLE_WIDTH) * ZOOM_RANGE;
  };

  // Shared values for animation
  const translateX = useSharedValue(zoomToPosition(zoom));
  const startX = useSharedValue(0);
  const isDragging = useSharedValue(false);

  // Update position when zoom prop changes externally
  // Note: This will only update if user isn't actively dragging (gesture handler manages position during drag)
  useEffect(() => {
    translateX.value = withSpring(zoomToPosition(zoom), {
      damping: 20,
      stiffness: 300,
    });
  }, [zoom]);

  // Pan gesture handler - memoized to prevent recreation on every render
  const panGesture = React.useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled)
        .onStart(() => {
          isDragging.value = true;
          startX.value = translateX.value;
        })
        .onUpdate((event) => {
          // Calculate new handle position based on drag
          // Drag LEFT (negative translationX) → move handle left → zoom IN
          // Drag RIGHT (positive translationX) → move handle right → zoom OUT
          let newX = startX.value + event.translationX;

          // Clamp handle position within slider bounds
          newX = Math.max(0, Math.min(AVAILABLE_WIDTH, newX));

          // Update handle position
          translateX.value = newX;

          // Calculate zoom from position
          const newZoom = maxZoom - (newX / AVAILABLE_WIDTH) * ZOOM_RANGE;

          // Clamp zoom strictly between minZoom and maxZoom
          const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));

          // Update zoom in real-time for smooth preview
          runOnJS(onZoomChange)(clampedZoom);
        })
        .onEnd(() => {
          isDragging.value = false;

          // Snap to nearest zoom level on release (1x, 2x, 3x, or 4x)
          const currentPos = translateX.value;
          const currentZoom = maxZoom - (currentPos / AVAILABLE_WIDTH) * ZOOM_RANGE;
          const snappedZoom = Math.round(currentZoom);
          const clampedSnappedZoom = Math.max(minZoom, Math.min(maxZoom, snappedZoom));

          // Calculate snapped position
          const snappedPos = ((maxZoom - clampedSnappedZoom) / ZOOM_RANGE) * AVAILABLE_WIDTH;

          // Animate handle to snapped position
          translateX.value = withSpring(snappedPos, {
            damping: 20,
            stiffness: 300,
          });

          // Update zoom to snapped value
          runOnJS(onZoomChange)(clampedSnappedZoom);
        }),
    [disabled, onZoomChange, minZoom, maxZoom, ZOOM_RANGE]
  );

  // Animated handle style
  const handleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Calculate dot positions for visual markers at each zoom level
  const getDotPosition = (level: number) => {
    return HANDLE_SIZE / 2 + zoomToPosition(level);
  };

  return (
    <View style={styles.container}>
      {/* Zoom level labels above the slider */}
      <View style={styles.labelsContainer}>
        <Text style={[styles.label, zoom === 4 && styles.labelActive]}>4x</Text>
        <Text style={[styles.label, zoom === 3 && styles.labelActive]}>3x</Text>
        <Text style={[styles.label, zoom === 2 && styles.labelActive]}>2x</Text>
        <Text style={[styles.label, zoom === 1 && styles.labelActive]}>1x</Text>
      </View>

      {/* Slider track */}
      <View style={styles.trackContainer}>
        {/* Track line */}
        <View style={styles.trackLine} />

        {/* Static dots at zoom levels (4x, 3x, 2x, 1x) */}
        <View style={[styles.dot, { left: getDotPosition(4) }]} />
        <View style={[styles.dot, { left: getDotPosition(3) }]} />
        <View style={[styles.dot, { left: getDotPosition(2) }]} />
        <View style={[styles.dot, { left: getDotPosition(1) }]} />

        {/* Draggable handle */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.handle, handleStyle]}>
            <View style={styles.handleInner} />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SLIDER_WIDTH,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SLIDER_WIDTH,
    marginBottom: 8,
    paddingHorizontal: HANDLE_SIZE / 2,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    minWidth: 24,
  },
  labelActive: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  trackContainer: {
    position: 'relative',
    width: SLIDER_WIDTH,
    height: HANDLE_SIZE,
    justifyContent: 'center',
  },
  trackLine: {
    position: 'absolute',
    top: HANDLE_SIZE / 2 - 1,
    left: HANDLE_SIZE / 2,
    width: AVAILABLE_WIDTH,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
  dot: {
    position: 'absolute',
    top: HANDLE_SIZE / 2 - 3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  handle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#ec9a15',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
});

export default ZoomSlider;

