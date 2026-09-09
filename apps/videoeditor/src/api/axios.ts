import axios, { AxiosInstance } from "axios";


const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "https://gullyfame.com/v1/api/";

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API Error]", error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
