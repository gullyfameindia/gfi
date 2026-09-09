import type { CameraMode, FlashMode } from '../types/camera.types';

/**
 * Enum representation of the supported camera capture modes.
 */
export enum CameraModeEnum {
  Photo = 'photo',
  Video = 'video',
}

/**
 * Enum representation of the supported flash modes.
 * The UI exposes these simply as ON / OFF.
 */
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


