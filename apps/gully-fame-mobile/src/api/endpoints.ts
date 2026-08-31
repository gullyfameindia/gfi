/**
 * API Endpoint Constants - Production Ready
 * Base URL: https://gullyfame.com/v1/api/
 * 
 * Centralized location for all API endpoints used across the mobile app.
 * All endpoints are relative to the base URL configured in axios.ts (EXPO_PUBLIC_API_BASE_URL).
 * 
 * PRODUCTION CHECKLIST:
 * ✓ All endpoints use relative URLs (no hardcoded domain)
 * ✓ Base URL configured via environment variable
 * ✓ SSL/HTTPS enforced
 * ✓ API versioning (v1/api) included in base URL
 * ✓ All service methods use these constants
 * ✓ Error handling with proper status codes
 */

export const API_ENDPOINTS = {
  // ==================== AUTH ENDPOINTS ====================
  AUTH: {
    LOGIN: "auth/login",
    REGISTER: "auth/register",
    VERIFY_OTP: "auth/verifyOtp",
    RESEND_OTP: "auth/resendOtp",
    REFRESH_TOKEN: "auth/refresh-token",
    LOGOUT: "auth/logout",
    SOCIAL_LOGIN: "auth/login/social",
    FORGOT_PASSWORD: "auth/forgot-password",
    RESET_PASSWORD: "auth/reset-password",
  },

  // ==================== USER ENDPOINTS ====================
  USER: {
    PROFILE: "user/profile",
    UPDATE_PROFILE: "user/profile",
    CHANGE_PASSWORD: "user/change-password",
    GET_COMPETITIONS: "user/competitions",
    GET_REELS: "user/reels",
    GET_FOLLOWERS: "user/followers",
    GET_FOLLOWING: "user/following",
    GET_EARNINGS: "user/earnings",
    GET_WALLET: "user/wallet",
    GET_KYC: "user/kyc",
  },

  // ==================== COMPETITION ENDPOINTS ====================
  COMPETITION: {
    GET_ALL: "competitions",
    GET_BY_ID: "competitions/:id",
    GET_BY_STATUS: "competitions/status/:status",
    JOIN: "competitions/:id/join",
    LEAVE: "competitions/:id/leave",
    GET_LEADERBOARD: "competitions/:id/leaderboard",
    GET_PARTICIPANTS: "competitions/:id/participants",
  },

  // ==================== REELS/VIDEOS ENDPOINTS ====================
  REELS: {
    GET_ALL: "reels",
    GET_BY_ID: "reels/:id",
    CREATE: "reels/create",
    UPDATE: "reels/:id/update",
    DELETE: "reels/:id/delete",
    LIKE: "reels/:id/like",
    UNLIKE: "reels/:id/unlike",
    GET_COMMENTS: "reels/:id/comments",
    ADD_COMMENT: "reels/:id/comments/add",
    DELETE_COMMENT: "reels/:id/comments/:commentId/delete",
    UPLOAD: "reels/upload",
    GET_UPLOAD_STATUS: "reels/upload/:id/status",
    CANCEL_UPLOAD: "reels/upload/:id/cancel",
  },

  // ==================== BANNER ENDPOINTS ====================
  BANNER: {
    GET_ALL: "banners",
    GET_ACTIVE: "banners/active",
  },

  // ==================== CATEGORY ENDPOINTS ====================
  CATEGORY: {
    GET_ALL: "categories",
    GET_BY_ID: "categories/:id",
  },

  // ==================== KYC ENDPOINTS ====================
  KYC: {
    SUBMIT: "kyc/submit",
    GET_STATUS: "kyc/status",
    UPDATE: "kyc/update",
  },

  // ==================== PAYMENT ENDPOINTS ====================
  PAYMENT: {
    CREATE_ORDER: "payments/create-order",
    VERIFY: "payments/verify",
    GET_HISTORY: "payments/history",
    INITIATE_RAZORPAY: "payments/razorpay/initiate",
    WEBHOOK_RAZORPAY: "payments/razorpay/webhook",
  },

  // ==================== FOLLOW ENDPOINTS ====================
  FOLLOW: {
    FOLLOW_USER: "follow/:userId",
    UNFOLLOW_USER: "unfollow/:userId",
  },

  // ==================== COMMENT ENDPOINTS ====================
  COMMENT: {
    CREATE: "comments/create",
    DELETE: "comments/:id/delete",
    UPDATE: "comments/:id/update",
  },

  // ==================== SEARCH ENDPOINTS ====================
  SEARCH: {
    SEARCH_REELS: "search/reels",
    SEARCH_USERS: "search/users",
    SEARCH_COMPETITIONS: "search/competitions",
  },

  // ==================== NOTIFICATION ENDPOINTS ====================
  NOTIFICATION: {
    GET_ALL: "notifications",
    MARK_READ: "notifications/:id/read",
    DELETE: "notifications/:id/delete",
    MARK_ALL_READ: "notifications/read-all",
  },

  // ==================== CHAT ENDPOINTS ====================
  CHAT: {
    GET_CONVERSATIONS: "chat/conversations",
    GET_MESSAGES: "chat/conversations/:id/messages",
    SEND_MESSAGE: "chat/messages/send",
    DELETE_MESSAGE: "chat/messages/:id/delete",
    MARK_READ: "chat/conversations/:id/mark-read",
  },

  // ==================== FEED ENDPOINTS ====================
  FEED: {
    GET_HOME_FEED: "feed/home",
    GET_TRENDING: "feed/trending",
    GET_FOLLOWING_FEED: "feed/following",
  },

  // ==================== BRANDING ENDPOINTS ====================
  BRANDING: {
    GET_LOGO: "branding/logo",
    GET_SPLASH: "branding/splash",
    GET_ONBOARDING: "branding/onboarding",
    GET_APP_CONFIG: "branding/config",
  },

  // ==================== ADMIN ENDPOINTS ====================
  ADMIN: {
    DASHBOARD: "admin/dashboard",
    GET_USERS: "admin/users",
    GET_REELS: "admin/reels",
    GET_REPORTS: "admin/reports",
    GET_EARNINGS: "admin/earnings",
    MODERATION: "admin/moderation",
  },

  // ==================== VIDEO EDITOR ENDPOINTS ====================
  VIDEO_EDITOR: {
    UPLOAD: "video-editor/upload",
    PROCESS: "video-editor/process",
    GET_STATUS: "video-editor/status/:id",
  },

  // ==================== MUSIC LIBRARY ENDPOINTS ====================
  MUSIC_LIBRARY: {
    LIST_AUDIO: "public/audio",
    LIST_FILTERS: "public/filters",
    LIST_STICKERS: "public/stickers",
    SEARCH_AUDIO: "public/audio/search",
  },

  // ==================== USER AUDIO ENDPOINTS ====================
  AUDIO: {
    TOGGLE_SAVE: "user/audio/:audioId/save",
    GET_SAVED: "user/audio/saved",
  },

  // ==================== CMS ENDPOINTS ====================
  CMS: {
    GET_PAGES: "cms/pages",
    GET_PAGE: "cms/pages/:slug",
    GET_TERMS: "cms/pages/terms-and-conditions",
    GET_PRIVACY: "cms/pages/privacy-policy",
  },

  // ==================== APP CONTENT ENDPOINTS ====================
  APP_CONTENT: {
    GET_HOME_SECTIONS: "app-content/home-sections",
    GET_FEATURED: "app-content/featured",
  },
} as const;

/**
 * Helper function to replace path parameters in endpoints
 * Usage: replaceParams(API_ENDPOINTS.REELS.GET_BY_ID, { id: "reel123" })
 */
export const replaceParams = (endpoint: string, params: Record<string, string | number>): string => {
  let result = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });
  return result;
};

export default API_ENDPOINTS;
