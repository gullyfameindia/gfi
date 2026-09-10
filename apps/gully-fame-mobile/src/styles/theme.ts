/**
 * Theme Constants
 * Centralized colors, spacing, and typography
 */

export const COLORS = {
  // Primary Colors
  PRIMARY: "#E91E63",
  PRIMARY_DARK: "#C2185B",
  PRIMARY_LIGHT: "#F06292",

  // Secondary Colors
  SECONDARY: "#007AFF",
  SECONDARY_DARK: "#0051D5",
  SECONDARY_LIGHT: "#5AC8FA",

  // Neutral Colors
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  GRAY_50: "#F9FAFB",
  GRAY_100: "#F3F4F6",
  GRAY_200: "#E5E7EB",
  GRAY_300: "#D1D5DB",
  GRAY_400: "#9CA3AF",
  GRAY_500: "#6B7280",
  GRAY_600: "#4B5563",
  GRAY_700: "#374151",
  GRAY_800: "#1F2937",
  GRAY_900: "#111827",

  // Background Colors
  BACKGROUND: "#121212",
  SURFACE: "#1E1E1E",
  SURFACE_VARIANT: "#2C2C2C",

  // Status Colors
  SUCCESS: "#10B981",
  WARNING: "#F59E0B",
  ERROR: "#EF4444",
  INFO: "#3B82F6",

  // Text Colors
  TEXT_PRIMARY: "#000000",
  TEXT_SECONDARY: "#666666",
  TEXT_TERTIARY: "#999999",
  TEXT_DISABLED: "#CCCCCC",

  // Border Colors
  BORDER: "#E5E7EB",
  BORDER_DARK: "#2C2C2C",

  // Overlay
  OVERLAY_LIGHT: "rgba(0, 0, 0, 0.3)",
  OVERLAY_DARK: "rgba(0, 0, 0, 0.7)",
} as const;

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 32,
} as const;

export const TYPOGRAPHY = {
  FONT_FAMILY: {
    REGULAR: "Poppins-Regular",
    MEDIUM: "Poppins-Medium",
    SEMIBOLD: "Poppins-SemiBold",
    BOLD: "Poppins-Bold",
  },
  FONT_SIZE: {
    XS: 10,
    SM: 12,
    MD: 14,
    LG: 16,
    XL: 18,
    XXL: 20,
    XXXL: 24,
    DISPLAY: 32,
  },
  LINE_HEIGHT: {
    TIGHT: 1.2,
    NORMAL: 1.5,
    RELAXED: 1.75,
  },
} as const;

export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  FULL: 9999,
} as const;

export const SHADOWS = {
  SMALL: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  LARGE: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

export const ANIMATION = {
  DURATION: {
    SHORT: 200,
    NORMAL: 300,
    LONG: 500,
  },
  TIMING: {
    EASE_IN: "ease-in",
    EASE_OUT: "ease-out",
    EASE_IN_OUT: "ease-in-out",
    LINEAR: "linear",
  },
} as const;

export default {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDER_RADIUS,
  SHADOWS,
  ANIMATION,
};
