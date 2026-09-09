import * as FileSystem from 'expo-file-system';
import type { CameraClip } from '../types/camera.types';
import { applyPresetToImage, applyPresetToVideo } from './ffmpegFilters';
import { clipHasFilter } from './filterHelpers';







export async function exportClipWithFilter(
  clip: CameraClip,
  outputPath: string
): Promise<string> {
  
  if (clipHasFilter(clip) && clip.filterPreset) {
    console.log(`Exporting ${clip.type} with filter:`, clip.filterPreset.name);
    
    if (clip.type === 'photo') {
      
      return await applyPresetToImage(clip.uri, outputPath, clip.filterPreset);
    } else {
      
      return await applyPresetToVideo(clip.uri, outputPath, clip.filterPreset);
    }
  } else {
    
    console.log(`Exporting ${clip.type} without filter (Original)`);
    await FileSystem.copyAsync({ from: clip.uri, to: outputPath });
    return outputPath;
  }
}







export async function exportClipsWithFilters(
  clips: CameraClip[],
  outputDir: string
): Promise<string[]> {
  
  const dirInfo = await FileSystem.getInfoAsync(outputDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(outputDir, { intermediates: true });
  }

  const outputPaths: string[] = [];

  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    const extension = clip.type === 'photo' ? '.jpg' : '.mp4';
    const outputPath = `${outputDir}/clip_${i}${extension}`;
    
    const exportedPath = await exportClipWithFilter(clip, outputPath);
    outputPaths.push(exportedPath);
  }

  return outputPaths;
}

