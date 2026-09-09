



export type TextAlign = 'left' | 'center' | 'right';
export type FontWeight = 'normal' | 'bold' | '600' | '700' | '800';

export interface TextOverlay {
  id: string;
  text: string;
  x: number; 
  y: number; 
  fontSize: number;
  fontFamily?: string;
  fontWeight: FontWeight;
  color: string;
  backgroundColor?: string; 
  textAlign: TextAlign;
  rotation?: number; 
  opacity: number; 
  startTime?: number; 
  endTime?: number; 
  strokeColor?: string; 
  strokeWidth?: number; 
}

