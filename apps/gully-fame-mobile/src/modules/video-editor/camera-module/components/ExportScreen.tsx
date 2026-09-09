import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Alert,
  Platform,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import Svg, { Path } from 'react-native-svg';
import type { CameraClip, CameraClipArray } from '../types/camera.types';
import { exportAndCombineClips } from '../utils/videoExporter';
import { uploadVideoComplete } from '../../../../api/services/videoUploadService';
import type { VideoUploadRequest } from '../../../../api/services/videoUploadService';

interface ExportScreenProps {
  clips: CameraClipArray;
  onBack: () => void;
  onComplete?: () => void;
  autoUpload?: boolean;
}

/**
 * Export screen with progress indicator, save to gallery, and backend upload
 * PRODUCTION READY: Complete upload pipeline integration
 */
const ExportScreen: React.FC<ExportScreenProps> = ({ clips, onBack, onComplete, autoUpload = false }) => {
  const [exporting, setExporting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Preparing export...');
  const [exportedUri, setExportedUri] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  // Upload form state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Request media library permission
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Media library permission not granted');
        }
      } catch (error) {
        console.warn('Permission error:', error);
      }
    };
    requestPermission();
  }, [onBack]);

  // Animate progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const calculateTotalDuration = useCallback((): number => {
    return clips.reduce((acc, clip) => acc + (clip.duration || 3), 0);
  }, [clips]);

  const handleExport = useCallback(async () => {
    if (exporting || clips.length === 0) return;

    setExporting(true);
    setProgress(0);
    setStatus('Initializing export...');
    setExportedUri(null);

    try {
      // Update progress
      setProgress(0.1);
      setStatus('Processing clips...');

      // Export and combine clips
      const outputUri = await exportAndCombineClips(
        clips,
        (currentProgress: number, currentStatus: string) => {
          setProgress(currentProgress);
          setStatus(currentStatus);
        }
      );

      setProgress(0.9);
      setStatus('Saving to gallery...');

      // Save to gallery
      if (outputUri) {
        try {
          const asset = await MediaLibrary.createAssetAsync(outputUri);
          await MediaLibrary.createAlbumAsync('Gully Fame', asset, false);
          console.log('[ExportScreen] Video saved to gallery');
        } catch (galleryError) {
          console.warn('[ExportScreen] Gallery save failed:', galleryError);
        }

        setProgress(1);
        setStatus('Export complete!');
        setExportedUri(outputUri);

        // Auto show upload form if enabled
        if (autoUpload) {
          setShowUploadForm(true);
        }
      } else {
        throw new Error('Export failed: No output file');
      }
    } catch (error: any) {
      console.error('[ExportScreen] Export error:', error);
      Alert.alert(
        'Export Failed',
        error?.message || 'An error occurred while exporting. Please try again.',
        [
          { text: 'Cancel', style: 'cancel', onPress: onBack },
          { text: 'Retry', onPress: handleExport },
        ]
      );
      setStatus('Export failed');
    } finally {
      setExporting(false);
    }
  }, [clips, exporting, onBack, autoUpload]);

  const handleUploadVideo = useCallback(async () => {
    if (!exportedUri || !title.trim()) {
      Alert.alert('Required', 'Please enter a title for your video');
      return;
    }

    if (uploading) return;

    setUploading(true);
    setUploadError(null);
    setProgress(0);
    setStatus('Uploading to server...');

    try {
      const uploadRequest: VideoUploadRequest = {
        videoUri: exportedUri,
        title: title.trim(),
        description: description.trim() || undefined,
        duration: calculateTotalDuration(),
        resolution: '1080p',
        fps: 30,
      };

      const result = await uploadVideoComplete(uploadRequest, (stage, prog) => {
        setStatus(`${stage.replace(/_/g, ' ')}...`);
        setProgress(prog / 100);
      });

      if (result.success) {
        setProgress(1);
        setStatus('Upload complete!');
        setUploadSuccess(true);

        Alert.alert(
          'Success! 🎉',
          'Your video has been uploaded successfully!',
          [
            {
              text: 'Done',
              onPress: () => {
                onComplete?.();
                onBack();
              },
            },
          ]
        );
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('[ExportScreen] Upload error:', error);
      const errorMsg = error?.message || 'Failed to upload video. Please try again.';
      setUploadError(errorMsg);
      setStatus('Upload failed');

      Alert.alert(
        'Upload Failed',
        errorMsg,
        [
          { text: 'Try Again', onPress: handleUploadVideo },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } finally {
      setUploading(false);
    }
  }, [exportedUri, title, description, uploading, calculateTotalDuration, onComplete, onBack]);

  // Auto-start export when screen loads
  useEffect(() => {
    if (clips.length > 0 && !exporting && !exportedUri) {
      handleExport();
    }
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  if (showUploadForm && exportedUri) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setShowUploadForm(false)}
              style={styles.backButton}
              disabled={uploading}
            >
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Upload Video</Text>
            <View style={styles.backButton} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.formLabel}>Title *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter video title"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              editable={!uploading}
              maxLength={100}
            />

            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textAreaInput]}
              placeholder="Add description (optional)"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              editable={!uploading}
              maxLength={500}
            />

            <Text style={styles.charCount}>{description.length}/500</Text>

            {uploadError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{uploadError}</Text>
              </View>
            )}

            {uploading && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                  <Animated.View
                    style={[styles.progressBarFill, { width: progressWidth }]}
                  />
                </View>
                <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
                <Text style={styles.statusText}>{status}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
              onPress={handleUploadVideo}
              disabled={uploading || !title.trim()}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <Text style={styles.uploadButtonText}>Upload to Gully Fame</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.skipButton, uploading && styles.skipButtonDisabled]}
              onPress={() => {
                onComplete?.();
                onBack();
              }}
              disabled={uploading}
            >
              <Text style={styles.skipButtonText}>Skip & Continue</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} disabled={exporting || uploading}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {uploadSuccess ? 'Upload Complete' : exporting ? 'Exporting' : 'Processing'}
        </Text>
        <View style={styles.backButton} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {exporting || uploading ? (
          <>
            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground}>
                <Animated.View
                  style={[styles.progressBarFill, { width: progressWidth }]}
                />
              </View>
              <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
            </View>

            {/* Status Text */}
            <Text style={styles.statusText}>{status}</Text>

            {/* Spinner */}
            <ActivityIndicator size="large" color="#ec9a15" style={styles.spinner} />
          </>
        ) : exportedUri && !uploadSuccess ? (
          <>
            <View style={styles.successContainer}>
              <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                  stroke="#4CAF50"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M22 4L12 14.01l-3-3"
                  stroke="#4CAF50"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.successTitle}>Video Exported!</Text>
              <Text style={styles.successSubtitle}>Your video is ready to share</Text>

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => setShowUploadForm(true)}
              >
                <Text style={styles.uploadButtonText}>Upload to Gully Fame</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.skipButton}
                onPress={() => {
                  onComplete?.();
                  onBack();
                }}
              >
                <Text style={styles.skipButtonText}>Skip & Continue</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : uploadSuccess ? (
          <>
            <View style={styles.successContainer}>
              <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                  stroke="#4CAF50"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M22 4L12 14.01l-3-3"
                  stroke="#4CAF50"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.successTitle}>Uploaded Successfully! 🎉</Text>
              <Text style={styles.successSubtitle}>Your video is now on Gully Fame</Text>

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => {
                  onComplete?.();
                  onBack();
                }}
              >
                <Text style={styles.uploadButtonText}>Go to Home</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.readyContainer}>
            <Text style={styles.readyText}>Ready to export</Text>
            <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
              <Text style={styles.exportButtonText}>Start Export</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 24,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ec9a15',
    borderRadius: 4,
  },
  progressText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  statusText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  spinner: {
    marginTop: 24,
  },
  successContainer: {
    alignItems: 'center',
    width: '100%',
  },
  successTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 8,
  },
  successSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  readyContainer: {
    alignItems: 'center',
  },
  readyText: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 24,
  },
  exportButton: {
    backgroundColor: '#ec9a15',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: '#ec9a15',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  exportButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  // Upload form styles
  formLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 24,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  textAreaInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  charCount: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#ff4444',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  errorText: {
    color: '#ff8888',
    fontSize: 14,
  },
  uploadButton: {
    backgroundColor: '#ec9a15',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#ec9a15',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  uploadButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  skipButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipButtonDisabled: {
    opacity: 0.5,
  },
  skipButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExportScreen;

