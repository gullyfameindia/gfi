import React from 'react';
import { Image, ImageProps, StyleSheet, View, ViewStyle } from 'react-native';
import type { FilterConfig } from '../../types/filters';
import { getFilterOverlayFromProperties } from '../../utils/filterOverlays';

interface FilterThumbnailProps extends Omit<ImageProps, 'style'> {
  source: { uri: string };
  filter?: FilterConfig;
  style?: ViewStyle;
}





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
      
      {}
      {filterOverlayStyle && (
        <View style={filterOverlayStyle} />
      )}
    </View>
  );
};

export default FilterThumbnail;
