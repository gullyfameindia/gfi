// PATH: apps/gully-fame-mobile/src/modules/video-editor/camera-module/components/VoiceoverStudioModal.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
  SafeAreaView,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface VoiceoverStudioModalProps {
  visible: boolean;
  onClose: () => void;
  onSaveVoiceover: (audioUri: string, duration: number) => void;
  totalDuration: number;
  currentTime: number;
}

const VoiceoverStudioModal: React.FC<VoiceoverStudioModalProps> = ({
  visible,
  onClose,
  onSaveVoiceover,
  totalDuration,
  currentTime,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSeconds, setRecordingSeconds] = useState(0);
  
  // Animation state for the pulse effect on Mic hold
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording) {
      // Continuous scaling pulsing effect when holding mic
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Start recording duration timer
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      pulseAnim.setValue(1);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handlePressIn = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    console.log("🎙️ Voiceover recording started...");
  };

  const handlePressOut = () => {
    if (isRecording) {
      setIsRecording(false);
      console.log(`🎙️ Voiceover stopped. Recorded duration: ${recordedSeconds}s`);
      // Production ready mockup uri trigger
      onSaveVoiceover(`mock-audio-${Date.now()}.mp3`, recordedSeconds);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>
          
          {/* Header Row */}
          <SafeAreaView style={styles.headerRow}>
            <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
              <Text style={styles.headerBtnText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Voiceover</Text>
            <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
              <Text style={[styles.headerBtnText, { color: '#ec9a15' }]}>Done</Text>
            </TouchableOpacity>
          </SafeAreaView>

          {/* Minimal tracking visual cue zone */}
          <View style={styles.infoZone}>
            <Text style={styles.timeText}>
              {isRecording ? formatTime(recordedSeconds) : formatTime(currentTime)} / {formatTime(totalDuration)}
            </Text>
            <Text style={styles.subHint}>
              {isRecording ? "Recording audio live..." : "Move playhead to where you want to start dubbing"}
            </Text>
          </View>

          {/* Dynamic Floating Mic Interface Area */}
          <View style={styles.micInteractionArea}>
            <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }, isRecording && styles.pulseCircleActive]}>
              <TouchableOpacity
                style={[styles.mainMicButton, isRecording && styles.mainMicButtonActive]}
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                <Svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"
                    fill={isRecording ? "#FFF" : "#ff4d4d"}
                  />
                  <Path
                    d="M19 10v1a7 7 0 01-14 0v-1M12 19v4M8 23h8"
                    stroke={isRecording ? "#FFF" : "#ff4d4d"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.holdLabel}>{isRecording ? "Release to stop" : "Tap & Hold to record voiceover"}</Text>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheetContainer: {
    height: SCREEN_HEIGHT * 0.45,
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerBtn: {
    paddingVertical: 4,
  },
  headerBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoZone: {
    alignItems: 'center',
    marginTop: 20,
  },
  timeText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  subHint: {
    color: '#888',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  micInteractionArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  pulseCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 77, 77, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseCircleActive: {
    backgroundColor: 'rgba(255, 77, 77, 0.4)',
  },
  mainMicButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mainMicButtonActive: {
    backgroundColor: '#ff4d4d',
  },
  holdLabel: {
    color: '#AAA',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
  },
});

export default VoiceoverStudioModal;