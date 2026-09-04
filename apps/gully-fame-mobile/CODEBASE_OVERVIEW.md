# GullyFame Mobile App - Complete Codebase Overview

**Version:** 1.0 | **Date:** Sept 3, 2026 | **Framework:** React Native (Expo 54) | **Language:** TypeScript

---

## 📋 Quick Facts

- **Type:** Short-form video platform (TikTok-like)
- **Tech Stack:** React Native + Expo Router + Redux Toolkit + React Query
- **Backend:** REST API at `https://gullyfame.com/v1/api/`
- **Features:** 10+ core features (Reels, Chat, Competitions, Payments, etc.)
- **Status:** Production-ready with known issues in progress

---

## 🏗 Project Structure

```
gully-fame-mobile/
├── app/                          # Expo Router (file-based routing)
│   ├── (main)/                   # Main app screens
│   │   ├── home/                 # Feed (trending, for-you, popular)
│   │   ├── reel/[id]/            # Reel viewer & comments
│   │   ├── profile/[id]/         # User profile
│   │   ├── upload/               # Video editor & upload
│   │   ├── chat/                 # Messaging
│   │   ├── search/               # Search UI
│   │   ├── competitions/         # Competitions & leaderboards
│   │   ├── settings/             # Preferences & account
│   │   └── ...                   # 15+ other screens
│   ├── auth/                     # Login, register, OTP, splash
│   └── onboarding/               # Initial walkthrough
│
├── src/                          # Core application code
│   ├── api/
│   │   ├── axios.ts              # HTTP client + interceptors (auto token refresh)
│   │   ├── endpoints.ts          # 50+ API endpoint definitions
│   │   └── services/             # 15 service modules (auth, reels, chat, etc.)
│   ├── components/               # 40+ reusable React components
│   ├── contexts/                 # Auth, UserRole, Branding, Reels, Competitions
│   ├── hooks/                    # 10+ custom hooks (useFetch, useUserReels, etc.)
│   ├── store/                    # Redux slices (user, reels, UI state)
│   ├── types/                    # TypeScript interfaces & types
│   ├── utils/                    # Helper functions
│   └── assets/                   # Images, fonts, icons
│
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── tailwind.config.js            # NativeWind (Tailwind for React Native)
```

---

## 🎯 Core Features

| Feature | Status | Purpose |
|---------|--------|---------|
| **Reels/Videos** | ✅ Complete | Short-form video feed (trending, for-you, popular, saved) |
| **Profile** | ✅ Complete | User profile, followers, earnings, KYC |
| **Chat** | ✅ Complete | Real-time messaging with Socket.io |
| **Competitions** | ✅ Complete | Contests with leaderboards and prizes |
| **Notifications** | ✅ Complete | Push & in-app notifications with preferences |
| **Payments** | ✅ Complete | Coin purchases via Razorpay |
| **Audio Library** | ✅ Complete | Music/effects for video creation |
| **Search** | ✅ Complete | Cross-search (users, reels, competitions) |
| **Upload** | 🔧 In Progress | Video + S3 presigned URLs (fixes applied) |
| **Following** | ✅ Complete | Follow/unfollow, follower lists |

---

## 🔌 Tech Stack

### Frontend
- **React Native 0.81** + **Expo 54** (managed service)
- **TypeScript 5.9** (strict mode)
- **Expo Router 6.0** (file-based routing, like Next.js)
- **NativeWind 4.2** (Tailwind CSS for React Native)
- **React 19.1** with Hooks

### State Management
- **Redux Toolkit 2.9** (core state)
- **React Query 5.90** (data fetching & caching)
- **Zustand 5.0** (alternative store)
- **React Context** (Auth, Branding, Reels)

### Media & Camera
- **Expo AV** (audio/video playback)
- **Expo Camera 17** (camera access)
- **Vision Camera 5.0** (advanced camera features)
- **Expo Image Manipulator** (image processing)

### Networking
- **Axios 1.12** (HTTP with interceptors, auto-retry)
- **Socket.io 4.8** (real-time chat)
- **AWS S3** (presigned URLs for video upload)

### Payments
- **Razorpay 2.3** (payment processing)

### Security & Storage
- **Expo Secure Store 15** (token storage)
- **AsyncStorage 2.2** (local data)
- **JWT** (Bearer token auth)

---

## 📡 API Integration

### Base Configuration
```
Production: https://gullyfame.com/v1/api/
Timeout: 60 seconds per request
Retry: 2 automatic retries on network errors
Auth: Bearer token (JWT) auto-attached to all requests
```

