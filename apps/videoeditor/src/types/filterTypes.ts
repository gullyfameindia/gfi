export type FilterConfig = {
  name: string;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  gamma?: number;
  temperature?: number;
  tint?: number;
  vignette?: {
    angle: number;
    x0: number;
    y0: number;
  };
  grain?: {
    strength: number;
  };
};

export const FILTER_PRESETS: FilterConfig[] = [
  { name: 'Original' },
  { name: 'Boost', saturation: 1.3, contrast: 1.2, brightness: 0.05 },
  { name: 'Toasty', temperature: 0.4, saturation: 1.15, contrast: 1.1 },
  { name: 'Fresh', temperature: -0.2, saturation: 1.2, contrast: 1.1, brightness: 0.08 },
  { name: 'Cool', temperature: -0.3, contrast: 1.15, saturation: 1.05 },
  { name: 'Warm', temperature: 0.3, contrast: 1.1, saturation: 1.1 },
  { name: 'Vintage', contrast: 0.9, saturation: 0.75, temperature: 0.2, gamma: 1.1 },
  { name: 'Cinematic', contrast: 1.2, saturation: 1.15, temperature: 0.15, gamma: 0.9 },
  { name: 'Vibrant', saturation: 1.4, contrast: 1.25, brightness: 0.05 },
  { name: 'Moody', brightness: -0.1, contrast: 1.3, saturation: 0.85, temperature: -0.2, gamma: 0.85 },
];
