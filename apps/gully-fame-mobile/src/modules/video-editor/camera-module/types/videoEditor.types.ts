



export interface SpeedSegment {
  id: string;
  startTime: number; 
  endTime: number; 
  speed: number; 
}

export interface VideoSegment {
  id: string;
  startTime: number;
  endTime: number;
  speed: number;
  thumbnailUri?: string; 
}




export function createVideoSegmentsFromClip(
  duration: number,
  segments: SpeedSegment[]
): VideoSegment[] {
  if (segments.length === 0) {
    
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




export function getSegmentAtTime(
  segments: SpeedSegment[],
  time: number
): SpeedSegment | null {
  return segments.find(seg => time >= seg.startTime && time < seg.endTime) || null;
}

