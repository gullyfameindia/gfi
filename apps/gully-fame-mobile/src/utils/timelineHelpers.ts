import type { CameraClip } from '../types/camera.types';

export function getClipEffectiveDuration(clip: CameraClip): number {
  if (clip.type === 'photo') return 3;
  
  const trimStart = clip.trimStart ?? 0;
  const trimEnd = clip.trimEnd ?? clip.duration ?? 0;
  const rawDuration = Math.max(0, trimEnd - trimStart);

  const speedConfig = clip.speedConfig || { type: 'constant', value: 1 };
  const speedValue = speedConfig.type === 'constant' ? (speedConfig.value ?? 1) : 1;

  return rawDuration / speedValue;
}

export function calculateTimelinePositions(clips: CameraClip[]): CameraClip[] {
  let currentTime = 0;
  return clips.map((clip) => {
    const effectiveDuration = getClipEffectiveDuration(clip);
    const timelineStart = currentTime;
    const timelineEnd = currentTime + effectiveDuration;
    currentTime = timelineEnd;
    return { ...clip, timelineStart, timelineEnd };
  });
}

export function getTotalTimelineDuration(clips: CameraClip[]): number {
  const positions = calculateTimelinePositions(clips);
  if (positions.length === 0) return 0;
  return positions[positions.length - 1].timelineEnd ?? 0;
}

export function getClipAtTimelineTime(
  clips: CameraClip[],
  timelineTime: number
): { clip: CameraClip; localTime: number } | null {
  const positionedClips = calculateTimelinePositions(clips);
  
  for (const clip of positionedClips) {
    const start = clip.timelineStart ?? 0;
    const end = clip.timelineEnd ?? 0;
    const isImage = clip.type === 'photo';
    const isWithinRange = isImage 
      ? (timelineTime >= start && timelineTime <= end)
      : (timelineTime >= start && timelineTime < end);
    
    if (isWithinRange) {
      if (isImage) return { clip, localTime: 0 };
      const speedConfig = clip.speedConfig || { type: 'constant', value: 1 };
      const speedValue = speedConfig.type === 'constant' ? (speedConfig.value ?? 1) : 1;
      const trimStart = clip.trimStart ?? 0;
      return { clip, localTime: trimStart + (timelineTime - start) * speedValue };
    }
  }
  
  if (positionedClips.length > 0) {
    const lastClip = positionedClips[positionedClips.length - 1];
    const lastEnd = lastClip.timelineEnd ?? 0;
    if (timelineTime >= lastEnd) {
      return { clip: lastClip, localTime: lastClip.type === 'photo' ? 0 : (lastClip.trimEnd ?? lastClip.duration) };
    }
  }
  return null;
}

export function timelineTimeToClipTime(clip: CameraClip, timelineTime: number): number {
  const start = clip.timelineStart ?? 0;
  const trimStart = clip.trimStart ?? 0;
  const speedConfig = clip.speedConfig || { type: 'constant', value: 1 };
  const speedValue = speedConfig.type === 'constant' ? (speedConfig.value ?? 1) : 1;
  return trimStart + (timelineTime - start) * speedValue;
}

export function clipTimeToTimelineTime(clip: CameraClip, clipTime: number): number {
  const start = clip.timelineStart ?? 0;
  const trimStart = clip.trimStart ?? 0;
  const speedConfig = clip.speedConfig || { type: 'constant', value: 1 };
  const speedValue = speedConfig.type === 'constant' ? (speedConfig.value ?? 1) : 1;
  return start + (clipTime - trimStart) / speedValue;
}

export function clampTrimPoints(clip: CameraClip): CameraClip {
  const duration = clip.duration ?? 0;
  const trimStart = Math.max(0, Math.min(clip.trimStart ?? 0, duration));
  const trimEnd = Math.max(trimStart, Math.min(clip.trimEnd ?? duration, duration));
  return { ...clip, trimStart, trimEnd };
}