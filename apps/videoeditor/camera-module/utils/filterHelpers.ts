import type { FilterPreset, FilterConfig } from '../types/filters';
import type { CameraClip } from '../types/camera.types';






export function hasFilterChanges(preset: FilterPreset | FilterConfig | null | undefined): boolean {
  if (!preset || preset.name === 'Original') {
    return false;
  }

  
  const hasBrightness = preset.brightness !== undefined && preset.brightness !== 0;
  const hasContrast = preset.contrast !== undefined && preset.contrast !== 1.0;
  const hasSaturation = preset.saturation !== undefined && preset.saturation !== 1.0;
  const hasGamma = preset.gamma !== undefined && preset.gamma !== 1.0;
  const hasTemperature = preset.temperature !== undefined && preset.temperature !== 0;
  const hasTint = preset.tint !== undefined && preset.tint !== 0;
  const hasVignette = preset.vignette !== undefined;
  const hasGrain = preset.grain !== undefined && preset.grain.strength > 0;

  return (
    hasBrightness ||
    hasContrast ||
    hasSaturation ||
    hasGamma ||
    hasTemperature ||
    hasTint ||
    hasVignette ||
    hasGrain
  );
}






export function clipHasFilter(clip: CameraClip): boolean {
  if (!clip.filterPreset) {
    return false;
  }
  return hasFilterChanges(clip.filterPreset);
}






export function getClipFilterName(clip: CameraClip): string {
  if (!clip.filterPreset || !hasFilterChanges(clip.filterPreset)) {
    return 'Original';
  }
  return clip.filterPreset.name;
}







export function areFiltersDifferent(
  preset1: FilterPreset | FilterConfig | null | undefined,
  preset2: FilterPreset | FilterConfig | null | undefined
): boolean {
  
  if (
    (!preset1 || preset1.name === 'Original') &&
    (!preset2 || preset2.name === 'Original')
  ) {
    return false;
  }

  
  if (
    (!preset1 || preset1.name === 'Original') !==
    (!preset2 || preset2.name === 'Original')
  ) {
    return true;
  }

  
  if (!preset1 || !preset2) return false;

  return (
    preset1.name !== preset2.name ||
    preset1.brightness !== preset2.brightness ||
    preset1.contrast !== preset2.contrast ||
    preset1.saturation !== preset2.saturation ||
    preset1.gamma !== preset2.gamma ||
    preset1.temperature !== preset2.temperature ||
    preset1.tint !== preset2.tint ||
    JSON.stringify(preset1.vignette) !== JSON.stringify(preset2.vignette) ||
    JSON.stringify(preset1.grain) !== JSON.stringify(preset2.grain)
  );
}

