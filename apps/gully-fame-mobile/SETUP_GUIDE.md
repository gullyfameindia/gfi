``# 🚀 Gully Fame Mobile - API Setup Guide

**Quick Start Guide for Production Deployment**

---

## 📋 Quick Navigation

| Document | Purpose |
|----------|---------|
| **[API_CONFIGURATION.md](./API_CONFIGURATION.md)** | Complete API setup, architecture, and deployment guide |
| **[.env](./.env)** | Production environment configuration (copy this to your CI/CD) |
| **[src/api/axios.ts](./src/api/axios.ts)** | HTTP client with centralized base URL configuration |
| **[src/api/endpoints.ts](./src/api/endpoints.ts)** | All API endpoint constants in one place |
| **[src/api/services/](./src/api/services/)** | Individual service files for each API domain |

---

## 🎯 What Changed?

### Before (Old Setup)
```typescript
❌ Hardcoded URLs scattered in services
❌ Mixed HTTP and HTTPS
❌ Hardcoded IP addresses
❌ Difficult to switch environments
❌ No centralized configuration
```

### After (New Setup)
```typescript
✅ Centralized base URL: https://gullyfame.com/v1/api/
✅ All HTTPS for security
✅ Single environment variable to change
✅ Easy to switch dev/staging/prod
✅ One configuration file controls all APIs
```

---

## ⚡ 5-Minute Setup

### Step 1: Copy Environment File

```bash
# The .env file is already configured for production
# Ensure it's in: apps/gully-fame-mobile/.env

cat apps/gully-fame-mobile/.env
# Should show: EXPO_PUBLIC_API_BASE_URL=https://gullyfame.com/v1/api/
```

### Step 2: Verify Base URL

```typescript
// In any service, the base URL is automatically:
import apiClient from './src/api/axios';
console.log(apiClient.defaults.baseURL);
// Output: https://gullyfame.com/v1/api/
```

### Step 3: Use Services

```typescript
import { authService } from './src/api/services/authService';

// This will automatically call:
// https://gullyfame.com/v1/api/auth/login
const result = await authService.login(credentials);
```

### Step 4: Deploy

```bash
eas build --platform ios --auto-submit
eas build --platform android --auto-submit
```

---

## 📁 Key Files Explained

### `.env` - Configuration Hub
**What**: All production configuration in one file  
**Location**: `apps/gully-fame-mobile/.env`  
**Edit**: Update API keys and sensitive data here only  
**Deploy**: Set these as environment variables in CI/CD

```bash
# The most important line:
EXPO_PUBLIC_API_BASE_URL=https://gullyfame.com/v1/api/
```

### `src/api/axios.ts` - HTTP Client
**What**: Centralized HTTP client with interceptors  
**Key Features**:
- Base URL from environment variable
- Automatic token attachment
- Request retry logic
- Error handling
- Network detection

### `src/api/endpoints.ts` - Endpoint Constants
**What**: All API endpoint paths defined here  
**Example**:
```typescript
API_ENDPOINTS.AUTH.LOGIN       // "auth/login"
API_ENDPOINTS.USER.PROFILE     // "user/profile"
API_ENDPOINTS.REELS.UPLOAD     // "reels/upload"
```

### `src/api/services/` - Service Layer
**What**: Individual services for each domain  
**Examples**:
- `authService.ts` - Login, register, OTP
- `userService.ts` - Profile, earnings, wallet
- `reelsService.ts` - List, upload, like, comment
- `paymentIntegrationService.ts` - Payments, wallet
- `kycService.ts` - KYC verification
- ... and 15+ more

---

## 🔄 How It Works (Architecture)

```
┌─────────────────────────────────────┐
│    Mobile App Screens               │
│ (Login, Feed, Profile, etc)         │
└────────────────┬────────────────────┘
                 │
┌─────────────────▼────────────────────┐
│    Service Layer                     │
│ (authService, reelsService, etc)     │
│                                      │
│ Uses: API_ENDPOINTS constants        │
└────────────────┬────────────────────┘
                 │
┌─────────────────▼────────────────────┐
│    HTTP Client (axios.ts)            │
│                                      │
│  BASE_URL: https://gullyfame.com    │
│            /v1/api/                  │
│                                      │
│  Features:                           │
│  • Auto token attachment             │
│  • Request retry (2x)                │
│  • Error handling                    │
│  • Network detection                 │
└────────────────┬────────────────────┘
                 │
┌─────────────────▼────────────────────┐
│    Backend API                       │
│    https://gullyfame.com/v1/api/     │
│                                      │
│    Endpoints:                        │
│    /auth/login                       │
│    /user/profile                     │
│    /reels/upload                     │
│    /payment/verify                   │
│    ... and more                      │
└──────────────────────────────────────┘
```

---

## 🔐 Security Features

### ✅ Already Configured

1. **HTTPS Only**
   - All URLs use HTTPS
   - No HTTP fallback

2. **Token Management**
   - Secure storage in AsyncStorage
   - Automatic attachment to requests
   - Refresh on expiry

3. **Error Handling**
   - Network errors detected
   - Automatic retry with backoff
   - User-friendly messages

4. **Environment Variables**
   - API keys from .env
   - Secrets in CI/CD
   - Never hardcoded

---

## 🧪 Testing Your Setup

### Test 1: Verify Base URL

```typescript
import apiClient from './src/api/axios';

if (apiClient.defaults.baseURL === 'https://gullyfame.com/v1/api/') {
  console.log('✅ Base URL correct');
} else {
  console.error('❌ Base URL incorrect:', apiClient.defaults.baseURL);
}
```

