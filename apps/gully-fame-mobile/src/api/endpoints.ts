export const API_ENDPOINTS = {
  // Auth Endpoints
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

  // User Endpoints
  USER: {
    PROFILE: "user/profile",
    UPDATE_PROFILE: "user/profile",
    CHANGE_PASSWORD: "user/change-password",
    GET_COMPETITIONS: "user/competitions",
    GET_REELS: "user/reels",
    GET_FOLLOWERS: "user/followers/:userId",
    GET_FOLLOWING: "user/following/:userId",
    GET_EARNINGS: "user/earnings",
    GET_WALLET: "user/wallet",
    WALLET_RECHARGE: "user/wallet/recharge",
    GET_KYC: "user/kyc",
    HOME_SCREEN: "user/homeScreen",
    PROGRESS: "user/progress",
    DAILY_MISSION: "user/daily-mission",
  },

  // Competition Endpoints
  COMPETITION: {
    GET_ALL: "user/competitions",
    GET_BY_ID: "competitions/:id",
    GET_BY_STATUS: "competitions/status/:status",
    JOIN: "competitions/:id/join",
    INVITE: "competitions/:id/invite",
    LEAVE: "competitions/:id/leave",
    GET_LEADERBOARD: "competitions/:id/leaderboard",
    GET_REELS: "competitions/:id/reels",
    GET_PARTICIPANTS: "competitions/:id/participants",
  },

  // Reels Endpoints
  REELS: {
    GET_ALL: "reels",
    GET_BY_ID: "reels/:id",
    GET_BY_USER: "user/:userId/reels",
    CREATE: "reels/create",
    UPDATE: "reels/:id/update",
    DELETE: "reels/:id/delete",
    ACTION: "reels/:id/action",
    LIKE: "reels/:id/action",
    UNLIKE: "reels/:id/action",
    GET_COMMENTS: "reels/:id/comments",
    ADD_COMMENT: "reels/:id/comments",
    DELETE_COMMENT: "reels/comments/:commentId",
    GET_UPLOAD_URL: "reels/upload-url",
    PUBLISH: "reels/publish",
    DRAFT: "reels/draft",
    AUTO_CAPTION: "reels/auto-caption",
    TIP: "reels/:id/tip",
    EXPORT: "reels/:id/export",
    EXPORT_STATUS: "reels/:id/export/status",
    GET_UPLOAD_STATUS: "reels/upload/:id/status",
    CANCEL_UPLOAD: "reels/upload/:id/cancel",
  },

  // Banner Endpoints
  BANNER: {
    GET_ALL: "banners",
    GET_ACTIVE: "banners/active",
  },

  // Category Endpoints
  CATEGORY: {
    GET_ALL: "user/categories",
    GET_BY_ID: "categories/:id",
  },

  // KYC Endpoints
  KYC: {
    SUBMIT: "user/kyc",
    GET_STATUS: "user/kyc",
    UPDATE: "user/kyc",
  },

  // Payment Endpoints
  PAYMENT: {
    CREATE_ORDER: "payments/create-order",
    VERIFY: "payments/verify",
    GET_HISTORY: "payments/history",
    INITIATE_RAZORPAY: "payments/razorpay/initiate",
    WEBHOOK_RAZORPAY: "payments/razorpay/webhook",
  },

  // Follow Endpoints
  FOLLOW: {
    FOLLOW_USER: "user/:userId/follow",
    UNFOLLOW_USER: "user/:userId/follow",
  },

  // Comments Endpoints
  COMMENT: {
    CREATE: "reels/:id/comments",
    DELETE: "reels/comments/:id",
    UPDATE: "comments/:id/update",
  },

  // Search Endpoints
  SEARCH: {
    SEARCH_ALL: "search",
    SEARCH_REELS: "search",
    SEARCH_USERS: "search",
    SEARCH_COMPETITIONS: "search",
  },

  // Notification Endpoints
  NOTIFICATION: {
    GET_ALL: "notification/notification",
    MARK_READ: "notification/:id/read",
    DELETE: "notification/:id/delete",
    MARK_ALL_READ: "notification/read-all",
  },

  // Chat Endpoints
  CHAT: {
    GET_CONVERSATIONS: "chat/chatlist",
    GET_MESSAGES: "chat/chatDetails",
    SEND_MESSAGE: "chat/sendChat",
    DELETE_MESSAGE: "chat/message/delete",
    MARK_READ: "chat/read",
    TOGGLE_REACT: "chat/message/:id/react",
    ARCHIVE: "chat/archive",
  },

  // Feed Endpoints
  FEED: {
    GET_HOME_FEED: "user/homeScreen",
    GET_TRENDING: "reels",
    GET_FOLLOWING_FEED: "reels",
    GET_MATRIX: "feed/matrix",
  },

  // App Branding Endpoints
  BRANDING: {
    GET_LOGO: "public/logo",
    GET_SPLASH: "public/splash",
    GET_ONBOARDING: "branding/onboarding",
    GET_APP_CONFIG: "branding/config",
  },

  // Admin Endpoints
  ADMIN: {
    DASHBOARD: "admin/dashboard",
    GET_USERS: "admin/users",
    GET_REELS: "admin/reels",
    GET_REPORTS: "admin/reports",
    GET_EARNINGS: "admin/earnings",
    MODERATION: "admin/moderation",
  },

  // Video Editor Endpoints
  VIDEO_EDITOR: {
    UPLOAD: "video-editor/upload",
    PROCESS: "video-editor/process",
    GET_STATUS: "video-editor/status/:id",
  },

  // Music/Audio Library Endpoints
  MUSIC_LIBRARY: {
    LIST_AUDIO: "public/audio",
    LIST_FILTERS: "public/filters",
    LIST_STICKERS: "public/stickers",
    LIST_SOUNDFX: "public/soundfx",
    SEARCH_AUDIO: "public/audio/search",
  },

  // Audio Endpoints
  AUDIO: {
    TOGGLE_SAVE: "user/audio/:audioId/save",
    GET_SAVED: "user/audio/saved",
  },

  // CMS Endpoints
  CMS: {
    GET_PAGES: "public/aboutUs",
    GET_PAGE: "public/:slug",
    GET_TERMS: "public/termAndCondition",
    GET_PRIVACY: "public/privacyPolicy",
    GET_ABOUT: "public/aboutUs",
    GET_RULES: "public/competitionRules",
  },

  // App Content Endpoints
  APP_CONTENT: {
    GET_HOME_SECTIONS: "user/homeScreen",
    GET_FEATURED: "user/homeScreen",
  },
} as const;

export const replaceParams = (endpoint: string, params: Record<string, string | number>): string => {
  let result = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });
  return result;
};

export default API_ENDPOINTS;
