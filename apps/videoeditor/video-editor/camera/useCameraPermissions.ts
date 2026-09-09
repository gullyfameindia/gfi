import { useCallback, useEffect, useState } from 'react';
import { Camera } from 'expo-camera';

type PermissionStatus = 'undetermined' | 'denied' | 'granted';

export interface UseCameraPermissionsResult {
  hasPermission: boolean | null;
  cameraStatus: PermissionStatus | null;
  microphoneStatus: PermissionStatus | null;
  isRequesting: boolean;
  requestPermissions: () => Promise<boolean>;
}

/**
  * Hook that manages camera & microphone permissions using expo-camera.
  * Returns a simple "hasPermission" flag plus detailed status for debugging.
  */
const useCameraPermissions = (): UseCameraPermissionsResult => {
  const [cameraStatus, setCameraStatus] = useState<PermissionStatus | null>(null);
  const [microphoneStatus, setMicrophoneStatus] =
    useState<PermissionStatus | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const hasPermission =
    cameraStatus === 'granted' && microphoneStatus === 'granted';

  const loadCurrentStatus = useCallback(async () => {
    try {
      const [cameraResponse, microphoneResponse] = await Promise.all([
        Camera.getCameraPermissionsAsync(),
        Camera.getMicrophonePermissionsAsync(),
      ]);

      setCameraStatus(cameraResponse.status as PermissionStatus);
      setMicrophoneStatus(microphoneResponse.status as PermissionStatus);
    } catch (error) {
      console.warn('[useCameraPermissions] Failed to read permissions', error);
      setCameraStatus('denied');
      setMicrophoneStatus('denied');
    }
  }, []);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    setIsRequesting(true);
    try {
      const [cameraResponse, microphoneResponse] = await Promise.all([
        Camera.requestCameraPermissionsAsync(),
        Camera.requestMicrophonePermissionsAsync(),
      ]);

      const nextCamera = cameraResponse.status as PermissionStatus;
      const nextMicrophone = microphoneResponse.status as PermissionStatus;

      setCameraStatus(nextCamera);
      setMicrophoneStatus(nextMicrophone);

      return nextCamera === 'granted' && nextMicrophone === 'granted';
    } catch (error) {
      console.warn('[useCameraPermissions] Failed to request permissions', error);
      setCameraStatus('denied');
      setMicrophoneStatus('denied');
      return false;
    } finally {
      setIsRequesting(false);
    }
  }, []);

  useEffect(() => {
    void loadCurrentStatus();
  }, [loadCurrentStatus]);

  return {
    hasPermission,
    cameraStatus,
    microphoneStatus,
    isRequesting,
    requestPermissions,
  };
};

export default useCameraPermissions;


