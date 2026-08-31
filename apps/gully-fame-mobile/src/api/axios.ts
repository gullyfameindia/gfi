import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ FIXED BY KIRO: Improved error handling and network error detection
// Get base URL from env, with fallback to production server
export let BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// ✅ KIRO: Edit by kiro - Changed fallback to new production deployment URL
// ❌ OLD CODE - OLD IP FALLBACK
// if (!BASE_URL) {
//   BASE_URL = "http://103.194.228.68:3552/v1/api/";
//   console.warn(
//     "[axios] Using production server as base URL. To change, set EXPO_PUBLIC_API_BASE_URL in .env"
//   );
// }

// ✅ NEW CODE - UPDATED PRODUCTION DEPLOYMENT URL
if (!BASE_URL) {
  BASE_URL = "https://gullyfame.com/v1/api/";
  if (__DEV__) {
    console.warn(
      "[axios] Using production deployment as base URL. To change, set EXPO_PUBLIC_API_BASE_URL in .env"
    );
  }
}

const TOKEN_STORAGE_KEY = "authToken";

// ✅ KIRO: Edit by kiro - Added CORS headers and improved timeout for mobile builds
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // ✅ KIRO: Increased timeout from 30s to 60s for mobile builds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // ✅ KIRO: Added CORS headers for mobile app
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    // ✅ KIRO: Edit by kiro - Added User-Agent and X-Requested-With headers for better compatibility
    "User-Agent": "GullyFame-Mobile/1.0",
    "X-Requested-With": "XMLHttpRequest",
  },
});

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Log only in development mode
      if (__DEV__) {
        console.log("[axios] Request Details:", {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          fullURL: `${config.baseURL}${config.url}`,
          headers: {
            "Content-Type": config.headers?.["Content-Type"],
            "User-Agent": config.headers?.["User-Agent"],
            "X-Requested-With": config.headers?.["X-Requested-With"],
            Authorization: config.headers?.Authorization ? "Bearer [TOKEN]" : "None",
          },
        });
      }

      if (!config.skipAuth) {
        const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
          if (__DEV__) {
            console.log("[axios] Token attached to request");
          }
        }
      }
      return config;
    } catch (error) {
      console.warn("[axios] Failed to retrieve token:", error);
      return config;
    }
  },
  (error: AxiosError) => {
    console.error("[axios] Request error:", error.message);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (__DEV__) {
      console.log("[axios] Response Success:", {
        status: response.status,
        url: response.config.url,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _retryCount?: number;
    };

    // Retry logic for network errors (max 2 retries)
    if (!error.response && !originalRequest._retry) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      if (originalRequest._retryCount < 2) {
        originalRequest._retry = true;
        if (__DEV__) {
          console.log(
            `[axios] Retrying request (attempt ${originalRequest._retryCount}/2):`,
            originalRequest.url
          );
        }

        // Wait 1 second before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return apiClient(originalRequest);
      }
    }

    // Token Refresh Mechanism with proper error handling
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.skipAuth) {
      originalRequest._retry = true;
      try {
        // Refresh token API call
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        if (refreshToken) {
          const refreshResponse = await axios.post(
            `${BASE_URL}auth/refresh-token`,
            { refreshToken },
            { headers: { "Content-Type": "application/json" } }
          );

          if (refreshResponse.status === 200) {
            const newToken = refreshResponse.data.data?.token || refreshResponse.data.token;

            if (newToken) {
              await AsyncStorage.setItem(TOKEN_STORAGE_KEY, newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;

              if (__DEV__) {
                console.log("[axios] Token refreshed successfully");
              }
              return apiClient(originalRequest);
            }
          }
        }
      } catch (refreshError) {
        console.error("[axios] Token refresh failed:", refreshError);
        // Logout on refresh failure
        await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
        await AsyncStorage.removeItem("refreshToken");
      }
    } else if (error.response?.status === 401 && originalRequest.skipAuth) {
      // Public endpoint returned 401 - don't log out, just log a warning
      if (__DEV__) {
        console.warn("[axios] Public endpoint returned 401, but not logging out user");
      }
    }

    if (error.response?.status === 403 && __DEV__) {
      console.warn("[axios] Forbidden: Access denied");
    }

    if (error.response?.status === 404 && __DEV__) {
      console.warn("[axios] Not Found:", error.config?.url);
    }

    if (error.response?.status === 500) {
      console.error("[axios] Server Error");
    }

    // Improved network error handling
    if (!error.response) {
      // Network errors are expected when API server is down - use warning instead of error
      if (__DEV__) {
        console.warn(
          "[axios] Network Error (using fallback data):",
          error.message || "Unable to connect to server"
        );
      }

      let networkErrorMessage = "Network error: Unable to connect to server.";

      // Detailed error messages based on error type
      if (error.code === "ECONNREFUSED") {
        networkErrorMessage =
          "Cannot connect to server. The backend server may be down. Please check if the API server is running.";
      } else if (error.code === "ETIMEDOUT" || error.message?.includes("timeout")) {
        networkErrorMessage =
          "Connection timeout. The backend server is not responding. Please try again.";
      } else if (error.message?.includes("Network request failed")) {
        networkErrorMessage = "Network request failed. Please check your internet connection.";
      } else if (error.code === "ENOTFOUND") {
        networkErrorMessage =
          "Server not found. Please verify the backend URL is correct in .env file.";
      }

      return Promise.reject({
        message: networkErrorMessage,
        status: null,
        data: null,
        originalError: error,
        isNetworkError: true,
      });
    }

    const errorData = error.response?.data as any;
    return Promise.reject({
      message: errorData?.message || error.message || "An error occurred",
      status: error.response?.status || null,
      data: errorData || null,
      originalError: error,
      isNetworkError: false,
    });
  }
);

export const setAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.error("[axios] Failed to store auth token:", error);
    throw error;
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    return token;
  } catch (error) {
    console.error("[axios] Failed to retrieve auth token:", error);
    return null;
  }
};

export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error("[axios] Failed to remove auth token:", error);
    throw error;
  }
};

export default apiClient;
