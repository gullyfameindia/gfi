/**
 * Error Messages Constants
 * Centralized error messages for consistency
 */

export const ERROR_MESSAGES = {
  // Network Errors
  NETWORK_ERROR: "Network error. Please check your internet connection.",
  TIMEOUT_ERROR: "Request timeout. Please try again.",
  SERVER_ERROR: "Server error. Please try again later.",
  NOT_FOUND: "Resource not found.",
  UNAUTHORIZED: "Unauthorized. Please login again.",
  FORBIDDEN: "You do not have permission to perform this action.",

  // Auth Errors
  INVALID_CREDENTIALS: "Invalid email or password.",
  EMAIL_ALREADY_EXISTS: "Email already registered.",
  WEAK_PASSWORD:
    "Password is too weak. Use at least 8 characters with uppercase, lowercase, and numbers.",
  OTP_INVALID: "Invalid OTP. Please try again.",
  OTP_EXPIRED: "OTP has expired. Please request a new one.",
  SESSION_EXPIRED: "Your session has expired. Please login again.",

  // Validation Errors
  REQUIRED_FIELD: "This field is required.",
  INVALID_EMAIL: "Please enter a valid email address.",
  INVALID_PHONE: "Please enter a valid phone number.",
  INVALID_URL: "Please enter a valid URL.",
  INVALID_DATE: "Please enter a valid date.",
  PASSWORDS_NOT_MATCH: "Passwords do not match.",
  MIN_LENGTH: (length: number) => `Minimum ${length} characters required.`,
  MAX_LENGTH: (length: number) => `Maximum ${length} characters allowed.`,

  // File Errors
  FILE_TOO_LARGE: "File size is too large. Maximum 10MB allowed.",
  INVALID_FILE_TYPE: "Invalid file type. Please upload a valid file.",
  FILE_UPLOAD_FAILED: "File upload failed. Please try again.",

  // Video Errors
  VIDEO_PROCESSING_FAILED: "Video processing failed. Please try again.",
  VIDEO_UPLOAD_FAILED: "Video upload failed. Please try again.",
  INVALID_VIDEO_FORMAT: "Invalid video format. Please upload MP4 or MOV.",
  VIDEO_TOO_LONG: "Video is too long. Maximum 60 seconds allowed.",

  // Payment Errors
  PAYMENT_FAILED: "Payment failed. Please try again.",
  PAYMENT_CANCELLED: "Payment was cancelled.",
  INVALID_AMOUNT: "Invalid amount. Please enter a valid amount.",
  INSUFFICIENT_BALANCE: "Insufficient balance. Please add funds.",

  // KYC Errors
  KYC_VERIFICATION_FAILED: "KYC verification failed. Please try again.",
  KYC_ALREADY_SUBMITTED: "KYC already submitted. Please wait for verification.",
  KYC_REJECTED: "KYC was rejected. Please resubmit with correct information.",
  INVALID_DOCUMENT: "Invalid document. Please upload a valid document.",

  // Competition Errors
  COMPETITION_NOT_FOUND: "Competition not found.",
  COMPETITION_FULL: "Competition is full. Cannot join.",
  ALREADY_JOINED: "You have already joined this competition.",
  COMPETITION_ENDED: "This competition has ended.",
  INVALID_ENTRY_FEE: "Insufficient balance to join this competition.",

  // Reel Errors
  REEL_NOT_FOUND: "Reel not found.",
  REEL_DELETED: "This reel has been deleted.",
  REEL_UPLOAD_FAILED: "Reel upload failed. Please try again.",

  // Comment Errors
  COMMENT_NOT_FOUND: "Comment not found.",
  COMMENT_DELETED: "This comment has been deleted.",
  COMMENT_FAILED: "Failed to post comment. Please try again.",

  // Generic Errors
  SOMETHING_WENT_WRONG: "Something went wrong. Please try again.",
  TRY_AGAIN_LATER: "Please try again later.",
  OPERATION_FAILED: "Operation failed. Please try again.",
  UNKNOWN_ERROR: "An unknown error occurred.",
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful!",
  LOGOUT_SUCCESS: "Logout successful!",
  REGISTRATION_SUCCESS: "Registration successful!",
  PROFILE_UPDATED: "Profile updated successfully!",
  PASSWORD_CHANGED: "Password changed successfully!",
  REEL_UPLOADED: "Reel uploaded successfully!",
  REEL_DELETED: "Reel deleted successfully!",
  COMMENT_POSTED: "Comment posted successfully!",
  COMMENT_DELETED: "Comment deleted successfully!",
  COMPETITION_JOINED: "Successfully joined competition!",
  COMPETITION_LEFT: "Successfully left competition!",
  PAYMENT_SUCCESS: "Payment successful!",
  KYC_SUBMITTED: "KYC submitted successfully!",
  FOLLOWED: "Successfully followed!",
  UNFOLLOWED: "Successfully unfollowed!",
} as const;

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: "Email is required.",
  PASSWORD_REQUIRED: "Password is required.",
  NAME_REQUIRED: "Name is required.",
  PHONE_REQUIRED: "Phone number is required.",
  CONFIRM_PASSWORD_REQUIRED: "Please confirm your password.",
  TERMS_REQUIRED: "Please accept the terms and conditions.",
  PRIVACY_REQUIRED: "Please accept the privacy policy.",
} as const;

export default {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_MESSAGES,
};
