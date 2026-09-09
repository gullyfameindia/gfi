






export type TTSVoice = 'none' | 'alex' | 'billie' | 'bold' | 'bubbly' | 'calm';

export interface TTSVoiceConfig {
  id: TTSVoice;
  name: string;
  description: string;
  icon: string;
  language?: string;
  gender?: 'male' | 'female' | 'neutral';
  pitch?: number; 
  rate?: number; 
}




export type AudioEffectType = 'none' | 'helium' | 'low' | 'toy_speaker' | 'microphone' | 'android';

export interface AudioEffect {
  id: AudioEffectType;
  name: string;
  description: string;
  icon: string;
  
  pitchShift?: number; 
  speedMultiplier?: number; 
  reverbLevel?: number; 
  distortionLevel?: number; 
  eqPreset?: EQPreset; 
}




export interface EQPreset {
  name: string;
  bass: number; 
  midtone: number; 
  treble: number; 
}




export type VoiceEnhancementType = 'none' | 'clarity' | 'echo' | 'reverb' | 'chorus' | 'compression';

export interface VoiceEnhancement {
  id: VoiceEnhancementType;
  name: string;
  enabled: boolean;
  parameters: {
    intensity?: number; 
    duration?: number; 
    decay?: number; 
  };
}




export interface AudioTrackWithEffects {
  id: string;
  uri: string;
  type: 'music' | 'voiceover' | 'sound-effect' | 'tts';
  startTime: number; 
  endTime: number; 
  duration: number;
  volume: number; 
  isMuted: boolean;
  
  
  ttsVoice?: TTSVoice; 
  audioEffect?: AudioEffectType; 
  voiceEnhancements?: VoiceEnhancement[]; 
  
  
  cropStart?: number; 
  cropEnd?: number; 
  
  
  fadeIn?: number; 
  fadeOut?: number; 
  
  
  bassGain?: number; 
  midtoneGain?: number; 
  trebleGain?: number; 
  
  
  isNormalized?: boolean;
  normalizedLevel?: number; 
}




export interface VoiceOverlayWithEffects {
  id: string;
  uri: string;
  startTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  
  
  audioEffect?: AudioEffectType;
  voiceEnhancements?: VoiceEnhancement[];
  
  
  cropStart?: number;
  cropEnd?: number;
  
  
  fadeIn?: number;
  fadeOut?: number;
  
  
  bassGain?: number;
  midtoneGain?: number;
  trebleGain?: number;
}




export interface TextToSpeechConfig {
  id: string;
  text: string;
  voice: TTSVoice;
  language: string;
  pitch: number;
  rate: number;
  audioUri?: string; 
  duration?: number; 
  startTime: number; 
  volume: number;
  audioEffect?: AudioEffectType;
  voiceEnhancements?: VoiceEnhancement[];
}




export interface AudioMixSettings {
  masterVolume: number; 
  musicVolume: number; 
  voiceVolume: number; 
  soundEffectVolume: number; 
  autoNormalize: boolean;
  loudnessTarget: number; 
}




export interface WaveformData {
  audioId: string;
  samples: number[];
  duration: number;
  sampleRate: number;
  channels: number;
}
