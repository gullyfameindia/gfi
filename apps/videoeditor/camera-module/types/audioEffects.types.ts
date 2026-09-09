/**
 * Audio Effects and Processing Types
 */

/**
 * Text-to-Speech Voice Options
 */
export type TTSVoice = 'none' | 'alex' | 'billie' | 'bold' | 'bubbly' | 'calm';

export interface TTSVoiceConfig {
  id: TTSVoice;
  name: string;
  description: string;
  icon: string;
  language?: string;
  gender?: 'male' | 'female' | 'neutral';
  pitch?: number; // 0.5 - 2.0
  rate?: number; // 0.5 - 2.0
}

/**
 * Audio Effect Types (Voice effects)
 */
export type AudioEffectType = 'none' | 'helium' | 'low' | 'toy_speaker' | 'microphone' | 'android';

export interface AudioEffect {
  id: AudioEffectType;
  name: string;
  description: string;
  icon: string;
  // Audio processing parameters
  pitchShift?: number; // Semitones (-12 to +12)
  speedMultiplier?: number; // 0.5 to 2.0
  reverbLevel?: number; // 0 to 1
  distortionLevel?: number; // 0 to 1
  eqPreset?: EQPreset; // Preset EQ curve
}

/**
 * EQ Preset for audio effects
 */
export interface EQPreset {
  name: string;
  bass: number; // -12 to +12 dB
  midtone: number; // -12 to +12 dB
  treble: number; // -12 to +12 dB
}

/**
 * Voice Enhancement Options
 */
export type VoiceEnhancementType = 'none' | 'clarity' | 'echo' | 'reverb' | 'chorus' | 'compression';

export interface VoiceEnhancement {
  id: VoiceEnhancementType;
  name: string;
  enabled: boolean;
  parameters: {
    intensity?: number; // 0 to 1
    duration?: number; // in milliseconds
    decay?: number; // 0 to 1
  };
}

/**
 * Audio Track with Effects
 */
export interface AudioTrackWithEffects {
  id: string;
  uri: string;
  type: 'music' | 'voiceover' | 'sound-effect' | 'tts';
  startTime: number; // Start time in seconds
  endTime: number; // End time in seconds
  duration: number;
  volume: number; // 0 to 1
  isMuted: boolean;
  
  // Voice and effect settings
  ttsVoice?: TTSVoice; // For TTS audio
  audioEffect?: AudioEffectType; // Applied effect
  voiceEnhancements?: VoiceEnhancement[]; // Multiple enhancements
  
  // Cropping
  cropStart?: number; // Crop start in seconds relative to uri
  cropEnd?: number; // Crop end in seconds relative to uri
  
  // Fading
  fadeIn?: number; // Fade in duration in seconds
  fadeOut?: number; // Fade out duration in seconds
  
  // EQ Settings
  bassGain?: number; // -12 to +12 dB
  midtoneGain?: number; // -12 to +12 dB
  trebleGain?: number; // -12 to +12 dB
  
  // Normalization
  isNormalized?: boolean;
  normalizedLevel?: number; // 0 to 1
}

/**
 * Voice Recording with Processing
 */
export interface VoiceOverlayWithEffects {
  id: string;
  uri: string;
  startTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  
  // Effects
  audioEffect?: AudioEffectType;
  voiceEnhancements?: VoiceEnhancement[];
  
  // Cropping
  cropStart?: number;
  cropEnd?: number;
  
  // Fading
  fadeIn?: number;
  fadeOut?: number;
  
  // EQ
  bassGain?: number;
  midtoneGain?: number;
  trebleGain?: number;
}

/**
 * Text-to-Speech Configuration
 */
export interface TextToSpeechConfig {
  id: string;
  text: string;
  voice: TTSVoice;
  language: string;
  pitch: number;
  rate: number;
  audioUri?: string; // Generated audio file URI
  duration?: number; // Auto-calculated from synthesis
  startTime: number; // When to play in timeline
  volume: number;
  audioEffect?: AudioEffectType;
  voiceEnhancements?: VoiceEnhancement[];
}

/**
 * Audio Mixing Settings
 */
export interface AudioMixSettings {
  masterVolume: number; // 0 to 1
  musicVolume: number; // 0 to 1
  voiceVolume: number; // 0 to 1
  soundEffectVolume: number; // 0 to 1
  autoNormalize: boolean;
  loudnessTarget: number; // LUFS (Loudness Units relative to Full Scale)
}

/**
 * Waveform Data for visualization
 */
export interface WaveformData {
  audioId: string;
  samples: number[];
  duration: number;
  sampleRate: number;
  channels: number;
}
