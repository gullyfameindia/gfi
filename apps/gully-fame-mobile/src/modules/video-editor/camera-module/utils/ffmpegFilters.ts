import type { FilterPreset } from "../types/filters";
import type { AdjustSettings } from "../types/voiceOverlay.types";


let FFmpegKit: any = null;
let ReturnCode: any = null;
let isFFmpegAvailable = false;

try {
  const ffmpeg = require("ffmpeg-kit-react-native-community");
  FFmpegKit = ffmpeg.FFmpegKit;
  ReturnCode = ffmpeg.ReturnCode;
  isFFmpegAvailable = true;
} catch (e) {
  console.warn("FFmpeg not available in ffmpegFilters - filters will fail gracefully in Expo Go");
  isFFmpegAvailable = false;
}


function buildFFmpegFilterChain(preset: FilterPreset): string {
  const filters: string[] = [];
  const eqParams: string[] = [];

  if (preset.brightness !== undefined && preset.brightness !== 0) {
    const brightnessValue = Math.max(-1.0, Math.min(1.0, preset.brightness));
    eqParams.push(`brightness=${brightnessValue}`);
  }
  if (preset.contrast !== undefined && preset.contrast !== 1.0) {
    const contrastValue = Math.max(0.0, Math.min(3.0, preset.contrast));
    eqParams.push(`contrast=${contrastValue}`);
  }
  if (preset.saturation !== undefined && preset.saturation !== 1.0) {
    const satValue = Math.max(0.0, Math.min(3.0, preset.saturation));
    eqParams.push(`saturation=${satValue}`);
  }
  if (preset.gamma !== undefined && preset.gamma !== 1.0) {
    const gammaValue = Math.max(0.1, Math.min(10.0, preset.gamma));
    eqParams.push(`gamma=${gammaValue}`);
  }
  if (eqParams.length > 0) {
    filters.push(`eq=${eqParams.join(":")}`);
  }

  if (preset.temperature !== undefined || preset.tint !== undefined) {
    const balanceParams: string[] = [];
    if (preset.temperature !== undefined && preset.temperature !== 0) {
      const tempValue = Math.max(-1.0, Math.min(1.0, preset.temperature));
      if (tempValue > 0) {
        balanceParams.push(`rs=${tempValue}`);
        balanceParams.push(`bs=-${tempValue}`);
      } else {
        balanceParams.push(`rs=${tempValue}`);
        balanceParams.push(`bs=${Math.abs(tempValue)}`);
      }
    }
    if (preset.tint !== undefined && preset.tint !== 0) {
      const tintValue = Math.max(-1.0, Math.min(1.0, preset.tint));
      if (tintValue > 0) {
        balanceParams.push(`rs=${tintValue * 0.5}`);
        balanceParams.push(`bs=${tintValue * 0.5}`);
        balanceParams.push(`gs=-${tintValue}`);
      } else {
        balanceParams.push(`rs=${tintValue * 0.5}`);
        balanceParams.push(`bs=${tintValue * 0.5}`);
        balanceParams.push(`gs=${Math.abs(tintValue)}`);
      }
    }
    if (balanceParams.length > 0) {
      filters.push(`colorbalance=${balanceParams.join(":")}`);
    }
  }

  if (preset.vignette) {
    const { angle, x0, y0 } = preset.vignette;
    const angleRad = (angle * Math.PI) / 180;
    const centerX = Math.max(0.0, Math.min(1.0, x0));
    const centerY = Math.max(0.0, Math.min(1.0, y0));
    filters.push(`vignette=angle=${angleRad}:x0=${centerX}:y0=${centerY}`);
  }

  if (preset.grain && preset.grain.strength > 0) {
    const strength = Math.max(0.0, Math.min(1.0, preset.grain.strength));
    const noiseStrength = strength * 20;
    filters.push(`noise=alls=${noiseStrength}:allf=t+u`);
  }

  return filters.length > 0 ? filters.join(",") : "";
}





export function buildAdjustmentFilterChain(settings: AdjustSettings): string {
  const filters: string[] = [];
  
  
  const eqParams: string[] = [];
  
  if (settings.brightness !== 0) {
    
    const brightness = (settings.brightness / 100);
    eqParams.push(`brightness=${brightness.toFixed(2)}`);
  }
  
  if (settings.contrast !== 0) {
    
    const contrast = 1.0 + (settings.contrast / 100);
    eqParams.push(`contrast=${contrast.toFixed(2)}`);
  }
  
  if (settings.saturation !== 0) {
    
    const saturation = 1.0 + (settings.saturation / 100);
    eqParams.push(`saturation=${Math.max(0, saturation).toFixed(2)}`);
  }
  
  if (eqParams.length > 0) {
    filters.push(`eq=${eqParams.join(":")}`);
  }
  
  
  if (settings.hue !== 0) {
    filters.push(`hue=h=${settings.hue}`);
  }
  
  
  const balanceParams: string[] = [];
  
  if (settings.temperature !== 0) {
    
    
    const tempScale = settings.temperature / 50; 
    if (tempScale > 0) {
      
      balanceParams.push(`rs=${(tempScale * 30).toFixed(1)}`);
      balanceParams.push(`bs=${(-tempScale * 30).toFixed(1)}`);
    } else {
      
      balanceParams.push(`rs=${(tempScale * 30).toFixed(1)}`);
      balanceParams.push(`bs=${(-tempScale * 30).toFixed(1)}`);
    }
  }
  
  if (settings.tint !== 0) {
    
    const tintScale = settings.tint / 50; 
    if (tintScale > 0) {
      
      balanceParams.push(`gs=${(-tintScale * 30).toFixed(1)}`);
    } else {
      
      balanceParams.push(`gs=${(-tintScale * 30).toFixed(1)}`);
    }
  }
  
  if (balanceParams.length > 0) {
    filters.push(`colorbalance=${balanceParams.join(":")}`);
  }
  
  
  if (settings.sharpness !== 0) {
    
    const sharpAmount = 1.0 + (settings.sharpness / 100);
    if (sharpAmount > 1.0) {
      
      filters.push(`unsharp=m=1.5:a=${(sharpAmount * 0.5).toFixed(2)}`);
    } else if (sharpAmount < 1.0) {
      
      const blurAmount = (1.0 - sharpAmount) * 5;
      filters.push(`boxblur=${blurAmount.toFixed(1)}`);
    }
  }
  
  
  if (settings.blur > 0) {
    const blurAmount = Math.max(0, Math.min(10, settings.blur / 10));
    filters.push(`boxblur=${blurAmount.toFixed(1)}`);
  }
  
  return filters.length > 0 ? filters.join(",") : "";
}

