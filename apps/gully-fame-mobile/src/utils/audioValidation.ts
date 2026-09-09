




import type { MusicTrack } from '@/api/services/musicLibraryService';

export const validateAudioUrl = (url: string): boolean => {
  if (!url) return false;

  try {
    new URL(url);
    
    const audioFormats = ['mp3', 'm4a', 'aac', 'wav', 'flac', 'ogg'];
    const lowerUrl = url.toLowerCase();
    return audioFormats.some(format => lowerUrl.includes(format));
  } catch {
    return false;
  }
};

export const validateMusicTrack = (track: any): track is MusicTrack => {
  return (
    track &&
    typeof track === 'object' &&
    '_id' in track &&
    'title' in track &&
    'duration' in track &&
    'audioUrl' in track &&
    typeof track._id === 'string' &&
    typeof track.title === 'string' &&
    typeof track.duration === 'number' &&
    typeof track.audioUrl === 'string' &&
    validateAudioUrl(track.audioUrl)
  );
};

export const validateVolume = (volume: number): number => {
  return Math.max(0, Math.min(1, volume));
};

export const validateStartTime = (startTime: number, maxDuration: number = 300): number => {
  return Math.max(0, Math.min(startTime, maxDuration));
};

export const validateTrackDuration = (duration: number): boolean => {
  return duration > 0 && duration < 3600; 
};

export const canAddTrack = (
  newTrack: MusicTrack,
  existingTracks: any[],
  maxTracks: number = 10
): { valid: boolean; reason?: string } => {
  if (!validateMusicTrack(newTrack)) {
    return { valid: false, reason: 'Invalid audio track' };
  }

  if (existingTracks.length >= maxTracks) {
    return { valid: false, reason: `Maximum ${maxTracks} tracks allowed` };
  }

  if (!validateTrackDuration(newTrack.duration)) {
    return { valid: false, reason: 'Audio duration is invalid' };
  }

  
  const isDuplicate = existingTracks.some(
    track => track._id === newTrack._id && !track.startTime
  );
  if (isDuplicate) {
    return { valid: false, reason: 'Track already added' };
  }

  return { valid: true };
};

export const validateAudioMix = (
  tracks: any[],
  masterVolume: number
): { valid: boolean; warnings: string[] } => {
  const warnings: string[] = [];

  if (tracks.length === 0) {
    return { valid: true, warnings: ['No audio tracks in mix'] };
  }

  if (masterVolume <= 0) {
    warnings.push('Master volume is muted');
  }

  if (masterVolume > 0.8) {
    warnings.push('Master volume is high - risk of clipping');
  }

  const allMuted = tracks.every(t => (t.volume || 1) * masterVolume === 0);
  if (allMuted) {
    warnings.push('All tracks are muted');
  }

  const highVolumeTracks = tracks.filter(t => (t.volume || 1) * masterVolume > 0.8);
  if (highVolumeTracks.length > 1) {
    warnings.push('Multiple tracks have high volume - risk of clipping');
  }

  return { valid: true, warnings };
};

export const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const calculateTotalDuration = (tracks: any[]): number => {
  if (tracks.length === 0) return 0;
  return tracks.reduce((max, track) => {
    const endTime = (track.startTime || 0) + track.duration;
    return Math.max(max, endTime);
  }, 0);
};

export const sanitizeTrackData = (track: any): Partial<MusicTrack> => {
  return {
    _id: String(track._id || '').substring(0, 50),
    title: String(track.title || 'Untitled').substring(0, 100),
    artist: track.artist ? String(track.artist).substring(0, 100) : undefined,
    duration: Math.max(0, Number(track.duration) || 0),
    audioUrl: String(track.audioUrl || '').substring(0, 500),
    coverImage: track.coverImage ? String(track.coverImage).substring(0, 500) : undefined,
    usageCount: Math.max(0, Number(track.usageCount) || 0),
  };
};
