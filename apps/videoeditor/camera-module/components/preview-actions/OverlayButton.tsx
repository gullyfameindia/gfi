import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import OverlayEditorModal from './OverlayEditorModal';

interface OverlayButtonProps {
  onPress?: () => void;
  onApplyOverlay?: (overlay: any) => void;
}

/**
 * Overlay button component for preview editor
 */
const OverlayButton: React.FC<OverlayButtonProps> = ({ onPress, onApplyOverlay }) => {
  const [showModal, setShowModal] = useState(false);

  const handleApply = (overlay: any) => {
    onApplyOverlay?.(overlay);
    onPress?.();
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)} activeOpacity={0.7}>
        <View style={styles.iconContainer}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
        <Text style={styles.label}>Overlay</Text>
      </TouchableOpacity>

      <OverlayEditorModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onApply={handleApply}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    gap: 6,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '500',
  },
});

export default OverlayButton;

