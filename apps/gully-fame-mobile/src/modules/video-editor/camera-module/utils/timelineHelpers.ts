import type { CameraClip } from "../types/camera.types";

/**
 * Calculate the effective duration of a clip after trimming and applying playback speed scale
 * Images get a minimum duration of 3 seconds for timeline purposes
 */
export function getClipEffectiveDuration(clip: CameraClip): number {
  if (clip.type === "photo") {
    // Images get a minimum duration of 3 seconds for timeline display
    return 3;
  }
  const trimStart = clip.trimStart ?? 0;
  const trimEnd = clip.trimEnd ?? clip.duration;
  const rawDuration = Math.max(0, trimEnd - trimStart);

  // ⚡ Velocity Scale Factor injection
  // @ts-ignore
  const speedConfig = clip.speedConfig || { type: "constant", value: 1 };
  const speedValue = speedConfig.type === "constant" ? (speedConfig.value ?? 1) : 1;

  // Duration scales inversely with speed (2x speed means half timeline width)
  return rawDuration / speedValue;
}

/**
 * Calculate timeline positions for all clips
 * Returns clips with updated timelineStart and timelineEnd
 */
export function calculateTimelinePositions(clips: CameraClip[]): CameraClip[] {
  let currentTime = 0;

  return clips.map((clip) => {
    const effectiveDuration = getClipEffectiveDuration(clip);
    const timelineStart = currentTime;
    const timelineEnd = currentTime + effectiveDuration;

    currentTime = timelineEnd;

    return {
      ...clip,
      timelineStart,
      timelineEnd,
    };
  });
}

/**
 * Get total duration of the composed timeline
 */
export function getTotalTimelineDuration(clips: CameraClip[]): number {
  const positions = calculateTimelinePositions(clips);
  if (positions.length === 0) return 0;
  return positions[positions.length - 1].timelineEnd ?? 0;
}

/**
 * Find which clip contains a given timeline time
 */
export function getClipAtTimelineTime(
  clips: CameraClip[],
  timelineTime: number
): { clip: CameraClip; localTime: number } | null {
  const positionedClips = calculateTimelinePositions(clips);

  for (const clip of positionedClips) {
    const start = clip.timelineStart ?? 0;
    const end = clip.timelineEnd ?? 0;

    // For images (duration 0), include the end boundary
    // For videos, use exclusive end boundary
    const isImage = clip.type === "photo";
    const isWithinRange = isImage
      ? timelineTime >= start && timelineTime <= end
      : timelineTime >= start && timelineTime < end;

    if (isWithinRange) {
      // For images, localTime is always 0 (no playback)
      // For videos, calculate local time within the clip factorized by speed scalar matrix
      if (isImage) {
        return { clip, localTime: 0 };
      }

      // @ts-ignore
      const speedConfig = clip.speedConfig || { type: "constant", value: 1 };
      const speedValue = speedConfig.type === "constant" ? (speedConfig.value ?? 1) : 1;

      const trimStart = clip.trimStart ?? 0;
      const localTime = trimStart + (timelineTime - start) * speedValue;
      return { clip, localTime };
    }
  }

  // If no clip found and we have clips, return the last clip (for edge case at timeline end)
  if (positionedClips.length > 0) {
    const lastClip = positionedClips[positionedClips.length - 1];
    const lastEnd = lastClip.timelineEnd ?? 0;
    if (timelineTime >= lastEnd) {
      if (lastClip.type === "photo") {
        return { clip: lastClip, localTime: 0 };
      }

      // @ts-ignore
      const speedConfig = lastClip.speedConfig || { type: "constant", value: 1 };
      const speedValue = speedConfig.type === "constant" ? (speedConfig.value ?? 1) : 1;

      return {
        clip: lastClip,
        localTime: lastClip.trimEnd ?? lastClip.duration,
      };
    }
  }

  return null;
}

/**
 * Convert timeline time to clip-local time
 */
export function timelineTimeToClipTime(clip: CameraClip, timelineTime: number): number {
  const start = clip.timelineStart ?? 0;
  const trimStart = clip.trimStart ?? 0;

  // @ts-ignore
  const speedConfig = clip.speedConfig || { type: "constant", value: 1 };
  const speedValue = speedConfig.type === "constant" ? (speedConfig.value ?? 1) : 1;

  return trimStart + (timelineTime - start) * speedValue;
}

/**
 * Convert clip-local time to timeline time
 */
export function clipTimeToTimelineTime(clip: CameraClip, clipTime: number): number {
  const start = clip.timelineStart ?? 0;
  const trimStart = clip.trimStart ?? 0;

  // @ts-ignore
  const speedConfig = clip.speedConfig || { type: "constant", value: 1 };
  const speedValue = speedConfig.type === "constant" ? (speedConfig.value ?? 1) : 1;

  return start + (clipTime - trimStart) / speedValue;
}

/**
 * Validate and clamp trim points
 */
export function clampTrimPoints(clip: CameraClip): CameraClip {
  const trimStart = Math.max(0, Math.min(clip.trimStart ?? 0, clip.duration));
  const trimEnd = Math.max(trimStart, Math.min(clip.trimEnd ?? clip.duration, clip.duration));

  return {
    ...clip,
    trimStart,
    trimEnd,
  };
}
