import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cameraStyles } from '../styles/cameraStyles';

interface GalleryButtonProps {
  onPress: () => void;
}

/**
 * Small circular gallery button, intended to sit just left of the capture button.
 */
const GalleryButton: React.FC<GalleryButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={cameraStyles.galleryButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name="images-outline" size={24} color="#f9fafb" />
    </TouchableOpacity>
  );
};

export default GalleryButton;