### Request/Response Flow
1. **Interceptor (Request):** Adds Bearer token from AsyncStorage
2. **Call:** Sends request with automatic retry on failure
3. **Interceptor (Response):** 
   - On 401: Auto-refresh token, retry request
   - On other errors: Log and return error
4. **Component:** Subscribes to Redux/Query cache for updates

### Key Endpoints (50+)
- **Auth:** Login, register, OTP, refresh, social login
- **User:** Profile, followers, competitions, earnings, wallet
- **Reels:** CRUD, likes, comments, feed (trending/for-you), upload
- **Chat:** Messages, conversations, real-time updates
- **Notifications:** Fetch, preferences, mark read
- **Payments:** Orders, verify, history
- **Competitions:** Join, leaderboard, participants
- **Categories, Music, KYC, Search:** Domain-specific endpoints

---

## 🔐 Authentication Flow

```
1. User logs in (email/password or social OAuth)
2. Backend returns { authToken, refreshToken }
3. Tokens stored in AsyncStorage (secure)
4. Axios adds "Authorization: Bearer {authToken}" to all requests
5. On 401 Unauthorized:
   - Auto-call auth/refresh-token with refreshToken
   - Store new token
   - Retry original request
6. On refresh failure:
   - Clear tokens
   - Redirect to login screen
```

---

## 🎨 Navigation Structure

### Bottom Tab Navigation (5 Tabs)
```
Home → Search → Camera (Upload) → Inbox (Chat) → Profile
```

### Key Routes
- `/` → Splash screen (handles routing)
- `/auth/login` → Login
- `/auth/register` → Sign up
- `/auth/otp` → OTP verification
- `/(main)/home` → Main feed
- `/(main)/reel/[id]` → Video detail + comments
- `/(main)/profile/[id]` → User profile
- `/(main)/upload` → Video editor
- `/(main)/chat/[conversationId]` → Messages
- `/(main)/competitions` → Contests list
- 15+ other screens

---

## 📊 State Management Pattern

### Redux Slices
```
store/
├── slices/
│   ├── userSlice.ts         # User auth, profile, followers
│   ├── reelsSlice.ts        # Reel feed, liked reels
│   ├── competitionsSlice.ts # Competition data
│   └── uiSlice.ts           # Loading, errors, modals
└── store.ts                 # Redux store config
```

### Data Flow Example (Load Reels)
```
Component renders
  ↓
Calls feedService.getTrendingReels()
  ↓
Axios adds token, sends GET request
  ↓
Backend returns { reels: [...] }
  ↓
Redux stores in reelsSlice.feed
  ↓
Component subscribes to store, re-renders with data
```

---

## 🎬 Video Upload Flow (Recently Fixed)

### Current Correct Flow
```
1. User selects video on Upload screen
2. Call POST /reels/upload-url { fileName, fileType }
   → Returns { uploadUrl, uploadId } ← or { video_url } (being verified)
3. Stream upload to presigned S3 URL
   PUT <uploadUrl> with binary video data
4. Call POST /reels/publish {
     video_url: "https://s3.../video.mp4",
     caption: "...",
     thumbnail: "...",
     hashtags: [...],
     ... (other metadata)
   }
5. Backend publishes reel (status: "published")
6. Navigate to profile to view reel
7. Profile calls GET /user/reels (returns published reel)
```

### Issues Fixed
- ✅ ResizeMode import (expo-av instead of expo-video)
- ✅ Presigned URL flow (instead of direct POST)
- ✅ Memory optimization (streaming upload instead of base64)
- ✅ Native modules (Audio from expo-av, Device try-catch)
- ✅ TypeScript errors (Video → AVVideo, error typing, undefined access)

### Known Issues (Pending)
- 🔧 Profile route after upload (lands on wrong screen)
- 🔧 getUserReels endpoint (not returning published reel)
- 🔧 Upload response field verification (uploadId vs video_url)

---

## 🧩 Key Services

| Service | Responsibility |
|---------|-----------------|
| `authService` | Login, register, OTP, token refresh |
| `reelsService` | Video CRUD, likes, comments, publish |
| `videoUploadService` | Presigned URLs, S3 upload, progress |
| `feedService` | Trending, for-you, popular, saved feeds |
| `chatService` | Messages, conversations, mark read |
| `userService` | Profile, followers, earnings, KYC |
| `competitionService` | Join, leaderboard, participants |
| `paymentService` | Razorpay orders, coin purchases |
| `notificationIntegrationService` | Push registration, device tokens |
| `socketChatService` | WebSocket real-time chat |

