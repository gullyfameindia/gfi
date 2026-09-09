import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import VoiceRecorderModal from "../VoiceRecorderModal";
import type { VoiceOverlay } from "../../types/voiceOverlay.types";

interface VoiceButtonProps {
  onPress?: () => void;
  onVoiceAdd?: (voice: VoiceOverlay) => void;
  startTime?: number;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({ onPress, onVoiceAdd, startTime = 0 }) => {
  const [showRecorder, setShowRecorder] = useState(false);

  const handleVoiceSave = (voice: VoiceOverlay) => {
    onVoiceAdd?.(voice);
    onPress?.();
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowRecorder(true)}
        activeOpacity={0.7}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"
            fill="#ffffff"
          />
          <Path
            d="M17 16.91c-1.48 1.46-3.51 2.36-5.7 2.36-2.19 0-4.22-.9-5.7-2.36M19 12h2c0 2.04-.78 3.89-2.05 5.27M5 12H3c0 2.04.78 3.89 2.05 5.27"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M12 20v-2"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <Text style={styles.buttonText}>Voice</Text>
      </TouchableOpacity>

      <VoiceRecorderModal
        visible={showRecorder}
        onClose={() => setShowRecorder(false)}
        onSave={handleVoiceSave}
        startTime={startTime}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    gap: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
  },
});

export default VoiceButton;
