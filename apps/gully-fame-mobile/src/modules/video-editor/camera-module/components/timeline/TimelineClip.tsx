import React, { memo, useRef } from 'react';
import {
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { CameraClip } from '../../types/camera.types';
import { getClipEffectiveDuration } from '../../utils/timelineHelpers';

interface TimelineClipProps {
  clip: CameraClip;
  width: number; // Width in pixels for this clip on timeline
  thumbnailUri?: string;
  isSelected?: boolean;
  onPress?: (clip: CameraClip) => void;
  onTrimStart?: (clip: CameraClip, newTrimStart: number) => void;
  onTrimEnd?: (clip: CameraClip, newTrimEnd: number) => void;
  onDragStart?: (clip: CameraClip) => void;
  onDrag?: (clip: CameraClip, deltaX: number) => void;
  onDragEnd?: (clip: CameraClip) => void;
  pixelsPerSecond: number; // Conversion factor
}

const TRIM_HANDLE_WIDTH = 12;
const MIN_CLIP_WIDTH = 40; // Minimum width for a clip to be visible

/**
 * Individual clip item in the timeline with thumbnail, trim handles, and drag support
 */
const TimelineClip: React.FC<TimelineClipProps> = ({
  clip,
  width,
  thumbnailUri,
  isSelected = false,
  onPress,
  onTrimStart,
  onTrimEnd,
  onDragStart,
  onDrag,
  onDragEnd,
  pixelsPerSecond,
}) => {
  const trimStartHandleRef = useRef<View>(null);
  const trimEndHandleRef = useRef<View>(null);
  const clipBodyRef = useRef<View>(null);
  const isDraggingTrim = useRef<'start' | 'end' | null>(null);
  const dragStartX = useRef(0);
  const initialTrimValue = useRef(0);

  const effectiveDuration = getClipEffectiveDuration(clip);
  const trimStart = clip.trimStart ?? 0;
  const trimEnd = clip.trimEnd ?? clip.duration;

  // Pan responder for trim handles
  const createTrimPanResponder = (side: 'start' | 'end') => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        isDraggingTrim.current = side;
        dragStartX.current = evt.nativeEvent.pageX;
        initialTrimValue.current = side === 'start' ? trimStart : trimEnd;
        onDragStart?.(clip);
      },
      onPanResponderMove: (evt) => {
        if (isDraggingTrim.current !== side) return;

        const deltaX = evt.nativeEvent.pageX - dragStartX.current;
        const deltaTime = deltaX / pixelsPerSecond;

        if (side === 'start') {
          const newTrimStart = Math.max(0, Math.min(initialTrimValue.current + deltaTime, trimEnd - 0.1));
          onTrimStart?.(clip, newTrimStart);
        } else {
          const newTrimEnd = Math.min(clip.duration, Math.max(initialTrimValue.current + deltaTime, trimStart + 0.1));
          onTrimEnd?.(clip, newTrimEnd);
        }
      },
      onPanResponderRelease: () => {
        isDraggingTrim.current = null;
        onDragEnd?.(clip);
      },
    });
  };

  const startTrimPanResponder = createTrimPanResponder('start');
  const endTrimPanResponder = createTrimPanResponder('end');

  // Pan responder for clip body (drag to reorder)
  const clipDragPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onDragStart?.(clip);
      },
      onPanResponderMove: (evt) => {
        if (isDraggingTrim.current) return; // Don't drag if trimming
        onDrag?.(clip, evt.nativeEvent.pageX);
      },
      onPanResponderRelease: () => {
        if (!isDraggingTrim.current) {
          onDragEnd?.(clip);
        }
      },
    })
  ).current;

  if (width < MIN_CLIP_WIDTH) {
    // Clip too small to show, render minimal indicator
    return (
      <View style={[styles.container, { width }, styles.minimalClip]}>
        <View style={styles.minimalIndicator} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { width }, isSelected && styles.selected]}>
      {/* Trim Start Handle */}
      <View
        ref={trimStartHandleRef}
        style={[styles.trimHandle, styles.trimHandleStart]}
        {...startTrimPanResponder.panHandlers}
      >
        <View style={styles.trimHandleBar} />
      </View>

      {/* Clip Body */}
      <TouchableOpacity
        ref={clipBodyRef}
        style={styles.clipBody}
        onPress={() => onPress?.(clip)}
        activeOpacity={0.8}
        {...clipDragPanResponder.panHandlers}
      >
        {thumbnailUri ? (
          <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} resizeMode="cover" />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Text style={styles.placeholderText}>
              {clip.type === 'video' ? '🎥' : '📷'}
            </Text>
          </View>
        )}
        
        {/* Clip Info Overlay */}
        <View style={styles.infoOverlay}>
          <Text style={styles.durationText}>
            {formatTime(effectiveDuration)}
          </Text>
          {clip.type === 'video' && (
            <View style={styles.videoIndicator}>
              <Text style={styles.videoIndicatorText}>VID</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Trim End Handle */}
      <View
        ref={trimEndHandleRef}
        style={[styles.trimHandle, styles.trimHandleEnd]}
        {...endTrimPanResponder.panHandlers}
      >
        <View style={styles.trimHandleBar} />
      </View>
    </View>
  );
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    flexDirection: 'row',
    marginRight: 1,
    position: 'relative',
  },
  selected: {
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 3,
  },
  minimalClip: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  minimalIndicator: {
    width: 4,
    height: 40,
    backgroundColor: '#ec9a15',
    borderRadius: 2,
  },
  trimHandle: {
    width: TRIM_HANDLE_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  trimHandleStart: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  trimHandleEnd: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  trimHandleBar: {
    width: 3,
    height: '60%',
    backgroundColor: '#ffffff',
    borderRadius: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  clipBody: {
    flex: 1,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  placeholderText: {
    fontSize: 24,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 3,
    paddingVertical: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '600',
  },
  videoIndicator: {
    backgroundColor: '#ec9a15',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 2,
  },
  videoIndicatorText: {
    color: '#000000',
    fontSize: 7,
    fontWeight: '700',
  },
});

// Memoize to prevent unnecessary re-renders
export default memo(TimelineClip);

