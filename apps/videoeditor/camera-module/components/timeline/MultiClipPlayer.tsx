import { Video, ResizeMode } from 'expo-video';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { CameraClip } from '../../types/camera.types';
import { getClipAtTimelineTime } from '../../utils/timelineHelpers';
import FilteredImage from '../FilteredImage';
import FilteredVideo from '../FilteredVideo';

interface MultiClipPlayerProps {
  clips: CameraClip[];
  currentTime: number; 
  isPlaying: boolean;
  onTimeUpdate?: (time: number) => void;
  onLoad?: () => void;
  onEnd?: () => void;
  filter?: import('../../types/filters').FilterConfig;
  isDraggingTimeline?: boolean; 
}




const MultiClipPlayer: React.FC<MultiClipPlayerProps> = ({
  clips,
  currentTime,
  isPlaying,
  onTimeUpdate,
  onLoad,
  onEnd,
  filter,
  isDraggingTimeline = false,
}) => {
  console.log('🎬 MultiClipPlayer: Rendering with', clips?.length ?? 0, 'clips, currentTime:', currentTime);
  
  const videoRefs = useRef<Map<string, React.RefObject<Video>>>(new Map());
  const [currentClipId, setCurrentClipId] = useState<string | null>(null);
  const [currentClipLocalTime, setCurrentClipLocalTime] = useState(0);
  const isSeekingRef = useRef(false);
  const playbackStatusIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastUpdateTimeRef = useRef(0);
  const isDraggingTimelineRef = useRef(false);
  
  
  React.useEffect(() => {
    isDraggingTimelineRef.current = isDraggingTimeline;
  }, [isDraggingTimeline]);

  
  const currentClipData = React.useMemo(() => {
    const data = getClipAtTimelineTime(clips, currentTime);
    if (!data) return null;

    const { clip, localTime } = data;
    
    const speedConfig = clip.speedConfig || { type: 'constant', value: 1 };
    const speedValue = speedConfig.type === 'constant' ? (speedConfig.value ?? 1) : 1;

    
    const trimStart = clip.trimStart ?? 0;
    const timelineDelta = localTime - trimStart;
    const adjustedLocalTime = trimStart + (timelineDelta * speedValue);

    return {
      clip,
      localTime: adjustedLocalTime,
      speedValue,
    };
  }, [clips, currentTime]);

  
  const currentSpeed = currentClipData?.speedValue ?? 1;

  
  useEffect(() => {
    if (currentClipData) {
      const { clip, localTime } = currentClipData;
      
      if (currentClipId !== clip.id) {
        
        setCurrentClipId(clip.id);
        setCurrentClipLocalTime(localTime);
        
        
        videoRefs.current.forEach((ref, id) => {
          if (id !== clip.id && ref?.current) {
            ref.current.pauseAsync().catch(console.warn);
          }
        });
      } else {
        
        setCurrentClipLocalTime(localTime);
      }
    } else {
      setCurrentClipId(null);
    }
  }, [currentClipData, currentClipId]);

  
  useEffect(() => {
    if (isSeekingRef.current || !currentClipData) return;
    
    const { clip, localTime } = currentClipData;
    const videoRef = videoRefs.current.get(clip.id);
    
    if (videoRef?.current && clip.type === 'video') {
      
      if (isDraggingTimeline) {
        return;
      }
      
      isSeekingRef.current = true;
      videoRef.current.setPositionAsync(localTime * 1000).then(() => {
        isSeekingRef.current = false;
      }).catch(() => {
        isSeekingRef.current = false;
      });
    }
  }, [currentTime, currentClipData, isDraggingTimeline]);

  
  useEffect(() => {
    if (!currentClipData) return;
    
    const { clip } = currentClipData;
    
    
    if (clip.type === 'photo' && isPlaying) {
      const imageDisplayTime = 3000; 
      const timeout = setTimeout(() => {
        const currentIndex = clips.findIndex((c) => c.id === clip.id);
        if (currentIndex < clips.length - 1) {
          const nextClip = clips[currentIndex + 1];
          const nextClipStart = nextClip.timelineStart ?? 0;
          onTimeUpdate?.(nextClipStart);
        } else {
          
          onEnd?.();
        }
      }, imageDisplayTime);
      return () => clearTimeout(timeout);
    }
    
    const videoRef = videoRefs.current.get(clip.id);
    
    if (videoRef?.current && clip.type === 'video') {
      if (isPlaying) {
        
        videoRef.current.setRateAsync(currentSpeed, true).catch(console.warn);
        videoRef.current.playAsync().catch(console.warn);
      } else {
        videoRef.current.pauseAsync().catch(console.warn);
      }
    }
  }, [isPlaying, currentClipData, clips, onTimeUpdate, onEnd, currentSpeed]);

  
  useEffect(() => {
    if (!isPlaying || !currentClipData) {
      if (playbackStatusIntervalRef.current) {
        clearInterval(playbackStatusIntervalRef.current);
        playbackStatusIntervalRef.current = null;
      }
      return;
    }

    
    playbackStatusIntervalRef.current = setInterval(() => {
      if (!currentClipData || isDraggingTimelineRef.current) return;
      
      const { clip, localTime: clipLocalTime } = currentClipData;
      const videoRef = videoRefs.current.get(clip.id);
      
      if (videoRef?.current) {
        videoRef.current.getStatusAsync().then((status: any) => {
          if (status.isLoaded && status.positionMillis !== undefined) {
            const localTime = status.positionMillis / 1000;
            setCurrentClipLocalTime(localTime);
            
            
            const now = Date.now();
            if (now - lastUpdateTimeRef.current < 100) return; 
            lastUpdateTimeRef.current = now;
            
            
            const timelineStart = clip.timelineStart ?? 0;
            const trimStart = clip.trimStart ?? 0;
            const timelineTime = timelineStart + (localTime - trimStart) / currentSpeed;
            
            
            onTimeUpdate?.(Math.max(0, timelineTime));
            
            
            if (status.didJustFinish || (localTime >= (clip.trimEnd ?? clip.duration))) {
              
              const currentIndex = clips.findIndex((c) => c.id === clip.id);
              if (currentIndex < clips.length - 1) {
                
                const nextClip = clips[currentIndex + 1];
                const nextClipStart = nextClip.timelineStart ?? 0;
                onTimeUpdate?.(nextClipStart);
              } else {
                
                onEnd?.();
              }
            }
          }
        }).catch(console.warn);
      }
    }, 100); 

    return () => {
      if (playbackStatusIntervalRef.current) {
        clearInterval(playbackStatusIntervalRef.current);
        playbackStatusIntervalRef.current = null;
      }
    };
  }, [isPlaying, currentClipData, clips, onTimeUpdate, onEnd, currentSpeed]);

  
  const handleVideoLoad = useCallback((clipId: string, status: any) => {
    if (status.isLoaded && clipId === currentClipId) {
      
      const localTime = currentClipLocalTime;
      const videoRef = videoRefs.current.get(clipId);
      if (videoRef?.current) {
        videoRef.current.setPositionAsync(localTime * 1000).catch(console.warn);
        videoRef.current.setRateAsync(currentSpeed, true).catch(console.warn);
        
        if (isPlaying) {
          videoRef.current.playAsync().catch(console.warn);
        }
      }
      
      onLoad?.();
    }
  }, [currentClipId, currentClipLocalTime, isPlaying, onLoad, currentSpeed]);

  
  if (!currentClipData) {
    console.warn('🎬 MultiClipPlayer: currentClipData is null - clips.length:', clips?.length ?? 0, 'currentTime:', currentTime);
    return <View style={[styles.container, { width: '100%' }]} />;
  }

  const { clip } = currentClipData;
  console.log('🎬 MultiClipPlayer: Rendering clip - id:', clip.id, 'uri:', clip.uri?.substring(0, 50), 'type:', clip.type, 'localTime:', currentClipData.localTime);

  
  const videoRef = useMemo(() => {
    if (clip.type === 'video') {
      let ref = videoRefs.current.get(clip.id);
      if (!ref) {
        ref = React.createRef<Video>() as React.RefObject<Video>;
        videoRefs.current.set(clip.id, ref);
      }
      return ref as React.RefObject<Video>;
    }
    return null;
  }, [clip.id, clip.type]);

  if (clip.type === 'video') {
    return (
      <View style={[styles.container, { width: '100%' }]}>
        <FilteredVideo
          videoRef={videoRef as React.RefObject<Video | null>}
          source={{ uri: clip.uri }}
          style={[styles.media, { width: '100%', height: '100%' }]}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          isLooping={false}
          rate={currentSpeed}
          shouldCorrectPitch={true}
          onLoad={(status) => handleVideoLoad(clip.id, status)}
          filter={filter}
        />
      </View>
    );
  } else {
    return (
      <View style={[styles.container, { width: '100%' }]}>
        <FilteredImage
          source={{ uri: clip.uri }}
          style={styles.media}
          resizeMode="contain"
          filter={filter}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  media: {
    width: '100%',
    height: '100%',
  },
});


export default memo(MultiClipPlayer);