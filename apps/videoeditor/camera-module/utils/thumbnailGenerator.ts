import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import type { CameraClip } from '../types/camera.types';




const THUMBNAIL_WIDTH = 120;
const THUMBNAIL_HEIGHT = 80;
const THUMBNAIL_QUALITY = 0.8;





export async function generateVideoThumbnail(
  videoUri: string,
  timeSeconds: number = 0
): Promise<string | null> {
  try {
    
    
    
    
    
    
    
    
    
    return null;
  } catch (error) {
    console.warn('Error generating video thumbnail:', error);
    return null;
  }
}




export async function generateImageThumbnail(imageUri: string): Promise<string | null> {
  try {
    
    const cacheBase = (FileSystem as any).cacheDirectory || '';
    const cacheDir = `${cacheBase}thumbnails/`;
    const exists = await FileSystem.getInfoAsync(cacheDir);
    if (!exists.exists) {
      await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
    }
    
    const filename = `thumb_${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
    const outputUri = `${cacheDir}${filename}`;
    
    const manipulated = await manipulateAsync(
      imageUri,
      [{ resize: { width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT } }],
      { compress: THUMBNAIL_QUALITY, format: SaveFormat.JPEG }
    );
    
    return manipulated.uri;
  } catch (error) {
    console.warn('Error generating image thumbnail:', error);
    return null;
  }
}




export async function generateClipThumbnail(clip: CameraClip): Promise<string | null> {
  if (clip.type === 'video') {
    
    const time = clip.trimStart ?? clip.duration / 2;
    return generateVideoThumbnail(clip.uri, time);
  } else {
    
    return generateImageThumbnail(clip.uri);
  }
}




export async function generateThumbnailsForClips(
  clips: CameraClip[]
): Promise<Map<string, string>> {
  const thumbnails = new Map<string, string>();
  
  
  const thumbnailPromises = clips.map(async (clip) => {
    if (clip.thumbnailUri) {
      return { clipId: clip.id, thumbnail: clip.thumbnailUri };
    }
    
    const thumbnail = await generateClipThumbnail(clip);
    return { clipId: clip.id, thumbnail };
  });
  
  const results = await Promise.all(thumbnailPromises);
  
  for (const result of results) {
    if (result.thumbnail) {
      thumbnails.set(result.clipId, result.thumbnail);
    }
  }
  
  return thumbnails;
}

