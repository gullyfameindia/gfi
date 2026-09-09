import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { CameraClip } from '../types/camera.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AddClipOverlayProps {
  visible: boolean;
  onClose: () => void;
  onSelectCamera: () => void;
  onSelectGallery: (clip: CameraClip) => void;
}

/**
 * Overlay that appears when user clicks Add button
 * Shows options to select Camera or Gallery
 */
const AddClipOverlay: React.FC<AddClipOverlayProps> = ({
  visible,
  onClose,
  onSelectCamera,
  onSelectGallery,
}) => {
  const handleSelectGallery = useCallback(async () => {
    // Request permission
    let permission = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permission.status !== 'granted') {
      console.warn('Media library permission not granted');
      return;
    }

    // Open gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      onClose();
      return;
    }

    const asset = result.assets[0];
    if (!asset.uri) {
      onClose();
      return;
    }

    const makeId = () =>
      `clip-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    const isVideo = asset.type === 'video';
    const duration = isVideo ? asset.duration ?? 0 : 0;

    const newClip: CameraClip = {
      id: makeId(),
      uri: asset.uri,
      duration,
      type: isVideo ? 'video' : 'photo',
      source: 'gallery',
    };

    onSelectGallery(newClip);
    onClose();
  }, [onSelectGallery, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.content} pointerEvents="box-none">
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.option}
              onPress={onSelectCamera}
              activeOpacity={0.7}
            >
              <View style={styles.optionIcon}>
                <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <Text style={styles.optionText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={handleSelectGallery}
              activeOpacity={0.7}
            >
              <View style={styles.optionIcon}>
                <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <Text style={styles.optionText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  content: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  option: {
    alignItems: 'center',
    gap: 8,
  },
  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AddClipOverlay;

