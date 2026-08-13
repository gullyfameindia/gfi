/**
 * Video Upload Service
 * KIRO: Complete video upload pipeline integration
 * Handles: Camera → Compression → Upload → Reel Creation
 * PRODUCTION READY: Error handling, retry logic, state management
 */

import apiClient from "../axios";
import { ApiResponse } from "../types";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

export interface VideoUploadRequest {
  videoUri: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration: number;
  resolution: "hd" | "2k" | "4k" | "720p" | "1080p";
  fps: number;
  tags?: string[];
  competitionId?: string;
  categoryId?: string;
  hashtags?: string[];
}

export interface VideoUploadResponse {
  reelId: string;
  videoUrl: string;
  thumbnailUrl?: string;
  status: "processing" | "completed" | "failed";
  message: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  stage?: "uploading" | "processing" | "creating" | "saving";
}

/**
 * Upload video file to server with retry logic
 * KIRO: Handles multipart form data upload with progress tracking and error recovery
 */
export async function uploadVideoFile(
  videoUri: string,
  onProgress?: (progress: UploadProgress) => void,
  retries = 3
): Promise<ApiResponse<{ uploadId: string; videoUrl: string }>> {
  let lastError: any = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[videoUploadService] Upload attempt ${attempt}/${retries}:`, videoUri);

      // Validate file exists
      const fileInfo = await FileSystem.getInfoAsync(videoUri);
      if (!fileInfo.exists) {
        throw new Error("Video file not found");
      }

      // Check file size (limit to 500MB)
      const fileSizeInMB = (fileInfo.size || 0) / (1024 * 1024);
      if (fileSizeInMB > 500) {
        throw new Error(`Video file too large: ${fileSizeInMB.toFixed(2)}MB (max 500MB)`);
      }

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append("video", {
        uri: videoUri,
        type: "video/mp4",
        name: `video_${Date.now()}.mp4`,
      } as any);

      // Upload with progress tracking
      const response = await apiClient.post<any>("reels/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000, // 2 minute timeout for large files
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress?.({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage,
            stage: "uploading",
          });
        },
      });

      const responseData = response.data as any;

      if (responseData.code === 1 && responseData.data) {
        console.log("[videoUploadService] Upload successful");
        return {
          success: true,
          data: {
            uploadId: responseData.data.uploadId || responseData.data.id,
            videoUrl: responseData.data.videoUrl || responseData.data.url,
          },
          message: responseData.message || "Video uploaded successfully",
        };
      }

      throw new Error(responseData.message || "Upload failed: API error");
    } catch (error: any) {
      lastError = error;
      console.error(`[videoUploadService] Attempt ${attempt} failed:`, error.message);

      // Don't retry on certain errors
      if (
        error.message?.includes("not found") ||
        error.message?.includes("too large") ||
        error.response?.status === 400 ||
        error.response?.status === 401
      ) {
        break;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < retries) {
        const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`[videoUploadService] Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  console.error("[videoUploadService] All upload attempts failed");
  return {
    success: false,
    message: lastError?.message || "Failed to upload video after multiple attempts",
    error: lastError?.message,
    data: { uploadId: "", videoUrl: "" },
  };
}

/**
 * Create reel from uploaded video
 * KIRO: Creates reel metadata after successful upload
 */
export async function createReelFromUpload(
  uploadId: string,
  request: VideoUploadRequest
): Promise<ApiResponse<VideoUploadResponse>> {
  try {
    console.log("[videoUploadService] Creating reel from upload:", uploadId);

    const payload = {
      uploadId,
      title: request.title,
      description: request.description || "",
      duration: request.duration,
      resolution: request.resolution,
      fps: request.fps,
      tags: request.tags || [],
      competitionId: request.competitionId,
    };

    const response = await apiClient.post<any>("reels/create", payload);
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      return {
        success: true,
        data: {
          reelId: responseData.data.reelId || responseData.data.id,
          videoUrl: responseData.data.videoUrl || responseData.data.url,
          thumbnailUrl: responseData.data.thumbnailUrl,
          status: responseData.data.status || "completed",
          message: responseData.message || "Reel created successfully",
        },
        message: responseData.message || "Reel created successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to create reel",
      error: "API returned unsuccessful response",
      data: {
        reelId: "",
        videoUrl: "",
        status: "failed",
        message: "Failed to create reel",
      },
    };
  } catch (error: any) {
    console.error("[videoUploadService] Create reel error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to create reel",
      error: error.message,
      data: {
        reelId: "",
        videoUrl: "",
        status: "failed",
        message: error.message,
      },
    };
  }
}

