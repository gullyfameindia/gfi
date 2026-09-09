/**
 * Sticker Loader Utility
 * 
 * This file helps load stickers from the assets folder.
 * 
 * To use:
 * 1. Create a folder: src/assets/stickers/ (or assets/stickers/)
 * 2. Add your sticker images (PNG, JPG, etc.)
 * 3. Import them here and export as an array
 * 
 * Example:
 * import sticker1 from '../../src/assets/stickers/sticker1.png';
 * import sticker2 from '../../src/assets/stickers/sticker2.png';
 * 
 * export const STICKERS = [sticker1, sticker2];
 */

// TODO: Import your stickers here
// Example:
// import sticker1 from '../../src/assets/stickers/sticker1.png';
// import sticker2 from '../../src/assets/stickers/sticker2.png';
// import sticker3 from '../../src/assets/stickers/sticker3.png';

export const STICKERS: any[] = [];

/**
 * Alternative: Load stickers dynamically using require.context (if using bundler that supports it)
 * Or use a function that requires all files in a directory
 */
export const loadStickers = (): any[] => {
  // For React Native, you typically need to import each sticker explicitly
  // This is a placeholder - replace with actual imports
  return STICKERS;
};

