/**
 * Text overlay types for adding text to videos/images
 */

export type TextAlign = 'left' | 'center' | 'right';
export type FontWeight = 'normal' | 'bold' | '600' | '700' | '800';

export interface TextOverlay {
  id: string;
  text: string;
  x: number; // Position X (0-1, relative to width)
  y: number; // Position Y (0-1, relative to height)
  fontSize: number;
  fontFamily?: string;
  fontWeight: FontWeight;
  color: string;
  backgroundColor?: string; // Optional background color
  textAlign: TextAlign;
  rotation?: number; // Rotation in degrees (0-360)
  opacity: number; // 0-1
  startTime?: number; // For video: when text appears (seconds)
  endTime?: number; // For video: when text disappears (seconds)
  strokeColor?: string; // Text outline color
  strokeWidth?: number; // Text outline width
}

