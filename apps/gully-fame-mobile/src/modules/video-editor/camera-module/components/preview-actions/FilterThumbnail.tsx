import React from 'react';
import { Image, ImageProps, StyleSheet, View, ViewStyle } from 'react-native';
import type { FilterConfig } from '../../types/filters';
import { getFilterOverlayFromProperties } from '../../utils/filterOverlays';

interface FilterThumbnailProps extends Omit<ImageProps, 'style'> {
  source: { uri: string };
  filter?: FilterConfig;
  style?: ViewStyle;
}

/**
 * Thumbnail image component with filter overlay preview
 * Shows the same visual filter effect as FilteredVideo for consistency
 */
const FilterThumbnail: React.FC<FilterThumbnailProps> = ({
  source,
  filter,
  style,
  ...imageProps
}) => {
  const filterOverlayStyle = getFilterOverlayFromProperties(filter || { name: 'Original' });

  return (
    <View style={style}>
      <Image
        source={source}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        {...imageProps}
      />
      
      {/* Filter color overlay - simulates filter effect */}
      {filterOverlayStyle && (
        <View style={filterOverlayStyle} />
      )}
    </View>
  );
};

export default FilterThumbnail;
