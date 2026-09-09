import React from 'react';
import { FlatList, View } from 'react-native';
import { cameraStyles } from '../styles/cameraStyles';
import type { CameraClip, CameraClipArray } from '../types/camera.types';
import ClipItem from './ClipItem';

interface ClipListProps {
  clips: CameraClipArray;
  onDeleteClip?: (id: string) => void;
  onPressClip?: (clip: CameraClip) => void;
}

/**
 * Horizontal list of captured clips shown below the camera preview.
 */
const ClipList: React.FC<ClipListProps> = ({ clips, onDeleteClip, onPressClip }) => {
  if (clips.length === 0) {
    return <View style={cameraStyles.clipListEmptySpace} />;
  }

  return (
    <View style={cameraStyles.clipListContainer}>
      <FlatList
        data={clips}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ClipItem clip={item} onDelete={onDeleteClip} onPress={onPressClip} />
        )}
      />
    </View>
  );
};

export default ClipList;


