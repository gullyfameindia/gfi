export interface CameraClip {
  id: string;
  uri: string;
  type: "video" | "photo";
  duration?: number;
  trimStart: number;
  trimEnd: number;
  filterPreset?: any;
  textOverlays?: any[];
  musicOffset?: number;
  // ⚡ New Property for Speed
  speedConfig?: {
    type: "constant";
    value: number;
  };
  timelineStart?: number;
  timelineEnd?: number;
}
