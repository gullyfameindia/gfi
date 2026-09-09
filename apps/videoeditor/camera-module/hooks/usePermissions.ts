import { useCallback } from "react";
import { useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import type { PermissionStatus } from "../types/camera.types";

export interface UsePermissionsResult {
  hasPermission: boolean | null;
  cameraPermission: PermissionStatus | null;
  microphonePermission: PermissionStatus | null;
  isRequesting: boolean;
  requestPermissions: () => Promise<boolean>;
}




export const usePermissions = (): UsePermissionsResult => {
  
  const [camPermission, requestCamPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  
  const cameraPermission = camPermission ? (camPermission.status as PermissionStatus) : null;
  const microphonePermission = micPermission ? (micPermission.status as PermissionStatus) : null;

  const hasPermission = cameraPermission === "granted" && microphonePermission === "granted";

  
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const camResult = await requestCamPermission();
      const micResult = await requestMicPermission();
      return camResult.granted && micResult.granted;
    } catch (error) {
      console.warn("Failed to request camera/microphone permissions", error);
      return false;
    }
  }, [requestCamPermission, requestMicPermission]); 

  return {
    
    hasPermission: camPermission && micPermission ? hasPermission : null,
    cameraPermission,
    microphonePermission,
    isRequesting: false,
    requestPermissions,
  };
};
