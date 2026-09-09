/**
 * Filter Preset Configuration
 * Snapchat-style creative filters with full control over color grading
 */
export type FilterPreset = {
  name: string;
  // Basic adjustments
  brightness?: number; // -1.0 to 1.0 (0 = no change)
  contrast?: number; // 0.0 to 2.0 (1.0 = no change, <1.0 = less contrast, >1.0 = more contrast)
  saturation?: number; // 0.0 to 3.0 (1.0 = no change, 0.0 = grayscale)
  gamma?: number; // 0.1 to 3.0 (1.0 = no change)
  // Color temperature / tint
  temperature?: number; // -1.0 to 1.0 (0 = neutral, positive = warm, negative = cool)
  tint?: number; // -1.0 to 1.0 (0 = neutral, positive = magenta, negative = green)
  // Optional effects
  vignette?: {
    angle: number; // 0 to 360 (degrees)
    x0: number; // 0.0 to 1.0 (center X)
    y0: number; // 0.0 to 1.0 (center Y)
  };
  grain?: {
    strength: number; // 0.0 to 1.0
  };
};

// Legacy FilterConfig for backward compatibility (used by UI preview)
export type FilterConfig = {
  name: string;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  // Extended fields for full preset support
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

/**
 * Comprehensive filter presets
 * Creative looks similar to popular social media apps
 */
export const FILTER_PRESETS: FilterPreset[] = [
  {
    name: 'Original',
    // All defaults = no change
  },
  // Basic Color Filters
  {
    name: 'Boost',
    saturation: 1.3,
    contrast: 1.2,
    brightness: 0.05,
  },
  {
    name: 'Toasty',
    temperature: 0.4,
    saturation: 1.15,
    contrast: 1.1,
  },
  {
    name: 'Subtle',
    contrast: 0.85,
    saturation: 0.9,
    brightness: 0.05,
  },
  {
    name: 'Light',
    brightness: 0.15,
    contrast: 0.9,
    saturation: 1.05,
  },
  {
    name: 'Fresh',
    temperature: -0.2,
    saturation: 1.2,
    contrast: 1.1,
    brightness: 0.08,
  },
  {
    name: 'Lively',
    saturation: 1.4,
    contrast: 1.25,
    brightness: 0.1,
  },
  {
    name: 'Crisp',
    contrast: 1.3,
    saturation: 1.15,
    brightness: 0.05,
  },
  {
    name: 'Fade',
    saturation: 0.75,
    contrast: 0.8,
    brightness: 0.1,
  },
  {
    name: 'Shade',
    brightness: -0.15,
    contrast: 1.2,
    saturation: 0.9,
  },
  {
    name: 'Summer',
    temperature: 0.3,
    saturation: 1.3,
    brightness: 0.1,
    contrast: 1.1,
  },
  {
    name: 'Spring',
    temperature: 0.2,
    saturation: 1.2,
    brightness: 0.12,
    tint: 0.1,
  },
  {
    name: 'Autumn',
    temperature: 0.4,
    saturation: 1.1,
    contrast: 1.15,
    brightness: -0.05,
  },
  {
    name: 'Antique',
    temperature: 0.3,
    saturation: 0.7,
    contrast: 0.9,
    gamma: 1.2,
  },
  {
    name: 'Wash',
    saturation: 0.6,
    contrast: 0.75,
    brightness: 0.15,
  },
  {
    name: 'Disposable',
    saturation: 0.85,
    contrast: 0.9,
    gamma: 1.15,
    grain: { strength: 0.2 },
  },
  {
    name: 'Lounge',
    brightness: -0.1,
    contrast: 1.25,
    saturation: 0.95,
    temperature: -0.15,
  },
  // Cool Variants
  {
    name: 'Simple Cool',
    temperature: -0.3,
    saturation: 1.05,
    contrast: 1.0,
  },
  {
    name: 'Fade Cool',
    temperature: -0.25,
    saturation: 0.75,
    contrast: 0.85,
    brightness: 0.1,
  },
  {
    name: 'Boost Cool',
    temperature: -0.3,
    saturation: 1.3,
    contrast: 1.2,
    brightness: 0.05,
  },
  {
    name: 'Frosty',
    temperature: -0.5,
    saturation: 0.95,
    contrast: 1.15,
    brightness: 0.1,
  },
  {
    name: 'Indigo',
    temperature: -0.4,
    saturation: 1.1,
    contrast: 1.1,
    tint: -0.2,
  },
  {
    name: 'Denim',
    temperature: -0.35,
    saturation: 1.05,
    contrast: 1.15,
    brightness: -0.05,
  },
  // Warm Variants
  {
    name: 'Simple Warm',
    temperature: 0.3,
    saturation: 1.05,
    contrast: 1.0,
  },
  {
    name: 'Boost Warm',
    temperature: 0.35,
    saturation: 1.3,
    contrast: 1.2,
    brightness: 0.05,
  },
  {
    name: 'Fade Warm',
    temperature: 0.3,
    saturation: 0.75,
    contrast: 0.85,
    brightness: 0.1,
  },
  {
    name: 'Vintage Warm',
    temperature: 0.4,
    saturation: 0.75,
    contrast: 0.9,
    gamma: 1.1,
    vignette: {
      angle: 45,
      x0: 0.5,
      y0: 0.5,
    },
  },
  {
    name: 'Latte',
    temperature: 0.45,
    saturation: 0.9,
    contrast: 0.95,
    brightness: 0.08,
  },
  // Location-based Filters
  {
    name: 'Oslo',
    temperature: -0.4,
    saturation: 1.0,
    contrast: 1.2,
    brightness: 0.05,
  },
  {
    name: 'Paris',
    temperature: 0.2,
    saturation: 1.15,
    contrast: 1.1,
    brightness: 0.08,
  },
  {
    name: 'Jakarta',
    temperature: 0.35,
    saturation: 1.25,
    contrast: 1.15,
    brightness: 0.1,
  },
  {
    name: 'New York',
    temperature: -0.1,
    contrast: 1.3,
    saturation: 1.1,
    brightness: -0.05,
  },
  {
    name: 'Los Angeles',
    temperature: 0.3,
    saturation: 1.4,
    contrast: 1.2,
    brightness: 0.15,
  },
  {
    name: 'Abu Dhabi',
    temperature: 0.4,
    saturation: 1.2,
    contrast: 1.15,
    brightness: 0.12,
  },
  {
    name: 'Rio de Janeiro',
    temperature: 0.25,
    saturation: 1.35,
    contrast: 1.25,
    brightness: 0.1,
  },
  // Special Effects
  {
    name: 'Negative',
    // Special handling needed - inverted colors
    contrast: 2.0,
    saturation: 0,
  },
  {
    name: 'Jade Vibrant',
    temperature: -0.2,
    saturation: 1.3,
    contrast: 1.2,
    tint: -0.3,
  },
  {
    name: 'Bubblegum',
    temperature: 0.3,
    saturation: 1.4,
    contrast: 1.1,
    tint: 0.4,
    brightness: 0.1,
  },
  {
    name: 'Rosy',
    temperature: 0.25,
    saturation: 1.25,
    contrast: 1.05,
    tint: 0.3,
    brightness: 0.08,
  },
  {
    name: 'Halo',
    brightness: 0.2,
    contrast: 1.1,
    saturation: 1.15,
    gamma: 1.2,
  },
  // Legacy filters (keeping for compatibility)
  {
    name: 'Grayscale',
    saturation: 0,
  },
  {
    name: 'Warm',
    temperature: 0.3,
    contrast: 1.1,
    saturation: 1.1,
  },
  {
    name: 'Cool',
    temperature: -0.3,
    contrast: 1.15,
    saturation: 1.05,
  },
  {
    name: 'Vintage',
    contrast: 0.9,
    saturation: 0.75,
    temperature: 0.2,
    gamma: 1.1,
    vignette: {
      angle: 45,
      x0: 0.5,
      y0: 0.5,
    },
  },
  {
    name: 'Dramatic',
    contrast: 1.4,
    saturation: 1.3,
    brightness: -0.05,
    gamma: 0.95,
  },
  {
    name: 'Soft',
    contrast: 0.8,
    saturation: 0.9,
    brightness: 0.1,
    gamma: 1.15,
  },
  {
    name: 'Cinematic',
    contrast: 1.2,
    saturation: 1.15,
    temperature: 0.15,
    gamma: 0.9,
    vignette: {
      angle: 90,
      x0: 0.5,
      y0: 0.5,
    },
  },
  {
    name: 'Vibrant',
    saturation: 1.4,
    contrast: 1.25,
    brightness: 0.05,
  },
  {
    name: 'Moody',
    brightness: -0.1,
    contrast: 1.3,
    saturation: 0.85,
    temperature: -0.2,
    gamma: 0.85,
  },
];

// Legacy FILTERS array for UI compatibility
export const FILTERS: FilterConfig[] = FILTER_PRESETS;
