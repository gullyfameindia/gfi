import React from 'react';
import { Image, ImageProps, StyleSheet, View, ViewStyle } from 'react-native';
import type { FilterConfig } from '../types/filters';
import { getFilterOverlayFromProperties } from '../utils/filterOverlays';

interface FilteredImageProps extends ImageProps {
  filter?: FilterConfig;
  source: { uri: string };
}






const FilteredImage: React.FC<FilteredImageProps> = ({ filter, style, ...props }) => {
  
  if (!filter || filter.name === 'Original') {
    return <Image {...props} style={style} />;
  }

  console.log('FilteredImage applying filter:', filter.name, filter);

  const filterOverlayStyle = getFilterOverlayFromProperties(filter);

  
  const getBrightnessOverlay = (): ViewStyle | null => {
    if (!filter) return null;

    const brightness = filter.brightness || 0;

    if (brightness !== 0) {
      const brightnessOverlay: ViewStyle = {
        ...StyleSheet.absoluteFillObject,
        pointerEvents: 'none',
      };

      if (brightness > 0) {
        brightnessOverlay.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        brightnessOverlay.opacity = Math.abs(brightness) * 0.5;
      } else {
        brightnessOverlay.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        brightnessOverlay.opacity = Math.abs(brightness) * 0.5;
      }

      return brightnessOverlay;
    }

    return null;
  };

  
  const getContrastOverlay = (): ViewStyle | null => {
    if (!filter) return null;

    const contrast = filter.contrast || 1.0;

    if (contrast > 1.0 && filter.name !== 'Grayscale') {
      
      const contrastOverlay: ViewStyle = {
        ...StyleSheet.absoluteFillObject,
        pointerEvents: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        opacity: (contrast - 1.0) * 0.2,
      };
      return contrastOverlay;
    } else if (contrast < 1.0 && filter.name !== 'Grayscale') {
      
      const contrastOverlay: ViewStyle = {
        ...StyleSheet.absoluteFillObject,
        pointerEvents: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        opacity: (1.0 - contrast) * 0.15,
      };
      return contrastOverlay;
    }

    return null;
  };

  const brightnessOverlayStyle = getBrightnessOverlay();
  const contrastOverlayStyle = getContrastOverlay();

  return (
    <View style={style}>
      <Image {...props} style={StyleSheet.absoluteFill} />
      
      {}
      {filterOverlayStyle && (
        <View style={filterOverlayStyle} />
      )}
      
      {}
      {contrastOverlayStyle && (
        <View style={contrastOverlayStyle} />
      )}
      
      {}
      {brightnessOverlayStyle && (
        <View style={brightnessOverlayStyle} />
      )}
    </View>
  );
};

export default FilteredImage;
