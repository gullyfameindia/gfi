




export type ErrorType = 
  | "network" 
  | "api" 
  | "timeout" 
  | "unauthorized" 
  | "notfound" 
  | "validation" 
  | "unknown";

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error;
  statusCode?: number;
  timestamp: number;
  canRetry: boolean;
  shouldUseMockData: boolean;
}

export class ErrorHandler {
  


  static parseError(error: any): AppError {
    const timestamp = Date.now();

    
    if (error?.message?.includes("Network") || error?.code === "NETWORK_ERROR") {
      return {
        type: "network",
        message: "Network connection failed. Using cached/mock data.",
        originalError: error,
        timestamp,
        canRetry: true,
        shouldUseMockData: true,
      };
    }

    
    if (error?.code === "ECONNABORTED" || error?.message?.includes("timeout")) {
      return {
        type: "timeout",
        message: "Request timeout. Retrying with mock data.",
        originalError: error,
        timestamp,
        canRetry: true,
        shouldUseMockData: true,
      };
    }

    
    if (error?.response?.status) {
      const status = error.response.status;
      const statusCode = status;

      if (status === 401 || status === 403) {
        return {
          type: "unauthorized",
          message: "Authentication failed. Please login again.",
          originalError: error,
          statusCode,
          timestamp,
          canRetry: false,
          shouldUseMockData: false,
        };
      }

      if (status === 404) {
        return {
          type: "notfound",
          message: "Resource not found.",
          originalError: error,
          statusCode,
          timestamp,
          canRetry: false,
          shouldUseMockData: true,
        };
      }

      if (status === 400 || status === 422) {
        return {
          type: "validation",
          message: error?.response?.data?.message || "Invalid request data.",
          originalError: error,
          statusCode,
          timestamp,
          canRetry: false,
          shouldUseMockData: false,
        };
      }

      if (status >= 500) {
        return {
          type: "api",
          message: "Server error. Using mock data.",
          originalError: error,
          statusCode,
          timestamp,
          canRetry: true,
          shouldUseMockData: true,
        };
      }

      return {
        type: "api",
        message: error?.response?.data?.message || "API error occurred.",
        originalError: error,
        statusCode,
        timestamp,
        canRetry: true,
        shouldUseMockData: true,
      };
    }

    
    return {
      type: "unknown",
      message: "An unexpected error occurred. Using cached data.",
      originalError: error,
      timestamp,
      canRetry: true,
      shouldUseMockData: true,
    };
  }

  


  static getUserMessage(error: AppError): string {
    const messages: Record<ErrorType, string> = {
      network: "Unable to connect. Loading offline data...",
      api: "Server error. Showing cached content.",
      timeout: "Request took too long. Trying again...",
      unauthorized: "Please log in to continue.",
      notfound: "Content not found. Showing similar items.",
      validation: "Please check your input and try again.",
      unknown: "Something went wrong. Please try again.",
    };

    return messages[error.type];
  }

  


  static shouldShowRetry(error: AppError): boolean {
    return error.canRetry && 
           error.type !== "unauthorized" && 
           error.type !== "validation";
  }

  


  static logError(error: AppError, context?: string): void {
    const prefix = context ? `[${context}]` : "[Error]";
    console.warn(`${prefix} ${error.type}:`, error.message);
    if (error.originalError) {
      console.warn(`${prefix} Original Error:`, error.originalError);
    }
  }

  


  static isRecoverable(error: AppError): boolean {
    return error.shouldUseMockData || error.canRetry;
  }
}

export default ErrorHandler;