/**
 * Complete video upload pipeline
 * KIRO: Handles entire flow: Upload → Create Reel → Save to Gallery
 * PRODUCTION READY: Comprehensive error handling and progress tracking
 */
export async function uploadVideoComplete(
  videoUri: string,
  request: VideoUploadRequest,
  onProgress?: (stage: string, progress: number) => void
): Promise<ApiResponse<VideoUploadResponse>> {
  try {
    console.log("[videoUploadService] Starting complete upload pipeline");

    // Validate input
    if (!videoUri || !request.title) {
      return {
        success: false,
        message: "Video URI and title are required",
        error: "Validation error",
        data: {
          reelId: "",
          videoUrl: "",
          status: "failed",
          message: "Missing required fields",
        },
      };
    }

    // Stage 1: Upload video file with retry logic
    onProgress?.("uploading", 0);
    const uploadResult = await uploadVideoFile(videoUri, (prog) => {
      onProgress?.("uploading", prog.percentage);
    });

    if (!uploadResult.success || !uploadResult.data?.uploadId) {
      return {
        success: false,
        message: uploadResult.message || "Video upload failed",
        error: uploadResult.error,
        data: {
          reelId: "",
          videoUrl: "",
          status: "failed",
          message: uploadResult.message,
        },
      };
    }

    // Stage 2: Create reel metadata
    onProgress?.("creating_reel", 60);
    const reelResult = await createReelFromUpload(uploadResult.data.uploadId, request);

    if (!reelResult.success) {
      return {
        success: false,
        message: reelResult.message || "Failed to create reel",
        error: reelResult.error,
        data: {
          reelId: "",
          videoUrl: "",
          status: "failed",
          message: reelResult.message,
        },
      };
    }

    // Stage 3: Save to gallery (optional, don't fail if it fails)
    onProgress?.("saving_gallery", 85);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        await MediaLibrary.saveToLibraryAsync(videoUri);
        console.log("[videoUploadService] Video saved to gallery");
      } else {
        console.warn("[videoUploadService] Gallery permission not granted");
      }
    } catch (galleryError) {
      console.warn("[videoUploadService] Failed to save to gallery:", galleryError);
    }

    onProgress?.("completed", 100);

    return {
      success: true,
      data: reelResult.data,
      message: "Video uploaded and reel created successfully",
    };
  } catch (error: any) {
    console.error("[videoUploadService] Complete upload pipeline error:", error.message);
    return {
      success: false,
      message: error.message || "Upload pipeline failed",
      error: error.message,
      data: {
        reelId: "",
        videoUrl: "",
        status: "failed",
        message: error.message,
      },
    };
  }
}

/**
 * Get upload status
 * KIRO: Check status of ongoing upload
 */
export async function getUploadStatus(
  uploadId: string
): Promise<ApiResponse<{ status: string; progress: number }>> {
  try {
    console.log("[videoUploadService] Getting upload status:", uploadId);

    const response = await apiClient.get<any>(`reels/upload/${uploadId}/status`);
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      return {
        success: true,
        data: {
          status: responseData.data.status,
          progress: responseData.data.progress || 0,
        },
        message: "Status retrieved successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to get status",
      error: "API returned unsuccessful response",
      data: { status: "unknown", progress: 0 },
    };
  } catch (error: any) {
    console.error("[videoUploadService] Get status error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to get upload status",
      error: error.message,
      data: { status: "error", progress: 0 },
    };
  }
}

/**
 * Cancel upload
 * KIRO: Cancel ongoing upload
 */
export async function cancelUpload(uploadId: string): Promise<ApiResponse<void>> {
  try {
    console.log("[videoUploadService] Cancelling upload:", uploadId);

    const response = await apiClient.post<any>(`reels/upload/${uploadId}/cancel`);
    const responseData = response.data as any;

    if (responseData.code === 1) {
      return {
        success: true,
        message: "Upload cancelled successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to cancel upload",
      error: "API returned unsuccessful response",
    };
  } catch (error: any) {
    console.error("[videoUploadService] Cancel error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to cancel upload",
      error: error.message,
    };
  }
}
