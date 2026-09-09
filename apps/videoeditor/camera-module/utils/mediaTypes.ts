import type { CameraMode, FlashMode } from '../types/camera.types';




export enum CameraModeEnum {
  Photo = 'photo',
  Video = 'video',
}





export enum FlashModeEnum {
  Off = 'off',
  On = 'on',
}

export const CAMERA_MODES: CameraMode[] = [
  CameraModeEnum.Photo,
  CameraModeEnum.Video,
];

export const FLASH_MODES: FlashMode[] = [
  FlashModeEnum.Off,
  FlashModeEnum.On,
];


