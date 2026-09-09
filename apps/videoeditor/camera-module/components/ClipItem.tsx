import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { cameraStyles } from '../styles/cameraStyles';
import type { CameraClip } from '../types/camera.types';

interface ClipItemProps {
  clip: CameraClip;
  onDelete?: (id: string) => void;
  onPress?: (clip: CameraClip) => void;
}

/**
 * Renders a single clip thumbnail for the horizontal clip list.
 * - Photos: image thumbnail.
 * - Videos: image thumbnail placeholder + "Video" badge and optional duration.
 *
 * The delete button is shown only when `onDelete` is provided.
 */
const ClipItem: React.FC<ClipItemProps> = ({ clip, onDelete, onPress }) => {
  const isVideo = clip.type === 'video';

  const handleDelete = () => {
    if (onDelete) {
      onDelete(clip.id);
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress(clip);
    }
  };

  return (
    <View style={cameraStyles.clipItemContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
      >
        <View style={cameraStyles.clipThumbnailWrapper}>
        {/* For now we use the URI directly. For videos, this could be
            swapped for a generated thumbnail when you add that feature. */}
          <Image
            source={{ uri: clip.uri }}
            style={cameraStyles.clipThumbnail}
            resizeMode="cover"
          />
          {isVideo && (
            <View style={cameraStyles.clipTypeBadge}>
              <Text style={cameraStyles.clipTypeBadgeText}>Video</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {isVideo && typeof clip.duration === 'number' && (
        <Text style={cameraStyles.clipMetaText}>
          {clip.duration.toFixed(1)}
          s
        </Text>
      )}

      {onDelete && (
        <TouchableOpacity
          style={cameraStyles.clipDeleteButton}
          onPress={handleDelete}
          accessibilityRole="button"
          accessibilityLabel="Delete clip"
        >
          <Text style={cameraStyles.clipDeleteText}>❌</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ClipItem;


