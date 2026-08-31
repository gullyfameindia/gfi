# Gully Fame Mobile - API Configuration & Deployment Guide

**Status**: ✅ Production Ready  
**Backend URL**: https://gullyfame.com/v1/api/  
**Last Updated**: August 2026

---

## 📋 Table of Contents

1. [API Configuration Overview](#api-configuration-overview)
2. [Centralized Base URL](#centralized-base-url)
3. [Endpoint Constants](#endpoint-constants)
4. [Service Architecture](#service-architecture)
5. [Environment Configuration](#environment-configuration)
6. [Production Deployment](#production-deployment)
7. [Error Handling](#error-handling)
8. [Security Best Practices](#security-best-practices)

---

## 🔧 API Configuration Overview

All API services in the Gully Fame mobile app use a **centralized configuration system** to manage backend URLs and endpoints. This ensures:

- ✅ Single source of truth for API configuration
- ✅ Easy switching between development and production environments
- ✅ Consistent error handling across all services
- ✅ Built-in retry logic and network error detection
- ✅ Token management and authentication

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│         Service Layer (userService, reelsService, etc)  │
├─────────────────────────────────────────────────────────┤
│            API Endpoints (endpoints.ts)                 │
│        (All endpoint constants defined here)            │
├─────────────────────────────────────────────────────────┤
│    Axios Client (axios.ts - Centralized config)         │
│  • Base URL: https://gullyfame.com/v1/api/              │
│  • Timeout: 60000ms (for large uploads)                 │
│  • Retry logic: Network errors max 2 retries            │
│  • Token management: Auto-attach JWT tokens             │
├─────────────────────────────────────────────────────────┤
│            Environment Variables (.env)                 │
│         (EXPO_PUBLIC_API_BASE_URL, etc)                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🌐 Centralized Base URL

### Configuration File
**Location**: `apps/gully-fame-mobile/src/api/axios.ts`

```typescript
// Get base URL from environment variable
export let BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// Fallback to production URL if not set
if (!BASE_URL) {
  BASE_URL = "https://gullyfame.com/v1/api/";
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,  // 60 seconds for large file uploads
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "GullyFame-Mobile/1.0",
  },
});
```

### Environment Variable Setup

**File**: `apps/gully-fame-mobile/.env`

```bash
# Production Backend URL
EXPO_PUBLIC_API_BASE_URL=https://gullyfame.com/v1/api/

# Alternative for development (if needed)
# EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/v1/api/
```

### How It Works

1. **Development**: Set `EXPO_PUBLIC_API_BASE_URL` in `.env` to point to your local or staging server
2. **Production**: Set to `https://gullyfame.com/v1/api/`
3. **Fallback**: If not set, automatically uses production URL

---

## 📍 Endpoint Constants

### Location
**File**: `apps/gully-fame-mobile/src/api/endpoints.ts`

All API endpoints are defined as constants in a single location for easy maintenance and discovery.

### Example Endpoints

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "auth/login",
    REGISTER: "auth/register",
    VERIFY_OTP: "auth/verifyOtp",
    REFRESH_TOKEN: "auth/refresh-token",
  },
  
  USER: {
    PROFILE: "user/profile",
    UPDATE_PROFILE: "user/profile",
    GET_EARNINGS: "user/earnings",
    GET_WALLET: "user/wallet",
  },
  
  REELS: {
    GET_ALL: "reels",
    GET_BY_ID: "reels/:id",
    LIKE: "reels/:id/like",
    UNLIKE: "reels/:id/unlike",
    UPLOAD: "reels/upload",
  },
  
  // ... More endpoints
};
```

### Using Endpoints in Services

```typescript
import API_ENDPOINTS, { replaceParams } from "../endpoints";

// Simple endpoint
await apiClient.get(API_ENDPOINTS.USER.PROFILE);

// Dynamic endpoint with parameters
const endpoint = replaceParams(API_ENDPOINTS.REELS.GET_BY_ID, { id: "reel123" });
await apiClient.get(endpoint);
```

---

## 🏗️ Service Architecture

### Service Pattern

Each service follows a consistent pattern:

```typescript
import apiClient from "../axios";
import { ApiResponse } from "../types";
import API_ENDPOINTS, { replaceParams } from "../endpoints";

export async function getUserProfile(): Promise<ApiResponse<User>> {
  try {
    console.log("[userService] Fetching user profile");
    
    // Use centralized endpoint constant
    const response = await apiClient.get(API_ENDPOINTS.USER.PROFILE);
    const data = response.data;
    
    return {
      success: true,
      data: data.data,
      message: data.message || "Success",
    };
  } catch (error: any) {
    console.error("[userService] Error:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch user profile",
    };
  }
}
```

### Available Services

| Service | File | Endpoints |
|---------|------|-----------|
| **Auth** | `authService.ts` | Login, Register, OTP, Tokens |
| **User** | `userService.ts` | Profile, Settings, Earnings |
| **Reels** | `reelsService.ts` | List, Upload, Like, Comment |
| **Follow** | `followService.ts` | Follow, Unfollow, Lists |
| **Comments** | `commentService.ts` | Add, Delete, Like Comments |
| **Payment** | `paymentIntegrationService.ts` | Razorpay, Wallet, Transactions |
| **KYC** | `kycService.ts` | Submit, Verify Documents |
| **Chat** | `chatService.ts` | Messages, Conversations |
| **Feed** | `feedService.ts` | Home, Trending, Popular |
| **Notifications** | `notificationService.ts` | Get, Mark as Read |

---

## ⚙️ Environment Configuration

### .env File Setup

**Location**: `apps/gully-fame-mobile/.env`

```bash
# ─────────────────────────────────────────────────────────
# API Configuration
# ─────────────────────────────────────────────────────────
EXPO_PUBLIC_API_BASE_URL=https://gullyfame.com/v1/api/
EXPO_PUBLIC_API_TIMEOUT=60000

# ─────────────────────────────────────────────────────────
# Authentication
# ─────────────────────────────────────────────────────────
EXPO_PUBLIC_TOKEN_STORAGE_KEY=authToken
EXPO_PUBLIC_REFRESH_TOKEN_KEY=refreshToken

# ─────────────────────────────────────────────────────────
# Payment Gateway
# ─────────────────────────────────────────────────────────
EXPO_PUBLIC_RAZORPAY_KEY_ID=your_key_here
EXPO_PUBLIC_RAZORPAY_KEY_SECRET=your_secret_here

# ─────────────────────────────────────────────────────────
# AWS S3 Storage
# ─────────────────────────────────────────────────────────
EXPO_PUBLIC_AWS_ACCESS_KEY_ID=your_key_here
EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY=your_secret_here
EXPO_PUBLIC_AWS_REGION=ap-south-1
EXPO_PUBLIC_AWS_S3_BUCKET=your_bucket_here

# ─────────────────────────────────────────────────────────
# Firebase Configuration (Optional)
# ─────────────────────────────────────────────────────────
EXPO_PUBLIC_FIREBASE_API_KEY=your_key_here
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_id_here

# ─────────────────────────────────────────────────────────
# Social Login
# ─────────────────────────────────────────────────────────
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_id_here
EXPO_PUBLIC_GOOGLE_CLIENT_SECRET=your_secret_here

# ─────────────────────────────────────────────────────────
# Error Tracking
# ─────────────────────────────────────────────────────────
EXPO_PUBLIC_SENTRY_DSN=your_dsn_here
EXPO_PUBLIC_SENTRY_ENABLED=true

# ─────────────────────────────────────────────────────────
# Environment
# ─────────────────────────────────────────────────────────
EXPO_PUBLIC_ENV=production
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_DEBUG_MODE=false
```

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] **API URL Configured**: Verify `EXPO_PUBLIC_API_BASE_URL=https://gullyfame.com/v1/api/`
- [ ] **SSL/HTTPS**: All API calls use HTTPS (no HTTP)
- [ ] **Credentials Secured**: Sensitive data NOT committed to repo
- [ ] **Environment Variables**: Set up in CI/CD pipeline
- [ ] **API Keys Rotated**: Use production API keys
- [ ] **Rate Limiting**: Backend configured with rate limits
- [ ] **CORS Configured**: Backend CORS allows mobile domain
- [ ] **Error Tracking**: Sentry configured for error monitoring
- [ ] **Monitoring**: Backend monitoring and logs configured
- [ ] **Load Testing**: API tested with expected traffic

### Deployment Steps

#### 1. **Set Environment Variables**

```bash
# In your CI/CD pipeline (GitHub Actions, GitLab CI, etc.)
export EXPO_PUBLIC_API_BASE_URL="https://gullyfame.com/v1/api/"
export EXPO_PUBLIC_RAZORPAY_KEY_ID="your_production_key"
export EXPO_PUBLIC_RAZORPAY_KEY_SECRET="your_production_secret"
# ... other production variables
```

#### 2. **Build for Production**

```bash
# Build for iOS
eas build --platform ios --auto-submit

# Build for Android
eas build --platform android --auto-submit
```

#### 3. **Configure Backend**

```bash
# On your backend server
export API_PORT=3000
export DATABASE_URL="your_production_db_url"
export JWT_SECRET="your_jwt_secret"
export RAZORPAY_KEY="your_razorpay_key"
# Start production server
npm run start:production
```

#### 4. **Monitor Deployment**

- Check API logs for errors
- Monitor Sentry for client errors
- Test critical user flows
- Monitor server performance metrics

---

## 🛡️ Error Handling

### Centralized Error Handling

The axios client includes built-in error handling:

```typescript
// Automatic retry for network errors (max 2 retries)
if (!error.response && !originalRequest._retry) {
  originalRequest._retry = true;
  await new Promise(resolve => setTimeout(resolve, 1000));
  return apiClient(originalRequest);
}

// Token refresh on 401
if (error.response?.status === 401 && !originalRequest._retry) {
  const newToken = await refreshToken();
  originalRequest.headers.Authorization = `Bearer ${newToken}`;
  return apiClient(originalRequest);
}

// Network error detection
if (!error.response) {
  return Promise.reject({
    message: "Network error: Unable to connect to server",
    status: null,
    isNetworkError: true,
  });
}
```

### Service Error Response

```typescript
// All services return consistent ApiResponse
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Usage
const result = await authService.login(credentials);
if (result.success) {
  console.log("Login successful", result.data);
} else {
  console.error("Login failed", result.error);
}
```

---

## 🔐 Security Best Practices

### API Security

1. **HTTPS Only**
   - All API calls use HTTPS
   - No HTTP fallback
   - Certificate pinning for sensitive endpoints

2. **Authentication**
   - JWT tokens stored in secure AsyncStorage
   - Tokens sent in Authorization header
   - Automatic token refresh on expiry
   - Token cleared on logout

3. **Rate Limiting**
   - Backend enforces rate limits
   - App handles 429 responses gracefully
   - Exponential backoff for retries

4. **Input Validation**
   - All API inputs validated on client
   - Server-side validation enforced
   - SQL injection protection

5. **Data Protection**
   - Sensitive data never logged
   - User PII protected in transit
   - Encryption for sensitive fields

### Development Security

1. **Never Commit Secrets**
   ```bash
   # Good
   EXPO_PUBLIC_API_BASE_URL=https://gullyfame.com/v1/api/
   EXPO_PUBLIC_RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}  # Use env var
   
   # Bad - NEVER DO THIS
   # EXPO_PUBLIC_RAZORPAY_KEY_SECRET="sk_live_1234567890abc"
   ```

2. **Use Environment Variables**
   - `.env` file for local development
   - CI/CD secrets for production
   - Different keys per environment

3. **Rotate Credentials**
   - Change API keys regularly
   - Revoke compromised keys immediately
   - Use short-lived tokens

---

## 📚 Quick Reference

### Making an API Call

```typescript
import { authService } from "../api/services/authService";

// Simple service call
const result = await authService.login({
  userId: "user123",
  viaPassword: true,
  password: "password123",
});

if (result.success) {
  console.log("Logged in:", result.data);
} else {
  console.error("Login error:", result.error);
}
```

### Adding a New Service

1. Create new file: `src/api/services/newService.ts`
2. Import centralized modules:
   ```typescript
   import apiClient from "../axios";
   import API_ENDPOINTS from "../endpoints";
   import { ApiResponse } from "../types";
   ```
3. Define your functions using `apiClient` and `API_ENDPOINTS`
4. Export the service

### Switching Environments

```bash
# Development (local)
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/v1/api/

# Staging
EXPO_PUBLIC_API_BASE_URL=https://staging.gullyfame.com/v1/api/

# Production
EXPO_PUBLIC_API_BASE_URL=https://gullyfame.com/v1/api/
```

---

## 🆘 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Token expired, login again |
| 404 Not Found | Endpoint URL incorrect, check API_ENDPOINTS |
| Network Error | Check internet connection, verify API server is running |
| CORS Error | Backend CORS not configured for mobile domain |
| Timeout | API server slow, increase timeout or optimize queries |
| SSL Certificate Error | Use HTTPS, disable SSL pinning in dev |

### Debug Mode

```typescript
// Enable detailed logging
if (__DEV__) {
  console.log("[apiClient] Base URL:", BASE_URL);
  console.log("[apiClient] Request:", { method, url, headers });
  console.log("[apiClient] Response:", { status, data });
}
```

---

## 📞 Support

For API integration issues:
1. Check endpoint constants in `endpoints.ts`
2. Review service implementation in `services/` directory
3. Check `.env` file configuration
4. Review axios interceptors in `axios.ts`
5. Enable debug logging in development mode

---

**Last Updated**: August 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