---

## 🎣 Custom Hooks

| Hook | Purpose |
|------|---------|
| `useFetch` | Generic data fetching with caching |
| `useUserReels` | Fetch user's reel collection |
| `useHomeScreen` | Home feed logic & data |
| `useFollowStats` | Follower statistics |
| `useAudioLibrary` | Audio library operations |
| `useAsync` | Async operation wrapper |
| `profileHooks` | Profile-related operations |

---

## 🔧 Common Development Tasks

### Add a New Screen
```
1. Create file: app/(main)/newscreen/page.tsx
2. Implement component with Expo Router routing
3. Add route to navigation menu
4. Link from bottom nav or parent screen
```

### Add a New API Endpoint
```
1. Define in src/api/endpoints.ts: { NEW_ENDPOINT: 'path/...' }
2. Create method in relevant service (e.g., src/api/services/...)
3. Call service from component
4. Handle response in Redux or React Query
5. Update component to display data
```

### Add State to Redux
```
1. Create/update slice in src/store/slices/
2. Define state shape, reducers, actions
3. Configure in store.ts
4. Connect component with useSelector/useDispatch
```

---

## ⚙️ Build & Deploy

### Development
```bash
npm run dev          # Start Expo dev server
# or use EAS for preview builds
```

### Production Build
```bash
eas build --platform ios       # iOS release build
eas build --platform android   # Android release build
eas submit --platform ios      # Submit to App Store
```

### Configuration
- `app.json` - App metadata, version, permissions
- `eas.json` - EAS build profiles (development, preview, production)
- `.env.example` - Environment variables template
- `package.json` - Dependencies and scripts

---

## 📈 Performance Considerations

- **Image Optimization:** Expo Image component auto-optimizes rendering
- **Lazy Loading:** Reels feed paginated with infinite scroll
- **Memory:** Video upload uses streaming (not base64 in memory)
- **Animations:** Reanimated 4 for smooth 60fps animations
- **Caching:** React Query + Redux for automatic cache management
- **Code Splitting:** File-based routing auto-splits code per screen

---

## 🐛 Known Issues & Roadmap

### Current (In Progress)
- Profile route mismatch after upload (wrong screen rendered)
- getUserReels endpoint (not returning published reels)
- Upload response field verification (correct field name unclear)

### Completed (This Session)
- ✅ ResizeMode import (expo-av)
- ✅ Video upload flow (presigned URLs + S3)
- ✅ Native module errors (expo-device, expo-audio)
- ✅ TypeScript compilation errors

### Backlog
- Offline mode enhancement
- Video editor SDK validation
- Advanced error recovery
- Performance profiling

---

## 📚 Key Files Reference

```
Core API Setup:
  src/api/axios.ts              # HTTP client + interceptors
  src/api/endpoints.ts          # Endpoint definitions

Authentication:
  src/api/services/authService.ts
  src/contexts/AuthContext.tsx

Video Upload (Recently Fixed):
  src/api/services/videoUploadService.ts
  app/(main)/upload/post.tsx

Profile & Reels:
  src/hooks/useUserReels.ts     # ← Recently fixed with logging
  app/(main)/profile/[id]/page.tsx
  src/api/services/reelsService.ts

State Management:
  src/store/slices/userSlice.ts
  src/store/slices/reelsSlice.ts

Real-time Chat:
  src/api/services/socketChatService.ts
  app/(main)/chat/[conversationId].tsx
```

---

## 🎯 Deployment Checklist

- [ ] All TypeScript errors resolved
- [ ] Upload → Profile flow tested end-to-end
- [ ] Profile shows reel + Posts count incremented
- [ ] Token refresh working on 401
- [ ] Error handling for network failures
- [ ] Sentry error logging configured
- [ ] Firebase analytics tracked
- [ ] Build size optimized
- [ ] All feature tabs tested
- [ ] Performance profiled (60fps animations)

---

## 🚀 Production Release Timeline (PlayStore & AppStore)

### Phase 1: Pre-Release (Days 1-2) — Sept 3-4, 2026
**Status:** 🔧 In Progress

**Tasks:**
- [ ] Fix profile route mismatch after upload (1 hour)
- [ ] Confirm getUserReels endpoint returns published reels (1 hour)
- [ ] Verify upload response field (uploadId vs video_url) (30 min)
- [ ] End-to-end testing: Upload → Profile shows reel + Posts count (2 hours)
- [ ] Clear native module errors & compile cleanly (Done ✅)
- [ ] Run full TypeScript type-check without errors (Done ✅)
- [ ] Test on physical iOS device (1 hour)
- [ ] Test on physical Android device (1 hour)

