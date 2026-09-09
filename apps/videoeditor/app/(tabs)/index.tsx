import React from 'react';
import CameraModule from '../../camera-module';

/**
 * Tab One is now dedicated to the self-contained camera-module.
 * It renders:
 * - Home → Camera (multi-clip) → Preview
 */
export default function TabOneScreen() {
  return <CameraModule />;
}
