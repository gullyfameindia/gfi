/**
 * Music and Audio Types for Video Editor
 */

export type AudioTrackType = "music" | "voiceover" | "sound-effect";

/**
 * Represents a music track from the library
 */
export interface Music {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  genre?: string;
  mood?: string;
  thumbnail?: string;
  audioUrl: string;
  isLicensed: boolean;
  category?: string;
}

/**
 * Represents an audio track added to a video clip
 */
export interface AudioTrack {
  id: string;
  uri: string;
  type: AudioTrackType;
  startTime: number; // in seconds, when to start playing the audio
  endTime: number; // in seconds, when to stop playing the audio
  volume: number; // 0-1
  fadeIn?: number; // duration in seconds
  fadeOut?: number; // duration in seconds
  isMuted?: boolean;
}

/**
 * Music library state
 */
export interface MusicLibraryState {
  tracks: Music[];
  selectedTrack: Music | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
}

/**
 * Music picker modal props
 */
export interface MusicPickerModalProps {
  visible: boolean;
  onSelect: (music: Music) => void;
  onCancel: () => void;
  selectedMusic?: Music | null;
}

/**
 * Audio track editor props
 */
export interface AudioTrackEditorProps {
  track: AudioTrack;
  onUpdate: (track: AudioTrack) => void;
  onDelete: () => void;
  maxDuration: number; // max duration of the video
}