**Blockers to Clear:**
- 🔴 Profile shows "No reels yet" even after upload published
- 🔴 Post navigation lands on wrong screen (generic template vs real profile)
- 🔴 Uncertain about backend response field from upload endpoint

**Deadline:** EOD Sept 4, 2026

---

### Phase 2: QA & Stability (Days 3-4) — Sept 5-6, 2026
**Status:** ⏳ Pending

**Tasks:**
- [ ] 5+ full user flows (register → upload → profile → chat → payments)
- [ ] Error handling edge cases (no network, slow upload, payment failure)
- [ ] Performance profile on low-end device (Android Pixel 3a or older iPhone)
- [ ] Memory leak testing (record videos in infinite scroll for 10 min)
- [ ] Token refresh under 401 scenarios
- [ ] Battery/CPU usage audit
- [ ] Visual QA (UI consistency, animations smooth, text legible)

**Devices:**
- iPhone 14 Pro (iOS 17)
- iPhone SE 2nd Gen (iOS 15, lower-end)
- Samsung Galaxy S24 (Android 14)
- Samsung Galaxy A12 (Android 12, lower-end)

**Acceptance Criteria:**
- ✅ Zero crashes on main user flows
- ✅ Video uploads complete in <2 min on 4G
- ✅ Feed scrolls 60fps without jank
- ✅ No memory growth after 5 min active use
- ✅ All API errors show user-friendly messages

**Deadline:** EOD Sept 6, 2026

---

### Phase 3: Store Submission Prep (Days 5-6) — Sept 7-8, 2026
**Status:** ⏳ Pending

**iOS (AppStore):**
- [ ] Update version in `app.json` (e.g., 1.0.0)
- [ ] Update build number (EAS auto-increments)
- [ ] Create release notes: "Short-form video social platform. Share reels, compete, earn."
- [ ] Upload icon (1024x1024 PNG)
- [ ] Create screenshots (5-7 per supported device)
  - Home feed showing reels
  - Upload/post screen
  - Profile with earnings
  - Chat messaging
  - Competition leaderboard
- [ ] Write app description: "GullyFame connects creators & fans through viral short videos"
- [ ] Set keywords: "tiktok, instagram reels, short videos, viral, creator, social"
- [ ] Configure content rating (PG-13, user-generated content)
- [ ] Set privacy policy URL: `https://gullyfame.com/privacy`
- [ ] Set terms of service URL: `https://gullyfame.com/terms`
- [ ] Configure support email: `support@gullyfame.com`

**Android (PlayStore):**
- [ ] Update versionCode & versionName in `app.json`
- [ ] Create release notes (same as iOS)
- [ ] Upload icon (512x512 PNG)
- [ ] Create screenshots (5-7 per device type)
- [ ] Write full app description (4000 chars max)
- [ ] Add short description (80 chars)
- [ ] Set content rating (via form)
- [ ] Configure privacy policy, terms, support email (same as iOS)
- [ ] Select app category: "Social"

**Build Configuration:**
```bash
# Update version in app.json
{
  "expo": {
    "name": "GullyFame",
    "version": "1.0.0",
    "ios": { "buildNumber": "1" },
    "android": { "versionCode": 1 }
  }
}

# Build for production
eas build --platform ios --profile production
eas build --platform android --profile production
```

**Deadline:** EOD Sept 8, 2026

---

### Phase 4: Store Submission (Days 7-8) — Sept 9-10, 2026
**Status:** ⏳ Pending

**iOS Submission:**
```bash
eas submit --platform ios --latest
# or manually upload via Transporter or App Store Connect
```
- Expected review time: 24-48 hours
- Once approved: Live in AppStore

**Android Submission:**
```bash
eas submit --platform android --latest
# or manually upload via Google Play Console
```
- Expected review time: 2-4 hours
- Once approved: Live in PlayStore (instant or staged rollout)

**Steps:**
1. Sign into Apple Developer & Google Play Console accounts
2. Create release in each console
3. Upload build & app info
4. Submit for review
5. Monitor review status daily
6. Respond to any reviewer questions within 24h

**Deadline:** Sept 10, 2026

---

### Phase 5: Post-Launch (Days 9+) — Sept 11+, 2026
**Status:** ⏳ Pending

