



export type AudioTrackType = "music" | "voiceover" | "sound-effect";




export interface Music {
  id: string;
  title: string;
  artist: string;
  duration: number; 
  genre?: string;
  mood?: string;
  thumbnail?: string;
  audioUrl: string;
  isLicensed: boolean;
  category?: string;
}




export interface AudioTrack {
  id: string;
  uri: string;
  type: AudioTrackType;
  startTime: number; 
  endTime: number; 
  volume: number; 
  fadeIn?: number; 
  fadeOut?: number; 
  isMuted?: boolean;
}




export interface MusicLibraryState {
  tracks: Music[];
  selectedTrack: Music | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
}




export interface MusicPickerModalProps {
  visible: boolean;
  onSelect: (music: Music) => void;
  onCancel: () => void;
  selectedMusic?: Music | null;
}




export interface AudioTrackEditorProps {
  track: AudioTrack;
  onUpdate: (track: AudioTrack) => void;
  onDelete: () => void;
  maxDuration: number; 
}
