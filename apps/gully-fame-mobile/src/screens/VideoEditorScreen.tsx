


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  videoEditorService,
  EditingSession,
  VideoFilter,
  VideoText,
  VideoExportOptions,
} from "../api/services/videoEditorService";


import ModernPreviewEditor from "../modules/video-editor/camera-module/components/ModernPreviewEditor";
import type { CameraClip } from "../types/camera.types";


import SpeedSelector from "../components/ui/SpeedSelector"; 

interface VideoEditorScreenProps {
  route?: any;
  navigation?: any;
}

const { width } = Dimensions.get("window");

const VideoEditorScreen: React.FC<VideoEditorScreenProps> = ({ route, navigation }) => {
  const videoUri = route?.params?.videoUri || "";

  
  const [session, setSession] = useState<EditingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");

  
  const [clip, setClip] = useState<CameraClip>({
    id: `clip_${Date.now()}`,
    uri: videoUri,
    type: "video",
    trimStart: 0,
    trimEnd: 0,
    filterPreset: null,
    textOverlays: [],
    musicOffset: 0,
    
    speedConfig: { type: 'constant', value: 1.0 }
  });

  
  useEffect(() => {
    initializeSession();
  }, []);

  
  
  const initializeSession = async () => {
    try {
      setLoading(true);
      const response = await videoEditorService.createEditingSession(videoUri);

      if (response.success && response.data) {
        setSession(response.data);
        
        
        let videoDuration = response.data.duration || 15;
        
        
        if (videoDuration > 1000) {
          videoDuration = videoDuration / 1000;
        }

        setClip((prev) => ({
          ...prev,
          trimEnd: videoDuration,
        }));
        
        console.log("🍏 [VideoEditorScreen] Session Active! Corrected Duration:", videoDuration);
      } else {
        Alert.alert("Error", response.message || "Failed to create editing session");
      }
    } catch (error) {
      console.error("[VideoEditorScreen] Session initialization error:", error);
      Alert.alert("Error", "Failed to initialize video editor");
    } finally {
      setLoading(false);
    }
  };

  
  const handleClipUpdate = (updatedClip: CameraClip) => {
    
    console.log("🔄 UI Clicked - New Trim Data:", {
      trimStart: updatedClip.trimStart,
      trimEnd: updatedClip.trimEnd,
    });
    setClip(updatedClip);
  };

  
  const handleSpeedChange = (newSpeed: number) => {
    setClip(prev => ({
      ...prev,
      speedConfig: { type: 'constant', value: newSpeed }
    }));
  };

  
  const handleNextPipeline = async () => {
    if (!session) return;

    try {
      setProcessing(true);

      
      if (clip.trimStart > 0 || clip.trimEnd < (session.duration || 0)) {
        setProcessingMessage("Trimming your video clip...");
        await videoEditorService.trimVideo(session.id, clip.trimStart || 0, clip.trimEnd || session.duration);
      }

      
      const currentSpeed = clip.speedConfig?.value || 1.0;
      if (currentSpeed !== 1.0) {
        setProcessingMessage(`Adjusting speed to ${currentSpeed}x...`);
        
        if ((videoEditorService as any).changeVideoSpeed) {
           await (videoEditorService as any).changeVideoSpeed(session.id, currentSpeed);
        } else {
           console.warn("changeVideoSpeed method not found in videoEditorService");
        }
      }

      
      if (clip.filterPreset && clip.filterPreset.name !== "Original") {
        setProcessingMessage(`Applying ${clip.filterPreset.name} filter...`);
        const filter: VideoFilter = {
          id: clip.filterPreset.name.toLowerCase(),
          name: clip.filterPreset.name,
          type: clip.filterPreset.name.toLowerCase() as any,
          value: 100,
        };
        await videoEditorService.applyFilter(session.id, filter);
      }

      
      if (clip.textOverlays && clip.textOverlays.length > 0) {
        setProcessingMessage("Baking text overlays...");
        for (const overlay of clip.textOverlays) {
          const text: VideoText = {
            id: overlay.id,
            text: overlay.text,
            fontSize: overlay.fontSize || 24,
            color: overlay.color || "#FFFFFF",
            position: "center",
            startTime: 0,
            endTime: session.duration,
          };
          await videoEditorService.addTextOverlay(session.id, text);
        }
      }

      
      setProcessingMessage("Compiling final render...");
      const options: VideoExportOptions = {
        quality: "medium", 
        resolution: "720p", 
        format: "mp4",
      };

      const response = await videoEditorService.exportVideo(session.id, options);

      if (response.success && response.data) {
        Alert.alert("Success", "Video processed successfully!", [
          {
            text: "Perfect",
            onPress: () => {
              navigation?.navigate("ReelsScreen", {
                exportedVideoUri: response.data?.videoUri,
                musicOffset: clip.musicOffset, 
              });
            },
          },
        ]);
      } else {
        Alert.alert("Export Error", response.message || "Failed to compile modifications.");
      }
    } catch (error) {
      console.error("[VideoEditorScreen] Processing pipeline failed:", error);
      Alert.alert("Pipeline Error", "An error occurred during final render.");
    } finally {
      setProcessing(false);
      setProcessingMessage("");
    }
  };

  
  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Initializing Studio Session...</Text>
      </View>
    );
  }

  
  if (processing) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.processingText}>{processingMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {}
      <ModernPreviewEditor
        clip={clip}
        onClipUpdate={handleClipUpdate}
        onBack={() => navigation?.goBack()}
        onNext={handleNextPipeline}
        canUndo={false}
        canRedo={false}
      />

      {}
      <View style={styles.speedSelectorWrapper}>
        <SpeedSelector 
          speed={clip.speedConfig?.value || 1.0} 
          onSpeedChange={handleSpeedChange} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  processingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  
  speedSelectorWrapper: {
    position: 'absolute',
    bottom: 120, 
    left: 0,
    right: 0,
    zIndex: 100,
  }
});

export default VideoEditorScreen;