### Test 2: Test API Call

```typescript
import { authService } from './src/api/services/authService';

const result = await authService.login({
  userId: 'test@example.com',
  viaPassword: true,
  password: 'test123'
});

console.log('API Response:', result);
// Should show success or error message
```

### Test 3: Check Endpoints

```typescript
import API_ENDPOINTS from './src/api/endpoints';

console.log('Auth endpoints:', API_ENDPOINTS.AUTH);
// Should output all auth endpoints
```

---

## 📊 Services Overview

| Service | File | Main Endpoints |
|---------|------|----------------|
| **Auth** | `authService.ts` | login, register, verifyOtp, refreshToken |
| **User** | `userService.ts` | profile, earnings, wallet, kyc |
| **Reels** | `reelsService.ts` | list, upload, like, comment |
| **Follow** | `followService.ts` | follow, unfollow, followers, following |
| **Comments** | `commentService.ts` | add, delete, like, reply |
| **Feed** | `feedService.ts` | trending, popular, forYou, saved |
| **Payment** | `paymentIntegrationService.ts` | order, verify, wallet, history |
| **KYC** | `kycService.ts` | submit, status, upload, verify |
| **Chat** | `chatService.ts` | conversations, messages, send |
| **Category** | `categoryService.ts` | list, get |
| **Notifications** | `notificationService.ts` | get, mark read, send |
| **Video** | `videoUploadService.ts` | upload, create, process |

---

## 🚀 Deployment Process

### Development
```bash
# Set local .env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/v1/api/

# Run app
npm run start
```

### Staging
```bash
# Set staging .env
EXPO_PUBLIC_API_BASE_URL=https://staging.gullyfame.com/v1/api/

# Build for staging
eas build --platform ios
```

### Production
```bash
# Set production .env (in CI/CD)
EXPO_PUBLIC_API_BASE_URL=https://gullyfame.com/v1/api/

# Build for production
eas build --platform ios --auto-submit
eas build --platform android --auto-submit
```

---

## 🆘 Troubleshooting

### Issue: API calls return 404

**Solution**: 
1. Check endpoint exists in `API_ENDPOINTS`
2. Verify backend route matches
3. Check base URL is correct

```typescript
import API_ENDPOINTS from './src/api/endpoints';
console.log(API_ENDPOINTS.USER.PROFILE);  // Should show "user/profile"
```

### Issue: Getting network errors

**Solution**:
1. Check `EXPO_PUBLIC_API_BASE_URL` is set
2. Verify backend is running
3. Check internet connection

```typescript
import apiClient from './src/api/axios';
console.log('Base URL:', apiClient.defaults.baseURL);
```

### Issue: Tokens not being attached

**Solution**:
1. Ensure token is in AsyncStorage
2. Check token key matches (authToken)
3. Verify token hasn't expired

### Issue: CORS errors

**Solution**:
1. Backend must have CORS configured
2. Frontend domain must be whitelisted
3. Use proper headers

---

## 📚 Additional Resources

### Complete Documentation
- **[API_CONFIGURATION.md](./API_CONFIGURATION.md)** - Full setup guide with examples

### Code Examples
- **[authService.ts](./src/api/services/authService.ts)** - Service pattern example
- **[reelsService.ts](./src/api/services/reelsService.ts)** - Complex service example

### Configuration Files
- **[.env](./.env)** - All environment variables
- **[axios.ts](./src/api/axios.ts)** - HTTP client setup
- **[endpoints.ts](./src/api/endpoints.ts)** - All endpoint constants

---

## 📞 Quick Reference

### Using a Service

```typescript
import { userService } from './src/api/services/userService';

// Call service method
const result = await userService.getCurrentUser();

// Check result
if (result.success) {
  console.log('User:', result.data);
} else {
  console.error('Error:', result.error);
}
```

### Using an Endpoint

```typescript
import API_ENDPOINTS, { replaceParams } from './src/api/endpoints';

// Get constant
const endpoint = API_ENDPOINTS.REELS.GET_BY_ID;

// Replace dynamic params
const fullEndpoint = replaceParams(endpoint, { id: 'reel123' });

// Use in API call
import apiClient from './src/api/axios';
const response = await apiClient.get(fullEndpoint);
```

### Changing Backend URL

```bash
# Only one place to change:
# File: apps/gully-fame-mobile/.env

# Line:
EXPO_PUBLIC_API_BASE_URL=https://your-new-backend.com/v1/api/

# That's it! All API calls will use the new URL.
```

---

## ✅ Production Checklist

- [ ] `.env` file has correct `EXPO_PUBLIC_API_BASE_URL`
- [ ] All API keys are set in CI/CD secrets
- [ ] Backend is running on `https://gullyfame.com`
- [ ] CORS is configured on backend
- [ ] Rate limiting is enabled
- [ ] Monitoring/Sentry is set up
- [ ] All tests pass
- [ ] App builds successfully
- [ ] QA sign-off obtained
- [ ] Ready for deployment

---

## 🎉 You're Ready!

Your Gully Fame Mobile app is now:
- ✅ Configured for production
- ✅ Using centralized API configuration
- ✅ Connected to gullyfame.com backend
- ✅ Secure and optimized
- ✅ Ready for deployment

**Next Steps**:
1. Review [API_CONFIGURATION.md](./API_CONFIGURATION.md)
2. Set up CI/CD environment variables
3. Build and test the app
4. Deploy to App Store / Play Store

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: August 26, 2026
