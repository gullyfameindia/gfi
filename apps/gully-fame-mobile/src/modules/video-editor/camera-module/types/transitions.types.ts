/**
 * Transition Types for Video Editor
 */

export type TransitionType = "fade" | "slide" | "zoom" | "wipe" | "dissolve" | "push" | "reveal";

export type TransitionDirection = "left" | "right" | "up" | "down";

/**
 * Represents a transition between two clips
 */
export interface Transition {
  id: string;
  type: TransitionType;
  duration: number; // in milliseconds (default: 300-500ms)
  direction?: TransitionDirection; // for directional transitions
  intensity?: number; // 0-1, for effects like blur intensity
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
}

/**
 * Transition preset configuration
 */
export interface TransitionPreset {
  id: string;
  name: string;
  type: TransitionType;
  duration: number;
  direction?: TransitionDirection;
  intensity?: number;
  thumbnail?: string;
  category?: string;
}

/**
 * Transition applied to a clip
 */
export interface ClipTransition {
  id: string;
  clipId: string; // ID of the clip this transition is applied to
  transition: Transition;
  position: "start" | "end"; // whether transition is at start or end of clip
}

/**
 * Transition selector modal props
 */
export interface TransitionSelectorModalProps {
  visible: boolean;
  onSelect: (transition: Transition) => void;
  onCancel: () => void;
  selectedTransition?: Transition | null;
}

/**
 * Transition editor props
 */
export interface TransitionEditorProps {
  transition: Transition;
  onUpdate: (transition: Transition) => void;
  onDelete: () => void;
}

/**
 * Available transition presets
 */
export const TRANSITION_PRESETS: TransitionPreset[] = [
  {
    id: "fade-default",
    name: "Fade",
    type: "fade",
    duration: 300,
    category: "Basic",
  },
  {
    id: "slide-left",
    name: "Slide Left",
    type: "slide",
    duration: 400,
    direction: "left",
    category: "Directional",
  },
  {
    id: "slide-right",
    name: "Slide Right",
    type: "slide",
    duration: 400,
    direction: "right",
    category: "Directional",
  },
  {
    id: "slide-up",
    name: "Slide Up",
    type: "slide",
    duration: 400,
    direction: "up",
    category: "Directional",
  },
  {
    id: "slide-down",
    name: "Slide Down",
    type: "slide",
    duration: 400,
    direction: "down",
    category: "Directional",
  },
  {
    id: "zoom-in",
    name: "Zoom In",
    type: "zoom",
    duration: 350,
    intensity: 0.5,
    category: "Zoom",
  },
  {
    id: "zoom-out",
    name: "Zoom Out",
    type: "zoom",
    duration: 350,
    intensity: -0.5,
    category: "Zoom",
  },
  {
    id: "dissolve-default",
    name: "Dissolve",
    type: "dissolve",
    duration: 300,
    category: "Basic",
  },
  {
    id: "wipe-left",
    name: "Wipe Left",
    type: "wipe",
    duration: 400,
    direction: "left",
    category: "Wipe",
  },
  {
    id: "wipe-right",
    name: "Wipe Right",
    type: "wipe",
    duration: 400,
    direction: "right",
    category: "Wipe",
  },
  {
    id: "push-left",
    name: "Push Left",
    type: "push",
    duration: 400,
    direction: "left",
    category: "Push",
  },
  {
    id: "push-right",
    name: "Push Right",
    type: "push",
    duration: 400,
    direction: "right",
    category: "Push",
  },
];
