export type CameraModuleScreenName = "Home" | "Camera" | "Preview";


export type CameraMode = "photo" | "video";
export type FlashMode = "on" | "off";
export type Resolution = "HD" | "4K";
export type FrameRate = 24 | 30 | 60;
export type ColorMode = "SDR" | "HDR";


export type PermissionStatus = "undetermined" | "denied" | "granted";


export type ClipType = "photo" | "video";
export type ClipSource = "camera" | "gallery";







export interface SpeedSegment {
  startTime: number;
  endTime: number;
  speed: number;
}















export interface VideoOverlay {
  id: string;
  type: 'text' | 'image' | 'emoji';
  content: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
}





















export interface CameraClip {
  id: string;
  uri: string;
  duration: number;
  type: ClipType;
  source: ClipSource;
  speed?: number; 
  speedSegments?: SpeedSegment[]; 
  filterPreset?: import("./filters").FilterPreset; 
  trimStart?: number; 
  trimEnd?: number; 
  timelineStart?: number; 
  timelineEnd?: number; 
  thumbnailUri?: string; 
  textOverlays?: import("./textOverlay.types").TextOverlay[]; 
  overlays?: VideoOverlay[]; 
  audioTracks?: import("./music.types").AudioTrack[]; 
  audioTracksEnhanced?: import("./audioEffects.types").AudioTrackWithEffects[]; 
  transitions?: import("./transitions.types").ClipTransition[]; 
  
  resolution?: import("./camera.types").Resolution; 
  frameRate?: import("./camera.types").FrameRate; 
  colorMode?: import("./camera.types").ColorMode; 
  
  voiceOverlays?: import("./voiceOverlay.types").VoiceOverlay[]; 
  voiceOverlaysEnhanced?: import("./audioEffects.types").VoiceOverlayWithEffects[]; 
  soundEffects?: import("./voiceOverlay.types").SoundEffect[]; 
  textToSpeech?: import("./audioEffects.types").TextToSpeechConfig[]; 
  captions?: import("./voiceOverlay.types").Caption[]; 
  links?: import("./voiceOverlay.types").Link[]; 
  cutouts?: import("./voiceOverlay.types").Cutout[]; 
  adjustSettings?: import("./voiceOverlay.types").AdjustSettings; 
  overlayEffects?: import("./voiceOverlay.types").OverlayEffect[]; 
  audioMixSettings?: import("./audioEffects.types").AudioMixSettings; 
}

export type CameraClipArray = CameraClip[];
