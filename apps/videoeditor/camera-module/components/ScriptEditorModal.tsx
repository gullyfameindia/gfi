import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ScriptEditorModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (script: string) => void;
  initialScript?: string;
  maxCharacters?: number;
}

const ScriptEditorModal: React.FC<ScriptEditorModalProps> = ({
  visible,
  onClose,
  onSave,
  initialScript = '',
  maxCharacters = 5000,
}) => {
  const [script, setScript] = useState(initialScript);

  const handleSave = useCallback(() => {
    onSave(script);
    onClose();
  }, [script, onSave, onClose]);

  const handleClear = useCallback(() => {
    setScript('');
  }, []);

  const characterPercentage = (script.length / maxCharacters) * 100;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <MaterialCommunityIcons name="chevron-left" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Your Script</Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Script Input */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Write your script here...</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Add your video script, dialogue, or narration..."
                placeholderTextColor="#6b7280"
                value={script}
                onChangeText={setScript}
                multiline
                maxLength={maxCharacters}
                editable={script.length < maxCharacters}
                textAlignVertical="top"
              />
            </View>

            {/* Character Counter */}
            <View style={styles.counterSection}>
              <View style={styles.counterBar}>
                <View
                  style={[
                    styles.counterFill,
                    {
                      width: `${Math.min(characterPercentage, 100)}%`,
                      backgroundColor:
                        characterPercentage > 90
                          ? '#ef4444'
                          : characterPercentage > 70
                            ? '#f97316'
                            : '#3b82f6',
                    },
                  ]}
                />
              </View>
              <Text style={styles.counterText}>
                {script.length} / {maxCharacters} characters
              </Text>
            </View>

            {/* Tips */}
            <View style={styles.tipsSection}>
              <Text style={styles.tipsTitle}>💡 Script Tips</Text>
              <View style={styles.tipItem}>
                <Text style={styles.tipText}>• Keep sentences short and punchy</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipText}>• Use line breaks for natural pauses</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipText}>• Write for your video length (e.g., 15s video = ~60 words)</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipText}>• Include natural emphasis (CAPS, underscores) for emotion</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsSection}>
              {script.length > 0 && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.clearButton]}
                  onPress={handleClear}
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={20} color="#ef4444" />
                  <Text style={styles.clearButtonText}>Clear Script</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1f2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#1f2937',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#fff',
    fontSize: 16,
    height: 200,
    textAlignVertical: 'top',
  },
  counterSection: {
    marginBottom: 24,
  },
  counterBar: {
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  counterFill: {
    height: '100%',
    borderRadius: 2,
  },
  counterText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
  },
  tipsSection: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fbbf24',
    marginBottom: 12,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#d1d5db',
    lineHeight: 18,
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    gap: 8,
  },
  clearButton: {
    borderColor: '#ef4444',
    backgroundColor: 'transparent',
  },
  clearButtonText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ScriptEditorModal;
