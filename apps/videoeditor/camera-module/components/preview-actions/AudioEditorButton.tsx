import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Modal, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AdvancedAudioEditor from '../AdvancedAudioEditor';
import type { AudioTrackWithEffects, AudioMixSettings } from '../../types/audioEffects.types';

interface AudioEditorButtonProps {
  onPress?: () => void;
  onUpdateTracks?: (tracks: AudioTrackWithEffects[]) => void;
  onUpdateMixSettings?: (settings: AudioMixSettings) => void;
  tracks?: AudioTrackWithEffects[];
  masterVolume?: number;
}

const AudioEditorButton: React.FC<AudioEditorButtonProps> = ({
  onPress,
  onUpdateTracks,
  onUpdateMixSettings,
  tracks = [],
  masterVolume = 1,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setModalVisible(true);
    onPress?.();
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <MaterialCommunityIcons name="music-box-multiple" size={24} color="#ec4899" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <AdvancedAudioEditor
          tracks={tracks}
          onUpdateTracks={onUpdateTracks || (() => {})}
          onUpdateMixSettings={onUpdateMixSettings || (() => {})}
          masterVolume={masterVolume}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#4b5563',
  },
});

export default AudioEditorButton;
