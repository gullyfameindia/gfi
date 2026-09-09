/**
 * Video editing types for segment-based speed editing
 */

export interface SpeedSegment {
  id: string;
  startTime: number; // Start time in seconds
  endTime: number; // End time in seconds
  speed: number; // Speed multiplier (0.3, 0.5, 1, 2, 3, 4)
}

export interface VideoSegment {
  id: string;
  startTime: number;
  endTime: number;
  speed: number;
  thumbnailUri?: string; // Optional thumbnail for this segment
}

/**
 * Converts a clip with speed segments to individual video segments
 */
export function createVideoSegmentsFromClip(
  duration: number,
  segments: SpeedSegment[]
): VideoSegment[] {
  if (segments.length === 0) {
    // Default: single segment at 1x
    return [
      {
        id: 'segment-0',
        startTime: 0,
        endTime: duration,
        speed: 1,
      },
    ];
  }

  return segments.map((seg, index) => ({
    id: seg.id || `segment-${index}`,
    startTime: seg.startTime,
    endTime: seg.endTime,
    speed: seg.speed,
  }));
}

/**
 * Gets the speed segment at a specific time
 */
export function getSegmentAtTime(
  segments: SpeedSegment[],
  time: number
): SpeedSegment | null {
  return segments.find(seg => time >= seg.startTime && time < seg.endTime) || null;
}

