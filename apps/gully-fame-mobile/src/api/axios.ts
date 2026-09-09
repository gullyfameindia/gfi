import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";



export let BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;











if (!BASE_URL) {
  BASE_URL = "https://gullyfame.com/v1/api/";
  if (__DEV__) {
    console.warn(
      "[axios] Using production deployment as base URL. To change, set EXPO_PUBLIC_API_BASE_URL in .env"
    );
  }
}

const TOKEN_STORAGE_KEY = "authToken";


const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, 
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    
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
      
      if (__DEV__) {
        console.log("[axios] 🔐 [VERIFICATION] Request Details:", {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          fullURL: `${config.baseURL}${config.url}`,
          headers: {
            "Content-Type": config.headers?.["Content-Type"],
            "User-Agent": config.headers?.["User-Agent"],
            Authorization: config.headers?.Authorization ? "Bearer [TOKEN_PRESENT]" : "None",
          },
        });
      }

      if (!config.skipAuth) {
        const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
          console.log("[axios] 🔐 [VERIFICATION] Bearer token attached to request - Token length:", token.length);
          console.log("[axios] 🔐 [VERIFICATION] Authorization header:", `Bearer ${token.substring(0, 20)}...`);
        } else {
          console.warn("[axios] 🔐 [VERIFICATION] No token found in AsyncStorage - request will be sent without auth");
        }
      } else {
        console.log("[axios] 🔐 [VERIFICATION] skipAuth=true - request will be sent without authorization header");
      }
      
      return config;
    } catch (error) {
      console.warn("[axios] 🔐 [VERIFICATION] Failed to retrieve token:", error);
      return config;
    }
  },
  (error: AxiosError) => {
    console.error("[axios] 🔐 [VERIFICATION FAILED] Request error:", error.message);
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

        
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return apiClient(originalRequest);
      }
    }

    
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.skipAuth) {
      console.log("[axios] 🔐 [VERIFICATION] Received 401 - Attempting token refresh");
      originalRequest._retry = true;
      try {
        
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        console.log("[axios] 🔐 [VERIFICATION] Refresh token available:", !!refreshToken);

        if (refreshToken) {
          console.log("[axios] 🔐 [VERIFICATION] Calling auth/refresh-token endpoint");
          const refreshResponse = await axios.post(
            `${BASE_URL}auth/refresh-token`,
            { refreshToken },
            { headers: { "Content-Type": "application/json" } }
          );

          if (refreshResponse.status === 200) {
            const newToken = refreshResponse.data.data?.token || refreshResponse.data.token;
            console.log("[axios] 🔐 [VERIFICATION] Token refresh response received - new token available:", !!newToken);

            if (newToken) {
              await AsyncStorage.setItem(TOKEN_STORAGE_KEY, newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              console.log("[axios] ✅ [VERIFICATION] Token refreshed successfully - new token length:", newToken.length);
              console.log("[axios] 🔐 [VERIFICATION] Retrying original request with new token");
              return apiClient(originalRequest);
            }
          }
        } else {
          console.warn("[axios] 🔐 [VERIFICATION] No refresh token available - user will be logged out");
        }
      } catch (refreshError) {
        console.error("[axios] ❌ [VERIFICATION FAILED] Token refresh failed:", refreshError);
        
        await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
        await AsyncStorage.removeItem("refreshToken");
        console.log("[axios] 🔐 [VERIFICATION] Auth tokens cleared - user logged out");
      }
    } else if (error.response?.status === 401 && originalRequest.skipAuth) {
      
      console.warn("[axios] 🔐 [VERIFICATION] Public endpoint returned 401 - no logout required");
    } else if (error.response?.status === 403) {
      console.warn("[axios] 🔐 [VERIFICATION] Forbidden (403): Access denied to this resource");
    }

    if (error.response?.status === 404 && __DEV__) {
      console.warn("[axios] Not Found:", error.config?.url);
    }

    if (error.response?.status === 500) {
      console.error("[axios] Server Error");
    }

    
    if (!error.response) {
      
      if (__DEV__) {
        console.warn(
          "[axios] Network Error (using fallback data):",
          error.message || "Unable to connect to server"
        );
      }

      let networkErrorMessage = "Network error: Unable to connect to server.";

      
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