**Day 1 Post-Launch:**
- [ ] Monitor crash reports in Sentry (target: <0.5% crash rate)
- [ ] Check user feedback on AppStore/PlayStore reviews
- [ ] Monitor backend logs for API errors
- [ ] Verify payment processing (Razorpay transactions)
- [ ] Check 24h active user metrics

**Week 1 Post-Launch:**
- [ ] Respond to user reviews (aim for 5+ stars)
- [ ] Create hot-fix build if critical bugs found
- [ ] Monitor app store rankings
- [ ] Track download velocity

**Ongoing:**
- [ ] Monitor analytics (Sentry, Firebase)
- [ ] Plan v1.1 feature releases (new filters, stickers, etc.)
- [ ] Collect user feedback for improvements

---

## 📋 Pre-Launch Checklist

**Code Quality:**
- [ ] TypeScript: Zero type errors (`npm run type-check`)
- [ ] Linting: Zero ESLint warnings (`npm run lint`)
- [ ] Build: Production build succeeds without warnings
- [ ] Tests: All critical user flows pass manual testing

**Performance:**
- [ ] Bundle size <50MB (Android), <30MB (iOS)
- [ ] Startup time <3 seconds on 4G
- [ ] Feed scrolling 60fps (use React DevTools Profiler)
- [ ] Memory usage <200MB (active use)

**Security:**
- [ ] No hardcoded secrets in code
- [ ] API keys in environment variables
- [ ] HTTPS enforced for all API calls
- [ ] User tokens securely stored (AsyncStorage → SecureStore)
- [ ] Privacy policy & terms linked and accessible

**Device Compatibility:**
- [ ] iOS 15.0+ supported
- [ ] Android 8.0+ (API 26) supported
- [ ] Tested on iPhone SE 2 (older iOS)
- [ ] Tested on Galaxy A12 (older Android)

**Backend Integration:**
- [ ] Production API endpoint configured
- [ ] Auth token refresh working
- [ ] Push notifications configured
- [ ] Payment gateway (Razorpay) tested in production mode
- [ ] Error handling shows meaningful messages to users

**App Metadata:**
- [ ] Icon 1024x1024 (no transparency, fits in safe area)
- [ ] Screenshots professional & localized
- [ ] Description compelling & accurate
- [ ] Keywords SEO-optimized
- [ ] Privacy policy URL live and accessible
- [ ] Support contact configured

**Permissions:**
- [ ] Camera permission (video recording)
- [ ] Microphone permission (audio recording)
- [ ] Photo library permission (selecting video)
- [ ] Notifications permission (push)
- [ ] Internet permission (API calls)
- [ ] All permissions have user-facing explanations

---

## 🎯 Success Metrics (First Month)

| Metric | Target | Check At |
|--------|--------|----------|
| App Store Rating | ≥4.0 stars | Day 14 |
| Crash Rate | <0.5% | Day 1, Day 7 |
| Active Users | 1,000+ | Day 7 |
| Video Uploads | 100+ | Day 7 |
| Avg Session Length | ≥5 min | Day 7 |
| Payment Success Rate | ≥95% | Day 3 |
| API Response Time | <1s (p95) | Ongoing |

---

## 🚨 Critical Issues to Resolve Before Submission

| Issue | Impact | Due Date |
|-------|--------|----------|
| Profile route bug (wrong screen) | High | Sept 4 |
| getUserReels not returning reel | High | Sept 4 |
| Upload response field unclear | Medium | Sept 4 |
| Native module errors | High | Sept 3 ✅ |
| TypeScript errors | High | Sept 3 ✅ |

---

## 📱 Store Links (Post-Launch)

**iOS AppStore:**
```
https://apps.apple.com/app/id[APP_ID]
```

**Android PlayStore:**
```
https://play.google.com/store/apps/details?id=com.gullyfame.mobile
```

---

## 📞 Quick Help

**Can't login?** → Check token refresh in axios.ts interceptor and auth/refresh-token endpoint  
**Video not uploading?** → Check S3 presigned URL generation and PUT request  
**Reel not showing on profile?** → Check getUserReels endpoint and Redux state in reelsSlice  
**Chat not real-time?** → Verify socketChatService connected and Socket.io server running  
**App crashing?** → Check Sentry dashboard and use ErrorBoundary  
**Store submission rejected?** → Check reviewer feedback in console; common issues: misleading ads, inappropriate content, policy violations  

---

**Last Updated:** September 3, 2026 | **Maintainer:** GullyFame Dev Team  
**Target Production Launch:** September 10, 2026 | **Status:** 🔧 Phase 1 In Progress
