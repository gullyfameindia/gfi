import { useCallback } from "react";
import type { PermissionStatus } from "../types/camera.types";

let useCameraPermissions: any = null;
let useMicrophonePermissions: any = null;
try {
  const expoCamera = require("expo-camera");
  useCameraPermissions = expoCamera.useCameraPermissions;
  useMicrophonePermissions = expoCamera.useMicrophonePermissions;
} catch (e) {
  console.warn("[usePermissions] expo-camera not available (requires dev build):", (e as any)?.message);
}

export interface UsePermissionsResult {
  hasPermission: boolean | null;
  cameraPermission: PermissionStatus | null;
  microphonePermission: PermissionStatus | null;
  isRequesting: boolean;
  requestPermissions: () => Promise<boolean>;
}




export const usePermissions = (): UsePermissionsResult => {
  
  if (!useCameraPermissions || !useMicrophonePermissions) {
    console.warn("[usePermissions] expo-camera permissions not available");
    return {
      hasPermission: null,
      cameraPermission: null,
      microphonePermission: null,
      isRequesting: false,
      requestPermissions: async () => false,
    };
  }

  
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
