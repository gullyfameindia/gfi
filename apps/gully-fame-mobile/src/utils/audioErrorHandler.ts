




export interface AudioError {
  code: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  action?: () => void;
  actionLabel?: string;
}

export const AudioErrorCodes = {
  
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_ERROR: 'API_ERROR',
  TIMEOUT: 'TIMEOUT',

  
  AUDIO_NOT_FOUND: 'AUDIO_NOT_FOUND',
  INVALID_AUDIO_URL: 'INVALID_AUDIO_URL',
  AUDIO_FORMAT_NOT_SUPPORTED: 'AUDIO_FORMAT_NOT_SUPPORTED',
  AUDIO_LOAD_FAILED: 'AUDIO_LOAD_FAILED',

  
  PLAYBACK_ERROR: 'PLAYBACK_ERROR',
  DEVICE_NOT_READY: 'DEVICE_NOT_READY',

  
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  STORAGE_PERMISSION_DENIED: 'STORAGE_PERMISSION_DENIED',

  
  NO_TRACKS_SELECTED: 'NO_TRACKS_SELECTED',
  INVALID_TRACK_STATE: 'INVALID_TRACK_STATE',

  
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export const getAudioErrorMessage = (error: unknown): AudioError => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    
    if (message.includes('network') || message.includes('fetch')) {
      return {
        code: AudioErrorCodes.NETWORK_ERROR,
        message: 'Network error. Please check your connection.',
        severity: 'error',
      };
    }

    
    if (message.includes('timeout')) {
      return {
        code: AudioErrorCodes.TIMEOUT,
        message: 'Request timed out. Please try again.',
        severity: 'error',
      };
    }

    
    if (message.includes('format') || message.includes('codec')) {
      return {
        code: AudioErrorCodes.AUDIO_FORMAT_NOT_SUPPORTED,
        message: 'Audio format is not supported.',
        severity: 'error',
      };
    }

    
    if (message.includes('not found') || message.includes('404')) {
      return {
        code: AudioErrorCodes.AUDIO_NOT_FOUND,
        message: 'Audio file not found.',
        severity: 'error',
      };
    }

    
    if (message.includes('permission')) {
      return {
        code: AudioErrorCodes.PERMISSION_DENIED,
        message: 'Permission denied. Please enable audio permissions.',
        severity: 'error',
      };
    }

    
    if (message.includes('playback')) {
      return {
        code: AudioErrorCodes.PLAYBACK_ERROR,
        message: 'Playback error. Please try again.',
        severity: 'error',
      };
    }
  }

  return {
    code: AudioErrorCodes.UNKNOWN_ERROR,
    message: 'An unexpected error occurred.',
    severity: 'error',
  };
};

export const logAudioError = (error: AudioError, context: string = 'Audio Operation') => {
  console.error(`[${context}] ${error.code}: ${error.message}`);
};

export const isRecoverableError = (errorCode: string): boolean => {
  const recoverableErrors = [
    AudioErrorCodes.TIMEOUT,
    AudioErrorCodes.NETWORK_ERROR,
    AudioErrorCodes.PLAYBACK_ERROR,
  ];
  return recoverableErrors.includes(errorCode as any);
};