export async function applyPresetToImage(
  inputPath: string,
  outputPath: string,
  preset: FilterPreset
): Promise<string> {
  if (!isFFmpegAvailable) {
    throw new Error("FFmpeg not available in Expo Go. Create a development build for filter support.");
  }

  const filterChain = buildFFmpegFilterChain(preset);
  if (preset.name === "Original" || !filterChain) {
    const command = `-i "${inputPath}" -c copy -y "${outputPath}"`;
    const session = await FFmpegKit.execute(command);
    const returnCode = await session.getReturnCode();
    if (ReturnCode.isSuccess(returnCode)) return outputPath;
    throw new Error(`FFmpeg failed: ${(await session.getFailStackTrace()) || "Unknown error"}`);
  }

  const command = `-i "${inputPath}" -vf "${filterChain}" -y "${outputPath}"`;
  const session = await FFmpegKit.execute(command);
  const returnCode = await session.getReturnCode();
  if (ReturnCode.isSuccess(returnCode)) return outputPath;
  throw new Error(`FFmpeg failed: ${(await session.getFailStackTrace()) || "Unknown error"}`);
}

export async function applyPresetToVideo(
  inputPath: string,
  outputPath: string,
  preset: FilterPreset
): Promise<string> {
  if (!isFFmpegAvailable) {
    throw new Error("FFmpeg not available in Expo Go. Create a development build for filter support.");
  }

  const filterChain = buildFFmpegFilterChain(preset);
  if (preset.name === "Original" || !filterChain) {
    const command = `-i "${inputPath}" -c copy -y "${outputPath}"`;
    const session = await FFmpegKit.execute(command);
    const returnCode = await session.getReturnCode();
    if (ReturnCode.isSuccess(returnCode)) return outputPath;
    throw new Error(`FFmpeg failed: ${(await session.getFailStackTrace()) || "Unknown error"}`);
  }

  const command = `-i "${inputPath}" -vf "${filterChain}" -c:v libx264 -c:a copy -preset medium -crf 23 -y "${outputPath}"`;
  const session = await FFmpegKit.execute(command);
  const returnCode = await session.getReturnCode();
  if (ReturnCode.isSuccess(returnCode)) return outputPath;
  throw new Error(`FFmpeg failed: ${(await session.getFailStackTrace()) || "Unknown error"}`);
}


export async function applyOverlaysToVideo(
  inputVideoPath: string,
  outputPath: string,
  overlays: any[]
): Promise<string> {
  if (!isFFmpegAvailable) {
    throw new Error("FFmpeg not available in Expo Go. Create a development build for overlay support.");
  }

  
  if (!overlays || overlays.length === 0) return inputVideoPath;

  
  const imageStickers = overlays.filter((o) => o.type === "image");
  if (imageStickers.length === 0) return inputVideoPath;

  
  let command = `-i "${inputVideoPath}" `;
  imageStickers.forEach((sticker) => {
    command += `-i "${sticker.content}" `;
  });

  
  let filterComplex = ``;
  let lastOutput = `0:v`;

  imageStickers.forEach((sticker, index) => {
    const currentInput = `${index + 1}:v`;
    const nextOutput = `v${index + 1}`;
    
    
    filterComplex += `[${lastOutput}][${currentInput}]overlay=(W-w)/2:(H-h)/2`;

    if (index < imageStickers.length - 1) {
      filterComplex += `[${nextOutput}];`;
      lastOutput = nextOutput;
    }
  });

  
  command += ` -filter_complex "${filterComplex}" -c:v libx264 -preset fast -c:a copy -y "${outputPath}"`;

  const session = await FFmpegKit.execute(command);
  const returnCode = await session.getReturnCode();

  if (ReturnCode.isSuccess(returnCode)) {
    return outputPath;
  } else {
    const failureStackTrace = (await session.getFailStackTrace()) || "Unknown overlay error";
    throw new Error(`FFmpeg Overlay failed: ${failureStackTrace}`);
  }
}
