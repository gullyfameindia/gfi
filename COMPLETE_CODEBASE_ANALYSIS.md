# Gully Fame Monorepo - Complete Codebase Analysis

**Document Version:** 1.0  
**Last Updated:** 2024  
**Audience:** Senior Developers, New Team Members, Technical Architects  
**Repository:** `cultre-boat-monorepo` (Gully Fame - TikTok-like Short Video Platform)

---

## Executive Summary

Gully Fame is a sophisticated monorepo-based social media platform specializing in short-form video content, competitions, and creator monetization. Built with modern full-stack technologies, the platform spans three consumer-facing applications (mobile, admin, video editor) backed by a Node.js/Express API. The architecture emphasizes real-time updates, scalability, and developer experience through Turborepo and Yarn workspaces.

**Key Metrics:**
- **Monorepo Size:** 3 apps + 1 shared package + 1 backend service
- **Primary Language:** TypeScript/JavaScript
- **Primary Frameworks:** React Native (Expo), Next.js 14, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Key Integrations:** Firebase, Razorpay, Socket.io, Sentry

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Monorepo Structure](#2-monorepo-structure)
3. [Technology Stack](#3-technology-stack)
4. [Frontend Architecture](#4-frontend-architecture)
5. [State Management](#5-state-management)
6. [API Layer & HTTP Communication](#6-api-layer--http-communication)
7. [Backend Architecture](#7-backend-architecture)
8. [Database Layer](#8-database-layer)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [Real-Time Features](#10-real-time-features)
11. [Error Handling & Resilience](#11-error-handling--resilience)
12. [Performance Optimization](#12-performance-optimization)
13. [Testing Strategy](#13-testing-strategy)
14. [Build & Deployment](#14-build--deployment)
15. [Development Workflow](#15-development-workflow)
16. [Security Architecture](#16-security-architecture)
17. [Data Models](#17-data-models)
18. [Feature Modules](#18-feature-modules)
19. [Component Architecture](#19-component-architecture)
20. [Routing & Navigation](#20-routing--navigation)
21. [Storage & Caching](#21-storage--caching)
22. [Media Handling](#22-media-handling)
23. [Payment Integration](#23-payment-integration)
24. [Monitoring & Analytics](#24-monitoring--analytics)
25. [Internationalization & Localization](#25-internationalization--localization)
26. [Code Quality & Standards](#26-code-quality--standards)
27. [Third-Party Integrations](#27-third-party-integrations)
28. [Mobile-Specific Considerations](#28-mobile-specific-considerations)
29. [Performance Benchmarks](#29-performance-benchmarks)
30. [Known Issues & Technical Debt](#30-known-issues--technical-debt)
31. [Future Roadmap & Scalability](#31-future-roadmap--scalability)

---

## 1. Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      MONOREPO ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    APPLICATIONS LAYER                     │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                            │   │
│  │  ┌────────────────────┐  ┌──────────────┐  ┌───────────┐ │   │
│  │  │ Mobile App        │  │ Admin Panel  │  │ Video     │ │   │
│  │  │ (React Native)    │  │ (Next.js 14) │  │ Editor    │ │   │
│  │  │ - Reels/Timeline  │  │ - Dashboard  │  │ (Expo)    │ │   │
│  │  │ - Competitions    │  │ - Moderation │  │ - Filters │ │   │
│  │  │ - Profile         │  │ - Analytics  │  │ - Music   │ │   │
│  │  │ - KYC             │  │ - Reports    │  │ - Export  │ │   │
│  │  └────────────────────┘  └──────────────┘  └───────────┘ │   │
│  │                                                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│           │                    │                    │             │
│           ├────────────────────┴────────────────────┤             │
│           ▼                                         ▼             │
│  ┌──────────────────────────────┐    ┌─────────────────────┐    │
│  │   SHARED PACKAGE LAYER       │    │   STATE MANAGEMENT  │    │
│  ├──────────────────────────────┤    ├─────────────────────┤    │
│  │ video-editor-core            │    │ Redux Toolkit       │    │
│  │ - Video processing           │    │ Zustand             │    │
│  │ - Filters & effects          │    │ TanStack Query      │    │
│  │ - Music library              │    │                     │    │
│  └──────────────────────────────┘    └─────────────────────┘    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              API CLIENT LAYER (Axios)                     │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ - Token Management (AsyncStorage/localStorage)          │   │
│  │ - Request Interceptors (Auth, Logging)                  │   │
│  │ - Response Interceptors (Error Handling, Retry)         │   │
│  │ - Multipart Upload (Videos, Images)                     │   │
│  │ - Socket.io Real-time Events                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                      BACKEND API LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          Express.js API Server                           │   │
│  │          (gully-fame-backend)                            │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │         REST API Endpoints                         │  │   │
│  │  ├────────────────────────────────────────────────────┤  │   │
│  │  │ /auth - Authentication                            │  │   │
│  │  │ /users - User profiles, KYC, follower system      │  │   │
│  │  │ /reels - Video content, likes, comments           │  │   │
│  │  │ /competitions - Contest management                │  │   │
│  │  │ /payments - Razorpay integration                  │  │   │
│  │  │ /admin - Dashboard, moderation, reports           │  │   │
│  │  │ /search - Global search (users, reels, contests)  │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │         Middleware & Services                      │  │   │
│  │  ├────────────────────────────────────────────────────┤  │   │
│  │  │ - JWT Authentication                              │  │   │
│  │  │ - CORS Policy                                     │  │   │
│  │  │ - Error Handling                                  │  │   │
│  │  │ - Logging                                         │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │       MongoDB Database                                   │   │
│  │       (Mongoose ODM)                                     │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ Collections:                                             │   │
│  │ - users, userProfiles, userKyc                           │   │
│  │ - reels, comments, likes                                │   │
│  │ - competitions, participations                           │   │
│  │ - payments, wallets, transactions                        │   │
│  │ - reports, moderation_actions                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                   EXTERNAL SERVICES                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Firebase    Razorpay    Socket.io    Sentry    AWS S3/Storage  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Architectural Principles

1. **Monorepo Approach:** Shared code via Turborepo and Yarn workspaces
2. **Separation of Concerns:** Clear boundaries between apps, API, and shared packages
3. **Type Safety:** Full TypeScript coverage across all layers
4. **Real-Time Capabilities:** Socket.io integration for live updates
5. **Mobile-First:** React Native base with platform-specific optimizations
6. **Scalability:** Modular service layer with potential for microservices migration

---

## 2. Monorepo Structure

### File System Layout

```
cultre-boat-monorepo/
├── apps/                              # All user-facing applications
│   ├── gully-fame-mobile/            # React Native mobile app (Expo)
│   │   ├── app/                       # Expo Router navigation structure
│   │   │   ├── (main)/               # Main app stack
│   │   │   ├── auth/                 # Authentication flows
│   │   │   ├── onboarding/           # First-time user experience
│   │   │   ├── _layout.tsx           # Root layout
│   │   │   └── index.tsx             # Entry point
│   │   ├── src/
│   │   │   ├── api/                   # API services and axios configuration
│   │   │   ├── components/            # Reusable UI components
│   │   │   ├── contexts/              # React Context providers
│   │   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── screens/               # Screen components
│   │   │   ├── store/                 # Redux store configuration
│   │   │   ├── styles/                # Global styles
│   │   │   ├── types/                 # TypeScript definitions
│   │   │   └── utils/                 # Utility functions
│   │   ├── assets/                    # Images, fonts, static files
│   │   ├── plugins/                   # Expo plugins
│   │   ├── android/                   # Android-specific code
│   │   ├── package.json               # Dependencies and scripts
│   │   ├── app.json                   # Expo configuration
│   │   ├── eas.json                   # EAS build configuration
│   │   └── tailwind.config.js         # NativeWind configuration
│   │
│   ├── gully-fame-admin/             # Next.js admin dashboard
│   │   ├── app/                       # Next.js app directory structure
│   │   │   ├── layout.tsx             # Root layout
│   │   │   └── (routes)/              # Route grouping
│   │   ├── components/                # Reusable components
│   │   ├── lib/                       # Utilities and helpers
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tailwind.config.js
│   │
│   └── videoeditor/                  # Video editing Expo app
│       ├── app/                       # Routing structure
│       ├── src/                       # Source code
│       ├── video-editor/              # Video editor module
│       ├── camera-module/             # Camera functionality
│       ├── components/                # Components
│       └── package.json
│
├── packages/                           # Shared packages
│   └── video-editor-core/             # Shared video processing library
│       ├── src/
│       │   ├── filters/               # Video filters
│       │   ├── effects/               # Visual effects
│       │   ├── processors/            # Core video processing
│       │   └── types.ts               # Type definitions
│       ├── package.json
│       └── README.md
│
├── gully-fame-backend/                # Express.js backend API
│   ├── package.json
│   └── [Source files in root - non-modular structure]
│
├── .github/                           # GitHub workflows and config
├── .husky/                            # Git hooks
├── .kiro/                             # Kiro AI configuration
├── .turbo/                            # Turborepo cache
├── .yarn/                             # Yarn installation artifacts
├── patches/                           # Yarn patch files for dependencies
├── package.json                       # Root workspace configuration
├── turbo.json                         # Turborepo configuration
├── tsconfig.json                      # Root TypeScript configuration
├── .prettierrc                        # Code formatting configuration
├── .eslintignore                      # ESLint ignore patterns
├── docker-compose.yml                 # Local development environment
├── Dockerfile                         # Backend containerization
└── README.md
```

### Root Workspace Configuration

**`package.json` (Root)**
- **Workspace Setup:** Yarn v4 workspaces
- **Nohoist Packages:** React Native packages (reanimated, gesture-handler, worklets)
- **Scripts:** Build, dev, lint, clean (all Turborepo-powered)
- **Node Version:** ≥18
- **Shared DevDeps:** TypeScript (5.4), Prettier (3.3), Turborepo (2.8.9)

---

## 3. Technology Stack

### Core Technologies by Layer

#### Frontend - Mobile App

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Runtime** | Expo / React Native | 54 / 0.81.5 | Cross-platform mobile development |
| **Framework** | React | 19.1 | UI library |
| **Routing** | Expo Router | 6.0.10 | File-based routing (similar to Next.js) |
| **Navigation** | React Navigation | 7.x | Stack, Bottom Tabs, Drawer |
| **State** | Redux Toolkit | 2.9.1 | Global state management |
| **State** | Zustand | 5.0.8 | Lightweight state management (alternative) |
| **Data Fetching** | @tanstack/react-query | 5.90 | Server state management |
| **HTTP Client** | Axios | 1.12.2 | API communication with interceptors |
| **Styling** | NativeWind | 4.2.1 | Tailwind CSS for React Native |
| **Forms** | React Hook Form | 7.65 | Form state management |
| **Validation** | Yup | 1.7.1 | Schema validation |
| **Camera** | React Native Vision Camera | 5.0.9 | High-performance camera access |
| **Video** | Expo Video | 3.0.14 | Video playback |
| **Animations** | React Native Reanimated | 4.1.1 | Performant animations |
| **Gestures** | React Native Gesture Handler | 2.28 | Touch gesture recognition |
| **Auth** | Firebase | 12.4 | Backend-as-a-service, auth |
| **Auth** | Google Sign-In | 16.1.1 | OAuth provider |
| **Payments** | Razorpay | 2.3.1 | Payment gateway integration |
| **Icons** | Expo Vector Icons | 15.0.3 | Icon library |
| **Graphics** | React Native SVG | 15.12.1 | SVG rendering |
| **Filters** | React Native Color Matrix Filters | 8.0.2 | Image/video filters |
| **Storage** | @react-native-async-storage | 2.2 | Persistent local storage |
| **Secure Storage** | Expo Secure Store | 15.0.8 | Encrypted key storage |
| **Real-time** | Socket.io-client | 4.8.1 | WebSocket communication |
| **Error Tracking** | Sentry | 7.2.0 | Error monitoring |
| **Testing** | Jest | 29.7 | Unit testing framework |
| **Testing** | React Native Testing Library | 12.4 | Component testing |

#### Frontend - Admin Dashboard

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 14.0.0 | React meta-framework with SSR |
| **React** | React | 18.2.0 | UI library |
| **Styling** | Tailwind CSS | 3.3.0 | Utility-first CSS framework |
| **Charts** | Recharts | 2.10.0 | Data visualization |
| **Icons** | Lucide React | 0.294 | Icon system |
| **TypeScript** | TypeScript | 5.0.0 | Type safety |

#### Video Editor

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Core** | Expo / React Native | 54 | Mobile app framework |
| **Video Processing** | FFmpeg | Community edition | Video encoding/effects |
| **Graphics** | React Native Skia | Latest | High-performance graphics |
| **Filters** | Color Matrix Filters | 8.0.2 | Image/video effects |
| **Shared Lib** | video-editor-core | Local | Shared video processing logic |

#### Backend

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Runtime** | Node.js | 18+ | JavaScript runtime |
| **Framework** | Express.js | 5.2.1 | Web application framework |
| **Database** | MongoDB | 9.8.1 (Mongoose) | NoSQL document database |
| **ORM** | Mongoose | 9.8.1 | MongoDB object modeling |
| **CORS** | cors | 2.8.6 | Cross-origin resource sharing |
| **Env Config** | dotenv | 17.4.2 | Environment variable management |

---

## 4. Frontend Architecture

### Mobile App Architecture

#### Folder Structure Philosophy

**Modular Organization by Feature:**
- Each feature has its own folder containing components, hooks, and types
- Shared utilities and base components are in centralized directories
- Clear separation between screen containers and presentational components

#### Key Directories

**`src/api/`** - API Layer
- `axios.ts` - Axios client configuration with interceptors
- `services/` - Domain-specific API services:
  - `authService.ts` - Authentication endpoints
  - `userService.ts` - User profile, KYC, follow management
  - `reelService.ts` - Content management
  - `competitionService.ts` - Competition features
  - `paymentIntegrationService.ts` - Razorpay integration
  - `searchService.ts` - Global search functionality
  - `bannerService.ts` - Promotional banners
  - `videoUploadService.ts` - Video upload with progress tracking
  - `adminService.ts` - Admin dashboard APIs

**`src/components/`** - UI Components
- `home/` - Home feed and discovery components
- `profile/` - User profile, stats, profile settings
- `reel/` - Reel player, controls, interactions
- `timeline/` - Feed timeline and pagination
- `modals/` - Modal dialogs (follow, share, report, etc.)
- `ui/` - Base UI primitives (buttons, inputs, cards)
- `layout/` - Layout wrapper components
- Shared components like `ErrorBoundary.tsx`, `SafeImage.tsx`

**`src/screens/`** - Screen Container Components
- Full-page screens that organize multiple components
- Typically mapped to routes in `app/` directory
- Handle business logic and data fetching

**`src/hooks/`** - Custom React Hooks
- `useFollowStats.ts` - Fetch and listen to follower/following counts
- `useOwnProfile.ts` / `useOtherUserProfile.ts` - Profile data
- `useFetch.ts` - Generic data fetching with caching
- `useAsync.ts` - Async state management
- `useForm.ts` - Form state and validation
- `useHomeScreen.ts` - Home feed data loading
- `useUserReels.ts` - User's reel collection

**`src/store/`** - Redux Store
- `index.ts` - Store configuration
- `slices/` - Redux slices:
  - `userSlice.ts` - Current user state
  - `uiSlice.ts` - UI state (modals, toasts, loading)
  - `reelsSlice.ts` - Reel feed state
  - `competitionsSlice.ts` - Competitions state

**`src/contexts/`** - React Context Providers
- Application-wide context for themes, authentication state, etc.

**`src/types/`** - TypeScript Type Definitions
- Domain models and API contracts
- Reusable interfaces for type safety

**`src/utils/`** - Utility Functions
- Helper functions for formatting, validation, etc.

#### Component Patterns

**Smart Components (Container):**
```typescript
// Example: app/(main)/profile/own/participant.tsx
- Fetch data via hooks
- Manage component state
- Handle navigation
- Render presentational component
```

**Presentational Components:**
```typescript
// Example: src/components/profile/shared/ProfileComponents.tsx
- Accept data via props
- No data fetching
- No direct navigation
- Pure rendering logic
```

**Real-Time Component Pattern (Follow System Example):**
```typescript
// File: src/screens/FollowersScreen.tsx
- Uses followService for API calls
- Listens to followUpdateEmitter events
- Auto-updates UI on follow/unfollow
- Prevents memory leaks with cleanup
```

### Admin Dashboard Architecture

**Next.js 14 Structure:**
- Uses App Router (directory-based routing)
- Server-side rendering with React components
- API routes for backend communication
- Middleware for authentication/authorization

---

## 5. State Management

### Multi-Strategy State Management

Gully Fame uses a **hybrid approach** to state management based on data characteristics:

#### Redux Toolkit (Global UI & Reel State)

**Store Configuration** (`src/store/index.ts`)
```typescript
- User state (current authenticated user)
- UI state (modals, toasts, loading, network status)
- Reels state (feed, current reel, interactions)
- Competitions state (list, current, filters, join/leave)
```

**Usage Pattern:**
```typescript
// Dispatch actions
dispatch(setUser(userData))
dispatch(showAlert({ title: "Success", message: "..." }))

// Select state
const user = useSelector(state => state.user.user)
const isLoading = useSelector(state => state.ui.isLoading)
```

**When to Use Redux:**
- User authentication state
- UI state that affects multiple screens
- Application-level notifications
- Global loading states

#### Zustand (Lightweight State)

**Use Cases:**
- Module-specific state that doesn't need Redux complexity
- Isolated component state that might need sharing

#### TanStack Query (Server State)

**Primary Use Case:** Server-side data fetching and caching

**Features:**
- Automatic stale data invalidation
- Background refetching
- Pagination support
- Query deduplication

**Usage Pattern:**
```typescript
const { data, isLoading, error } = useQuery(
  ['reels', page],
  () => reelService.getReels(page),
  { staleTime: 5 * 60 * 1000 }
)
```

#### React Context (Specialized)

**Usage:**
- Theme context
- Auth context
- Localization context

### Real-Time State Updates

**Follow Feature Example** (from FOLLOW_FEATURE_IMPLEMENTATION.md):

```typescript
// Event emitter for real-time updates
export const followUpdateEmitter = new FollowUpdateEmitter()

// Emit follow event
followUpdateEmitter.emit({ type: 'follow', userId })

// Listen in hook
useFollowStats = (userId) => {
  useEffect(() => {
    const handleUpdate = () => refetch()
    followUpdateEmitter.on('follow', handleUpdate)
    return () => followUpdateEmitter.off('follow', handleUpdate)
  }, [refetch])
}
```

---

## 6. API Layer & HTTP Communication

### Axios Configuration

**File:** `src/api/axios.ts`

#### Client Setup
```typescript
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://gullyfame.com/v1/api/',
  timeout: 60000, // 60s for mobile
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'User-Agent': 'GullyFame-Mobile/1.0',
  }
})
```

**Base URL Priority:**
1. `EXPO_PUBLIC_API_BASE_URL` environment variable
2. Production fallback: `https://gullyfame.com/v1/api/`

#### Request Interceptor

**Responsibilities:**
1. **Token Attachment:** Automatically adds Bearer token from AsyncStorage
2. **Detailed Logging:** Logs method, URL, headers (with redacted token)
3. **Conditional Auth:** Respects `skipAuth` config option
4. **Error Handling:** Catches token retrieval errors gracefully

```typescript
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken')
    if (token && !config.skipAuth) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('[axios] Request:', config.url)
    return config
  }
)
```

#### Response Interceptor

**Responsibilities:**
1. **Success Logging:** Logs successful response status
2. **Error Handling:** Catches and processes errors
3. **Token Refresh:** Automatically refreshes expired tokens (if implemented)
4. **Retry Logic:** Retries certain requests on failure

**Error Categories Handled:**
- Network errors (no connection)
- HTTP errors (4xx, 5xx)
- Timeout errors
- Token expiration (401)

#### Token Management

**Functions:**
```typescript
setAuthToken(token: string)     // Save token to AsyncStorage
getAuthToken(): string | null   // Retrieve stored token
removeAuthToken()               // Clear token on logout
```

### API Service Layer

#### Service Organization

Each service file handles a specific domain:

**`authService.ts`** - Authentication
- Register user
- Verify OTP
- Login
- Logout
- Get profile

**`userService.ts`** - User Management
- Profile updates
- KYC submission
- Follow/unfollow
- Get follower/following lists

**`reelService.ts`** - Reel Management
- Get feed
- Get reel details
- Like/unlike
- Comment
- Share

**`competitionService.ts`** - Competitions
- List competitions
- Get competition details
- Join/leave competition
- Get leaderboard

**`paymentIntegrationService.ts`** - Razorpay Integration
- Get coin packages
- Initiate payment
- Process Razorpay payment
- Verify payment
- Get wallet balance
- Send support payments (tips)

**`videoUploadService.ts`** - Video Upload
- Upload video file with progress
- Create reel metadata
- Upload complete flow
- Get upload status
- Cancel upload

**`searchService.ts`** - Global Search
- Search users
- Search reels
- Search competitions
- Search hashtags
- Get trending hashtags
- Get/clear search history

**`bannerService.ts`** - Promotional Content
- Get banners
- Get active banners

**`adminService.ts`** - Admin APIs
- Dashboard stats
- User management
- Competition management
- Report management
- Earnings/payouts

#### Response Type Convention

**Standard API Response:**
```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  status: number
}
```

**Paginated Responses:**
```typescript
interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
```

### Error Handling Pattern

**Service Error Handling:**
```typescript
export async function getReels() {
  try {
    const response = await apiClient.get('/reels')
    return response.data as ApiResponse<Reel[]>
  } catch (error: AxiosError) {
    console.error('[reelService] Error:', error.message)
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch reels',
      status: error.response?.status || 500
    }
  }
}
```

**Component Usage:**
```typescript
const { data: reels, error } = useQuery(
  ['reels'],
  () => reelService.getReels()
)

if (error) {
  // Show error UI
}
```

---

## 7. Backend Architecture

### Express.js Server Structure

**Non-Modular Current Architecture:**
- Backend code is in root of `gully-fame-backend/` (not in `src/` folder)
- Single package.json with core dependencies only

**Future Improvement Opportunity:**
- Migrate to modular structure with:
  - `routes/` - API route definitions
  - `controllers/` - Route handlers
  - `models/` - Mongoose schemas
  - `middleware/` - Custom middleware
  - `services/` - Business logic
  - `validators/` - Request validation

### API Endpoints Structure

**Endpoint Groups** (based on services and frontend usage):

#### Authentication (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/verify-otp` - OTP verification
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Token refresh

#### Users (`/users`)
- `GET /users/profile` - Get own profile
- `GET /users/:userId` - Get user profile
- `POST /users/profile` - Update profile
- `POST /users/:userId/follow` - Follow user
- `DELETE /users/:userId/follow` - Unfollow user
- `GET /users/:userId/followers` - Get followers list
- `GET /users/:userId/following` - Get following list
- `GET /users/stats/:userId` - Get follower/following counts

#### KYC (`/users/kyc`)
- `POST /users/kyc` - Submit KYC
- `GET /users/kyc/status` - Get KYC status
- `GET /admin/users/:userId/kyc` - Admin view KYC (admin only)

#### Reels (`/reels`)
- `GET /reels` - Get reel feed
- `GET /reels/:reelId` - Get reel details
- `POST /reels` - Create/upload reel
- `POST /reels/:reelId/like` - Like reel
- `DELETE /reels/:reelId/like` - Unlike reel
- `POST /reels/:reelId/comment` - Add comment
- `DELETE /reels/:reelId/comment/:commentId` - Delete comment

#### Competitions (`/competitions`)
- `GET /competitions` - List all competitions
- `GET /competitions/:competitionId` - Get competition details
- `POST /competitions/:competitionId/join` - Join competition
- `DELETE /competitions/:competitionId/join` - Leave competition
- `GET /competitions/:competitionId/leaderboard` - Get leaderboard
- `GET /competitions/:competitionId/submissions` - Get my submissions

#### Payments (`/payments`)
- `POST /payments/initiate` - Initiate payment
- `POST /payments/verify` - Verify payment
- `GET /payments/packages` - Get coin packages
- `GET /payments/history` - Get transaction history
- `GET /payments/wallet` - Get wallet balance
- `POST /payments/send-support` - Send support payment (tips)

#### Search (`/search`)
- `GET /search/users` - Search users
- `GET /search/reels` - Search reels
- `GET /search/competitions` - Search competitions
- `GET /search/hashtags` - Search hashtags
- `GET /search/trending-hashtags` - Trending hashtags
- `GET /search/global` - Global search
- `GET /search/history` - Get search history
- `DELETE /search/history` - Clear search history

#### Admin (`/admin`)
- `GET /admin/dashboard/stats` - Dashboard stats
- `GET /admin/dashboard/recent-activity` - Recent activity
- `GET /admin/users` - List users (paginated)
- `GET /admin/users/:userId` - User details
- `GET /admin/users/:userId/earnings` - User earnings
- `GET /admin/competitions` - List competitions
- `GET /admin/competitions/:competitionId` - Competition details
- `POST /admin/users/:userId/ban` - Ban user
- `POST /admin/reels/:reelId/moderate` - Moderate content
- `GET /admin/reports` - View reports
- `POST /admin/reports/:reportId/action` - Take moderation action

---

## 8. Database Layer

### MongoDB Database Design

#### Database Modeling with Mongoose

**File Location:** Backend (non-modular structure currently)

**Core Collections:**

**Users Collection**
```javascript
{
  _id: ObjectId,
  email: string,
  username: string,
  password: string (hashed),
  phone: string,
  displayName: string,
  profilePicture: string (URL),
  bio: string,
  followers: number,
  following: number,
  role: 'USER' | 'CREATOR' | 'ADMIN',
  isKycVerified: boolean,
  kyc: ObjectId (ref to UserKYC),
  wallet: ObjectId (ref to Wallet),
  createdAt: Date,
  updatedAt: Date,
  isActive: boolean,
  isBanned: boolean
}
```

**Reels Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref to User),
  title: string,
  description: string,
  videoUrl: string,
  thumbnailUrl: string,
  duration: number (seconds),
  likes: number,
  comments: number,
  shares: number,
  views: number,
  category: string,
  hashtags: [string],
  competitionId?: ObjectId (ref to Competition),
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
  createdAt: Date,
  updatedAt: Date
}
```

**Competitions Collection**
```javascript
{
  _id: ObjectId,
  title: string,
  description: string,
  coverImage: string,
  sponsorId: ObjectId (ref to User/Admin),
  status: 'CREATED' | 'LIVE' | 'COMPLETED' | 'CANCELLED',
  prizePool: number,
  participantCount: number,
  startDate: Date,
  endDate: Date,
  rules: string,
  createdAt: Date,
  updatedAt: Date
}
```

**Follows Collection** (for real-time follow tracking)
```javascript
{
  _id: ObjectId,
  followerId: ObjectId (ref to User),
  followingId: ObjectId (ref to User),
  createdAt: Date
}
```

**Transactions/Payments Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref to User),
  type: 'COIN_PURCHASE' | 'SUPPORT_PAYMENT' | 'EARNING',
  amount: number,
  coins: number,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  status: 'PENDING' | 'SUCCESS' | 'FAILED',
  createdAt: Date
}
```

**User KYC Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref to User),
  status: 'PENDING' | 'APPROVED' | 'REJECTED',
  name: string,
  dob: Date,
  address: string,
  panNumber: string,
  aadharNumber: string,
  documents: [{ type: string, url: string }],
  submittedAt: Date,
  approvedAt?: Date,
  rejectionReason?: string
}
```

### Database Relationships

```
User (1) ──── (M) Reel
  │
  ├─── (1) UserKYC
  │
  ├─── (1) Wallet
  │
  ├─── (1:M) Payment/Transaction
  │
  └─── (M:M) User (Follows)
        └─── Stored in Follows collection

Competition (1) ──── (M) Reel
  │
  ├─── (1) User (Sponsor)
  │
  └─── (M:M) User (Participants)
```

### Query Optimization

**Indexes to Create:**
- `users.email` - Fast user lookup by email
- `users.username` - Fast user lookup by username
- `reels.userId` - Get reels by creator
- `reels.competitionId` - Get reels by competition
- `reels.createdAt` - Sort reels by date
- `follows.followerId` - Get user's following list
- `follows.followingId` - Get user's followers list
- `payments.userId` - Get user's payment history
- `competitions.status` - Filter competitions by status

---

## 9. Authentication & Authorization

### JWT-Based Authentication

#### Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  AUTHENTICATION FLOW                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. LOGIN REQUEST                                            │
│     POST /auth/login { email, password }                     │
│                ↓                                              │
│  2. SERVER VALIDATES                                         │
│     - Check credentials                                      │
│     - Hash password match                                    │
│                ↓                                              │
│  3. GENERATE JWT                                             │
│     - Create token with user ID, email, role                 │
│     - Set expiration (e.g., 24 hours)                        │
│                ↓                                              │
│  4. SEND TOKEN TO CLIENT                                     │
│     Response: { token, user }                                │
│                ↓                                              │
│  5. CLIENT STORES TOKEN                                      │
│     AsyncStorage.setItem('authToken', token)                │
│                ↓                                              │
│  6. ATTACH TO REQUESTS                                       │
│     Authorization: Bearer [JWT_TOKEN]                        │
│     ↓ ↓ ↓ (All subsequent requests)                         │
│  7. SERVER VERIFIES TOKEN                                    │
│     - Middleware validates signature                         │
│     - Checks expiration                                      │
│     - Extracts user info                                     │
│                ↓                                              │
│  8. REQUEST PROCEEDS / REJECTED                              │
│     Valid → Process request                                  │
│     Invalid → 401 Unauthorized                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

#### Token Storage

**Mobile App** (`src/api/axios.ts`):
```typescript
const TOKEN_STORAGE_KEY = 'authToken'

// Save token
await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token)

// Retrieve token
const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY)

// Clear token (logout)
await AsyncStorage.removeItem(TOKEN_STORAGE_KEY)
```

**Web Admin**:
```typescript
// localStorage used instead of AsyncStorage
localStorage.setItem('authToken', token)
```

#### Request Interceptor (Automatic Token Attachment)

**File:** `src/api/axios.ts` (Request interceptor)

```typescript
apiClient.interceptors.request.use(
  async (config) => {
    if (!config.skipAuth) {
      const token = await AsyncStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  }
)
```

**Usage in Services:**
```typescript
// Most requests automatically include token
await apiClient.get('/users/profile')

// Skip auth for public endpoints
await apiClient.get('/banners', { skipAuth: true })
```

#### Token Refresh Strategy

**Current Implementation:**
- Not explicitly detailed in codebase
- Should handle 401 errors by:
  1. Attempting token refresh
  2. Retrying original request
  3. If refresh fails, redirect to login

**Recommended Implementation:**
```typescript
if (error.response?.status === 401) {
  // Attempt refresh
  const newToken = await refreshAuthToken()
  if (newToken) {
    // Update storage and retry
    config.headers.Authorization = `Bearer ${newToken}`
    return apiClient(config)
  } else {
    // Redirect to login
    dispatch(logout())
  }
}
```

### Authorization Levels

**Role-Based Access Control (RBAC):**
1. **USER** - Regular user (default)
2. **CREATOR** - Monetized creator with analytics
3. **ADMIN** - Full system access
4. **SPONSOR** - Can create competitions
5. **MODERATOR** - Can moderate content and users

**Permission Mapping:**
- `USER`: Browse content, follow, like, comment, participate in competitions
- `CREATOR`: Create reels, analytics, monetization features
- `ADMIN`: Full dashboard access, user/content moderation
- `SPONSOR`: Create and manage competitions
- `MODERATOR`: Review reports, ban users, delete content

### Security Measures

1. **Password Hashing** - Backend hashes passwords (bcrypt recommended)
2. **HTTPS** - All communication encrypted
3. **CORS Policy** - Restricted to approved origins
4. **Secure Token Storage** - Async/Secure storage on mobile
5. **Token Expiration** - JWT tokens expire automatically
6. **Rate Limiting** - Backend should implement rate limiting (not visible in code)

---

## 10. Real-Time Features

### Follow System - Real-Time Updates

**Implementation:** Event-driven architecture with custom event emitter

**Files Involved:**
- `src/screens/FollowersScreen.tsx` - Screen with real-time sync
- `src/hooks/useFollowStats.ts` - Hook for stats with listener
- `src/components/profile/shared/ProfileComponents.tsx` - Display component

#### Architecture

```
┌──────────────────────────────────────────────────────────────┐
│         FOLLOW SYSTEM - REAL-TIME ARCHITECTURE               │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Global Event Emitter                                         │
│  followUpdateEmitter = new FollowUpdateEmitter()              │
│         │                                                      │
│         ├─────────────────┬──────────────────┤                │
│         ▼                 ▼                  ▼                 │
│    FollowersScreen  useFollowStats    ProfileScreen          │
│         │                 │                  │                │
│         ├─────────────────┼──────────────────┤                │
│         ▼                 ▼                  ▼                 │
│    emit('follow')  refetch stats    update display            │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

#### FollowersScreen Implementation

**File:** `src/screens/FollowersScreen.tsx`

**Key Features:**
1. **Follow/Unfollow Buttons** - Click to toggle follow state
2. **Real-Time Updates** - Emits event when action completes
3. **Pull-to-Refresh** - Manual data refresh
4. **Auto-refresh on Focus** - Uses `useFocusEffect` hook
5. **Pagination** - Loads 100 items per request
6. **Listener Cleanup** - Prevents memory leaks

**Code Pattern:**
```typescript
const FollowersScreen = ({ userId, tab }) => {
  const [followers, setFollowers] = useState([])
  
  // Fetch followers
  const fetchFollowers = async () => {
    const response = await userService.getFollowers(userId)
    setFollowers(response.data.items)
  }
  
  // Listen to real-time updates
  useEffect(() => {
    const handleUpdate = () => fetchFollowers()
    followUpdateEmitter.on('follow', handleUpdate)
    followUpdateEmitter.on('unfollow', handleUpdate)
    
    return () => {
      followUpdateEmitter.off('follow', handleUpdate)
      followUpdateEmitter.off('unfollow', handleUpdate)
    }
  }, [])
  
  // Refresh when screen focused
  useFocusEffect(
    useCallback(() => {
      fetchFollowers()
    }, [])
  )
  
  const handleFollowUser = async (targetUserId) => {
    await followService.followUser(targetUserId)
    followUpdateEmitter.emit('follow', { userId: targetUserId })
  }
  
  return (
    <FlatList
      data={followers}
      onRefresh={fetchFollowers}
      refreshing={loading}
      renderItem={({ item }) => (
        <FollowerItem
          user={item}
          onFollow={() => handleFollowUser(item._id)}
        />
      )}
    />
  )
}
```

#### useFollowStats Hook

**File:** `src/hooks/useFollowStats.ts`

**Purpose:** Fetch and listen to follower/following count changes

**Implementation:**
```typescript
export const useFollowStats = (userId: string) => {
  const [stats, setStats] = useState({ followers: 0, following: 0 })
  const [loading, setLoading] = useState(true)
  
  const refetch = async () => {
    const response = await userService.getFollowStats(userId)
    setStats(response.data)
    setLoading(false)
  }
  
  useEffect(() => {
    refetch()
    
    // Listen for follow updates
    const handleUpdate = () => refetch()
    followUpdateEmitter.on('follow', handleUpdate)
    followUpdateEmitter.on('unfollow', handleUpdate)
    
    return () => {
      followUpdateEmitter.off('follow', handleUpdate)
      followUpdateEmitter.off('unfollow', handleUpdate)
    }
  }, [userId])
  
  return { stats, loading, refetch }
}
```

#### Profile Component Integration

**File:** `src/components/profile/shared/ProfileComponents.tsx`

```typescript
export const StatsSection = ({
  photos,
  followers,
  following,
  onFollowersPress,
  onFollowingPress
}) => {
  return (
    <View className="flex-row justify-around">
      <Pressable onPress={onFollowersPress}>
        <Text className="text-lg font-bold">{followers}</Text>
        <Text className="text-gray-500">Followers</Text>
      </Pressable>
      
      <Pressable onPress={onFollowingPress}>
        <Text className="text-lg font-bold">{following}</Text>
        <Text className="text-gray-500">Following</Text>
      </Pressable>
    </View>
  )
}
```

#### Profile Screen Usage

**File:** `app/(main)/profile/own/participant.tsx`

```typescript
const ParticipantProfile = () => {
  const { stats, loading } = useFollowStats(userId)
  
  const handleFollowersPress = () => {
    navigation.navigate('Followers', { userId, tab: 'followers' })
  }
  
  const handleFollowingPress = () => {
    navigation.navigate('Followers', { userId, tab: 'following' })
  }
  
  return (
    <StatsSection
      photos={45}
      followers={stats.followers}
      following={stats.following}
      onFollowersPress={handleFollowersPress}
      onFollowingPress={handleFollowingPress}
    />
  )
}
```

### Socket.io Integration

**Status:** Client library installed, real-time event handling ready

**Current Uses:**
- Live follow/unfollow events
- Potential: Live competition updates, real-time comments, notifications

**Implementation Pattern:**
```typescript
import io from 'socket.io-client'

const socket = io('https://gullyfame.com', {
  auth: { token: authToken }
})

// Listen to events
socket.on('follow', (data) => {
  followUpdateEmitter.emit('follow', data)
})

// Emit events
socket.emit('follow', { userId })
```

---

## 11. Error Handling & Resilience

### Error Handling Strategy

#### API Level

**Request Interceptor Error Handling:**
```typescript
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY)
      // ...
    } catch (error) {
      console.warn("[axios] Failed to retrieve token:", error)
      return config
    }
  }
)
```

**Response Interceptor Error Handling:**
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle network errors
    if (!error.response) {
      console.error("[axios] Network error:", error.message)
      return Promise.reject(new Error("Network error"))
    }
    
    // Handle authentication errors
    if (error.response.status === 401) {
      // Attempt token refresh or logout
    }
    
    // Handle other HTTP errors
    console.error("[axios] HTTP error:", error.response.status)
    return Promise.reject(error)
  }
)
```

#### Service Level

**Pattern:** Catch and wrap errors in consistent response format

```typescript
export async function getReels(): Promise<ApiResponse<Reel[]>> {
  try {
    const response = await apiClient.get('/reels')
    return response.data
  } catch (error: AxiosError) {
    console.error('[reelService] Error:', error.message)
    return {
      success: false,
      error: error.response?.data?.error || 'Unknown error',
      status: error.response?.status || 500
    }
  }
}
```

#### Component Level

**Pattern:** Check success flag and handle errors in UI

```typescript
const MyComponent = () => {
  const { data: reels, error, isLoading } = useQuery(
    ['reels'],
    () => reelService.getReels()
  )
  
  if (error) {
    return <ErrorBoundary error={error} onRetry={() => refetch()} />
  }
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  return <ReelsList reels={reels} />
}
```

### Error Boundary Component

**File:** `src/components/ErrorBoundary.tsx`

**Purpose:** Catch React rendering errors and display fallback UI

```typescript
export class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, info) {
    console.error('Error caught:', error, info)
    // Send to Sentry
    Sentry.captureException(error)
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <View>
          <Text>Something went wrong</Text>
          <Button
            title="Try again"
            onPress={() => this.setState({ hasError: false })}
          />
        </View>
      )
    }
    return this.props.children
  }
}
```

### Retry Logic

**Implemented in:** Video upload service

```typescript
// Retry with exponential backoff
const maxRetries = 3
let retryCount = 0

while (retryCount < maxRetries) {
  try {
    return await uploadVideoFile(videoUri)
  } catch (error) {
    retryCount++
    if (retryCount >= maxRetries) throw error
    await new Promise(resolve =>
      setTimeout(resolve, Math.pow(2, retryCount) * 1000)
    )
  }
}
```

### Network Resilience

**Redux UI State Tracks:**
- `networkConnected: boolean` - Network status in `uiSlice.ts`

**Usage:**
```typescript
const networkConnected = useSelector(state => state.ui.networkConnected)

if (!networkConnected) {
  return <OfflineNotification />
}
```

### Sentry Error Tracking

**Integration:** `@sentry/react-native`

**Setup:** Likely in app entry point

```typescript
import * as Sentry from "@sentry/react-native"

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.ENV,
  tracesSampleRate: 1.0
})
```

**Usage:**
```typescript
try {
  // Operation
} catch (error) {
  Sentry.captureException(error)
}
```

---

## 12. Performance Optimization

### Mobile App Optimizations

#### Image Optimization

**SafeImage Component:** `src/components/SafeImage.tsx`
- Lazy loads images
- Caches images locally
- Shows placeholder while loading
- Handles missing/broken images

#### List Performance

**FlatList Usage:**
```typescript
<FlatList
  data={reels}
  renderItem={({ item }) => <ReelItem reel={item} />}
  keyExtractor={item => item._id}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  removeClippedSubviews={true}
  windowSize={21} // Load 10 items ahead
  onEndReachedThreshold={0.5}
  onEndReached={loadMore}
/>
```

#### Data Fetching Optimization

**TanStack Query Configuration:**
```typescript
useQuery(['reels', page], () => fetchReels(page), {
  staleTime: 5 * 60 * 1000,          // 5 minutes
  cacheTime: 10 * 60 * 1000,         // 10 minutes
  keepPreviousData: true,            // Smooth pagination
  suspense: false                    // Optional
})
```

#### Code Splitting

**Expo Router:** File-based routing automatically splits code

```
app/
├── (main)/        → Main app bundle
├── auth/          → Auth bundle (lazy loaded)
└── onboarding/    → Onboarding bundle (lazy loaded)
```

#### Animation Performance

**React Native Reanimated:**
- Runs animations on native thread (not JS thread)
- Prevents frame drops during heavy rendering
- Used for smooth scroll, gesture responses

### Backend Optimizations

#### Database Query Optimization

**Indexed fields:**
```javascript
users: [
  { email: 1 },
  { username: 1 },
  { createdAt: -1 }
]

reels: [
  { userId: 1 },
  { createdAt: -1 },
  { competitionId: 1 }
]

follows: [
  { followerId: 1 },
  { followingId: 1 }
]
```

#### API Response Pagination

**Standard pagination:**
```javascript
GET /reels?page=1&limit=20

Response:
{
  items: [...],
  total: 500,
  page: 1,
  limit: 20,
  hasMore: true
}
```

#### Caching Strategy

**Server-side caching:**
- Cache trending hashtags (1 hour TTL)
- Cache banner data (24 hour TTL)
- Cache competition leaderboard (5 minute TTL)

### Bundle Size Management

**Dependencies to Monitor:**
- Redux Toolkit → Consider replacing with Zustand if not heavy use
- Axios → Already lean
- Sentry → Tree-shake unused parts in production

**Build Optimization:**
```json
// turbo.json
{
  "pipeline": {
    "build": {
      "outputs": ["dist/**"],
      "cache": true
    }
  }
}
```

---

## 13. Testing Strategy

### Current Testing Setup

**Frameworks Installed:**
- Jest (29.7.0)
- React Native Testing Library (12.4.2)
- @testing-library/jest-native (5.4.3)

### Testing Architecture

#### Unit Tests

**Testing API Services:**
```typescript
// src/api/services/__tests__/reelService.test.ts
describe('reelService', () => {
  it('should fetch reels successfully', async () => {
    jest.mock('../axios', () => ({
      get: jest.fn().mockResolvedValue({
        data: { success: true, data: [...] }
      })
    }))
    
    const result = await reelService.getReels()
    expect(result.success).toBe(true)
  })
  
  it('should handle API errors', async () => {
    jest.mock('../axios', () => ({
      get: jest.fn().mockRejectedValue(new Error('Network error'))
    }))
    
    const result = await reelService.getReels()
    expect(result.success).toBe(false)
  })
})
```

**Testing Custom Hooks:**
```typescript
// src/hooks/__tests__/useFollowStats.test.ts
describe('useFollowStats', () => {
  it('should fetch and return follow stats', async () => {
    const { result } = renderHook(() => useFollowStats('userId123'))
    
    await waitFor(() => {
      expect(result.current.stats.followers).toBe(42)
    })
  })
  
  it('should listen to follow updates', async () => {
    const { result } = renderHook(() => useFollowStats('userId123'))
    
    act(() => {
      followUpdateEmitter.emit('follow', {})
    })
    
    await waitFor(() => {
      expect(result.current.stats.followers).toBe(43)
    })
  })
})
```

#### Component Tests

```typescript
// src/components/__tests__/StatsSection.test.tsx
describe('StatsSection', () => {
  it('should display follower counts', () => {
    const { getByText } = render(
      <StatsSection
        followers={42}
        following={10}
        onFollowersPress={jest.fn()}
        onFollowingPress={jest.fn()}
      />
    )
    
    expect(getByText('42')).toBeTruthy()
    expect(getByText('10')).toBeTruthy()
  })
  
  it('should call navigation handler on press', () => {
    const onPress = jest.fn()
    const { getByText } = render(
      <StatsSection
        followers={42}
        following={10}
        onFollowersPress={onPress}
      />
    )
    
    fireEvent.press(getByText('42'))
    expect(onPress).toHaveBeenCalled()
  })
})
```

#### Integration Tests

**Testing Complete Follow Flow:**
```typescript
describe('Follow Feature Integration', () => {
  it('should complete follow action and update UI', async () => {
    // Mock API responses
    jest.mock('../api/services', () => ({
      followUser: jest.fn().mockResolvedValue({ success: true })
    }))
    
    // Render component
    const { getByTestId } = render(<FollowersScreen userId="user1" />)
    
    // Click follow button
    fireEvent.press(getByTestId('follow-button-user2'))
    
    // Wait for update
    await waitFor(() => {
      expect(getByTestId('follower-user2')).toHaveProps({
        isFollowing: true
      })
    })
  })
})
```

### Test Configuration

**jest.config.js** (from package.json):
```javascript
module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/setup-tests.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
```

### Test Scripts

```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

### Testing Best Practices

1. **Mock External APIs** - Use Jest mocks for service calls
2. **Test Edge Cases** - Error handling, empty states, network failures
3. **Snapshot Testing** - For component structure (use sparingly)
4. **Integration Tests** - Test complete user flows
5. **Accessibility Testing** - Verify components are accessible

---

## 14. Build & Deployment

### Monorepo Build Pipeline

**Turborepo Configuration** (`turbo.json`)

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", ".expo/**"],
      "cache": true
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": [],
      "cache": true
    }
  }
}
```

**Build Command Execution:**
```bash
# Installs dependencies, then builds all apps
turbo build

# Runs in parallel:
# 1. yarn build:mobile
# 2. yarn build:admin
# 3. yarn build:videoeditor
# 4. backend compilation
```

### Mobile App Build Pipeline

**iOS/Android Build:** EAS CLI integration

**eas.json Configuration:**
```json
{
  "build": {
    "preview": {
      "android": { "buildType": "apk" },
      "ios": { "buildType": "simulator" }
    },
    "production": {
      "android": { "buildType": "aab" },
      "ios": {}
    }
  },
  "submit": {
    "production": {
      "android": { "serviceAccount": "..." },
      "ios": {}
    }
  }
}
```

**Build Scripts:**
```bash
# Local development
npm start                 # Start Expo dev server
npm run android           # Build for Android
npm run ios              # Build for iOS

# Production
eas build --platform android --profile production
eas build --platform ios --profile production
eas submit --platform android --profile production
```

### Admin Dashboard Build

**Next.js Build:**
```bash
cd apps/gully-fame-admin
npm run build            # Optimized production build
npm start               # Start production server
```

**Deployment:**
- Vercel (default Next.js hosting)
- AWS S3 + CloudFront
- Custom VPS with Node.js

### Backend Build & Deployment

**Current Status:** Backend in root (non-modular)

**Containerization:**
```dockerfile
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

**Docker Compose** (Local Development):
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
  
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017
    depends_on:
      - mongodb
```

**Deployment Targets:**
- AWS EC2 + Docker
- Heroku
- Railway.app
- Custom VPS

### Environment Configuration

**Mobile (.env):**
```
EXPO_PUBLIC_API_BASE_URL=https://gullyfame.com/v1/api/
EXPO_PUBLIC_SENTRY_DSN=...
```

**Admin (.env.local):**
```
NEXT_PUBLIC_API_URL=https://gullyfame.com/v1/api/
```

**Backend (.env):**
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

---

## 15. Development Workflow

### Local Development Setup

**Prerequisites:**
- Node.js >= 18
- Yarn v4
- Android Studio (for Android development)
- Xcode (for iOS development)

**Initial Setup:**
```bash
# Clone repository
git clone <repo-url>
cd cultre-boat-monorepo

# Install dependencies
yarn install

# Set up environment
cp .env.example .env
# Edit .env with local values

# Start development servers
yarn dev
```

**Monorepo Structure Navigation:**
```bash
# Work in mobile app
cd apps/gully-fame-mobile
npm start

# Work in admin
cd apps/gully-fame-admin
npm run dev

# Work in backend
cd gully-fame-backend
npm run dev (if script exists)

# Work in shared package
cd packages/video-editor-core
npm run build
```

### Git Workflow

**Branch Strategy:**
- `main` - Production ready
- `develop` - Integration branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Production hotfixes

**Pre-commit Hooks** (`.husky/`)
- Runs ESLint
- Runs Prettier
- Prevents commits with lint errors

**Commit Linting** (`.commitlintrc`)
- Enforces conventional commits
- Format: `type(scope): message`
- Types: feat, fix, docs, style, refactor, test, chore

### Code Quality Tools

**ESLint Configuration:**
```javascript
// .eslintignore
node_modules
dist
.expo
.next
build
coverage
```

**Prettier Configuration** (`.prettierrc`):
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### Development Commands

```bash
# Root level (all apps)
yarn dev              # Start all dev servers
yarn build            # Build all apps
yarn lint             # Lint all code
yarn clean            # Clean all build artifacts

# Individual apps
yarn start:mobile     # Start mobile app (Expo)
yarn start:admin      # Start admin dashboard
yarn eas-build-pre-install  # Prepare for EAS build
```

---

## 16. Security Architecture

### Authentication Security

1. **JWT Tokens**
   - Signed with server secret
   - Include user ID, email, role
   - Expiration set (recommend 24 hours)
   - Refresh token for long sessions

2. **Token Storage**
   - Mobile: AsyncStorage + Secure Store for sensitive data
   - Web: localStorage with secure flag
   - Never stored in plain text

3. **HTTPS Enforcement**
   - All API calls use HTTPS
   - Certificate pinning (recommended)
   - TLS 1.2+

### Data Security

1. **Encryption**
   - Passwords: Bcrypt (server-side)
   - Sensitive data: AES-256 at rest
   - Transit: TLS/SSL

2. **PII Protection**
   - KYC data encrypted
   - Payment data handled by Razorpay (PCI-DSS compliant)
   - Access logs for audit trail

### API Security

1. **CORS Policy**
   ```typescript
   headers: {
     "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGINS,
     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
     "Access-Control-Allow-Headers": "Content-Type, Authorization"
   }
   ```

2. **Rate Limiting**
   - Recommended: 100 requests/minute per IP
   - Per-user limits for authenticated endpoints

3. **Input Validation**
   - Schema validation with Yup (frontend)
   - Server-side validation (backend)
   - Sanitization of user inputs

4. **SQL/NoSQL Injection Prevention**
   - Mongoose prevents injection via schema
   - Parameterized queries
   - Input sanitization

### Content Security

1. **Moderation**
   - Admin dashboard for content review
   - Report system for user-flagged content
   - KYC verification for creators

2. **Video Security**
   - Scan uploads for malware
   - Video codec validation
   - File size limits

### Secrets Management

**Recommended Implementation:**
- Use environment variables (currently done)
- Rotate secrets regularly
- Never commit .env files
- Use Vault for production secrets

---

## 17. Data Models

### User Model

```typescript
interface User {
  _id: string
  email: string
  username: string
  displayName: string
  profilePicture: string
  bio: string
  
  // Follow system
  followers: number
  following: number
  followersList?: string[] // IDs of followers
  followingList?: string[] // IDs of following
  
  // Account status
  isKycVerified: boolean
  kycDocument?: ObjectId
  
  // Roles and permissions
  role: 'USER' | 'CREATOR' | 'ADMIN' | 'SPONSOR' | 'MODERATOR'
  isActive: boolean
  isBanned: boolean
  
  // Monetization
  wallet?: ObjectId
  earnedCoins: number
  totalEarnings: number
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date
}
```

### Reel Model

```typescript
interface Reel {
  _id: string
  userId: string // Creator
  title: string
  description: string
  
  // Media
  videoUrl: string
  thumbnailUrl: string
  duration: number
  
  // Engagement
  likes: number
  comments: number
  shares: number
  views: number
  
  // Categorization
  category: string
  hashtags: string[]
  competitionId?: string
  
  // Status
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED'
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}
```

### Competition Model

```typescript
interface Competition {
  _id: string
  title: string
  description: string
  rules: string
  
  // Sponsor/Ownership
  sponsorId: string
  
  // Timing
  startDate: Date
  endDate: Date
  status: 'CREATED' | 'LIVE' | 'COMPLETED' | 'CANCELLED'
  
  // Participation
  participantCount: number
  minAge?: number
  maxAge?: number
  
  // Rewards
  prizePool: number
  winners: Array<{
    rank: number
    userId: string
    prize: number
  }>
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}
```

### Payment Model

```typescript
interface Payment {
  _id: string
  userId: string
  
  // Payment details
  type: 'COIN_PURCHASE' | 'SUPPORT_PAYMENT' | 'EARNING' | 'WITHDRAWAL'
  amount: number
  coins: number
  currency: string
  
  // Razorpay integration
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature?: string
  
  // Status
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  
  // Metadata
  createdAt: Date
  completedAt?: Date
  failureReason?: string
}
```

### Follow Model

```typescript
interface Follow {
  _id: string
  followerId: string // The user doing the following
  followingId: string // The user being followed
  createdAt: Date
}
```

---

## 18. Feature Modules

### Feed/Timeline Feature

**Files:**
- `src/screens/FeedScreen.tsx` - Main feed container
- `src/components/timeline/` - Timeline components
- `src/api/services/reelService.ts` - Reel API

**Functionality:**
- Infinite scroll reel feed
- Like/unlike reels
- Comment on reels
- Share reels
- View creator profile

### Profile Feature

**Files:**
- `app/(main)/profile/own/` - Own profile screens (participant/fan)
- `app/(main)/profile/user/` - Other user profiles
- `src/components/profile/` - Profile components
- `src/api/services/userService.ts` - User API

**Functionality:**
- View own/other profiles
- Edit own profile
- Follow/unfollow users
- View follower/following lists
- View user's reels
- KYC verification

### Competition Feature

**Files:**
- `app/(main)/competitions/` - Competition screens
- `src/components/` - Competition components
- `src/api/services/competitionService.ts` - Competition API
- `src/store/slices/competitionsSlice.ts` - Competition state

**Functionality:**
- Browse competitions
- Join/leave competitions
- Submit reels to competitions
- View leaderboard
- Track standings

### Payment/Monetization Feature

**Files:**
- `src/api/services/paymentIntegrationService.ts` - Payment API
- Components for payment UI
- `apps/gully-fame-admin` - Admin payment management

**Functionality:**
- Buy coins (via Razorpay)
- Send tips/support payments
- View wallet balance
- View payment history
- Creator earnings tracking

### Search Feature

**Files:**
- `src/api/services/searchService.ts` - Search API
- Search screens
- `src/components/search/` - Search UI

**Functionality:**
- Search users
- Search reels
- Search competitions
- Search hashtags
- Trending hashtags
- Search history

### Admin Dashboard

**Files:**
- `apps/gully-fame-admin/` - Entire admin app
- `src/api/services/adminService.ts` - Admin APIs

**Functionality:**
- User management
- Content moderation
- Competition management
- Analytics/dashboard
- Report management
- Payment tracking

---

## 19. Component Architecture

### Component Hierarchy

```
App
├── AuthStack
│   ├── LoginScreen
│   ├── RegisterScreen
│   └── OTPVerificationScreen
├── OnboardingStack
│   ├── WelcomeScreen
│   ├── PermissionsScreen
│   └── KYCScreen
└── MainStack
    ├── HomeTab
    │   ├── FeedScreen
    │   │   └── ReelItem
    │   │       ├── VideoPlayer
    │   │       ├── UserInfo
    │   │       └── InteractionBar
    │   │           ├── LikeButton
    │   │           ├── CommentButton
    │   │           └── ShareButton
    │   └── DiscoveryScreen
    │
    ├── CompetitionsTab
    │   ├── CompetitionsListScreen
    │   │   └── CompetitionCard
    │   └── CompetitionDetailScreen
    │       ├── LeaderboardTab
    │       ├── SubmissionsTab
    │       └── RulesTab
    │
    ├── ProfileTab
    │   ├── OwnProfileScreen
    │   │   ├── StatsSection
    │   │   ├── ReelsGrid
    │   │   └── ProfileSettings
    │   ├── OtherUserProfileScreen
    │   ├── FollowersScreen
    │   │   └── FollowerItem
    │   └── FollowingScreen
    │       └── FollowingItem
    │
    └── SearchTab
        ├── SearchScreen
        │   ├── SearchResultsUsers
        │   ├── SearchResultsReels
        │   └── SearchResultsCompetitions
        └── TrendingScreen
```

### Reusable Component Library

**UI Primitives** (`src/components/ui/`)
- Buttons with variants (primary, secondary, ghost)
- Input fields with validation
- Cards and containers
- Modals and bottom sheets
- Loading spinners
- Error states
- Badges and tags

**Themed Components** (`src/components/`)
- `themed-text.tsx` - Text with theme support
- `themed-view.tsx` - View with theme support
- `themed-text-input.tsx` - Input with theme support

**Feature-Specific Components:**
- Reel player with controls
- Comment section
- Follow button
- Competition card
- Leaderboard

---

## 20. Routing & Navigation

### Expo Router Structure

**File-based Routing** (Expo Router v6)

```
app/
├── _layout.tsx                    # Root layout
├── index.tsx                      # Entry point (splash/landing)
│
├── auth/
│   ├── _layout.tsx               # Auth stack layout
│   ├── login.tsx
│   ├── register.tsx
│   └── otp-verification.tsx
│
├── onboarding/
│   ├── _layout.tsx               # Onboarding stack layout
│   ├── welcome.tsx
│   ├── permissions.tsx
│   └── kyc.tsx
│
└── (main)/                        # Main app layout (drawer/tabs)
    ├── _layout.tsx               # Main navigation structure
    │
    ├── feed/
    │   ├── index.tsx             # Home feed screen
    │   └── [reelId].tsx          # Reel detail screen (dynamic)
    │
    ├── competitions/
    │   ├── index.tsx             # Competitions list
    │   └── [competitionId].tsx   # Competition detail (dynamic)
    │
    ├── profile/
    │   ├── own/
    │   │   ├── participant.tsx    # Own profile (participant)
    │   │   └── fan.tsx           # Own profile (fan)
    │   ├── user/
    │   │   └── participant/
    │   │       └── [id].tsx      # Other user profile (dynamic)
    │   └── followers/
    │       └── [id].tsx          # Followers/following screen (dynamic)
    │
    └── search/
        ├── index.tsx             # Search screen
        └── results.tsx           # Search results
```

### Navigation Patterns

**Navigate by Name:**
```typescript
import { useRouter } from 'expo-router'

const router = useRouter()

// Simple navigation
router.push('/feed')

// With parameters
router.push({
  pathname: '/profile/user/participant/[id]',
  params: { id: 'userId123' }
})

// Go back
router.back()
```

**React Navigation Integration:**
```typescript
import { useNavigation } from '@react-navigation/native'

const navigation = useNavigation()

navigation.navigate('Followers', {
  userId: 'user123',
  tab: 'followers'
})
```

### Deep Linking

**Scheme:** `gullyfame://`

**Examples:**
```
gullyfame://feed
gullyfame://profile/user123
gullyfame://competitions/comp123
gullyfame://reels/reel123
```

---

## 21. Storage & Caching

### Local Storage (Mobile)

#### AsyncStorage

**Purpose:** Persistent key-value store

**Usage Patterns:**
```typescript
// Auth token storage
await AsyncStorage.setItem('authToken', token)
const token = await AsyncStorage.getItem('authToken')
await AsyncStorage.removeItem('authToken')

// User preferences
await AsyncStorage.setItem('theme', 'dark')
await AsyncStorage.setItem('language', 'en')

// Cache expiring data
const cacheKey = 'reels_page_1'
await AsyncStorage.setItem(cacheKey, JSON.stringify(reels))
```

#### Secure Storage

**Purpose:** Encrypted storage for sensitive data

**Usage:**
```typescript
import * as SecureStore from 'expo-secure-store'

// Store sensitive data
await SecureStore.setItemAsync('biometric_enabled', 'true')

// Retrieve sensitive data
const enabled = await SecureStore.getItemAsync('biometric_enabled')
```

### File System Caching

**Purpose:** Cache videos, images, documents

```typescript
import * as FileSystem from 'expo-file-system'

const cacheDir = FileSystem.cacheDirectory
const documentDir = FileSystem.documentDirectory

// Cache video
const videoUri = await FileSystem.copyAsync({
  from: downloadedVideoUri,
  to: `${cacheDir}video_${Date.now()}.mp4`
})

// Clear cache
await FileSystem.deleteAsync(cacheDir)
```

### TanStack Query Caching

**Purpose:** Server state caching with automatic invalidation

**Configuration:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes
      cacheTime: 10 * 60 * 1000,       // 10 minutes
      retry: 1,                         // Retry once on failure
      retryDelay: 1000
    }
  }
})
```

**Usage:**
```typescript
// Auto-cached
const { data: reels } = useQuery(['reels', page], () => fetchReels(page))

// Manual invalidation
queryClient.invalidateQueries({ queryKey: ['reels'] })

// Prefetching
queryClient.prefetchQuery(['reels', 2], () => fetchReels(2))
```

### Media Library

**Purpose:** Cache images and videos from device storage

```typescript
import * as MediaLibrary from 'expo-media-library'

// Get albums
const albums = await MediaLibrary.getAlbumsAsync()

// Get photos
const photos = await MediaLibrary.getAssetsAsync({
  mediaType: 'photo',
  first: 50
})

// Save to library
await MediaLibrary.saveToLibraryAsync(videoUri)
```

---

## 22. Media Handling

### Video Upload Process

**File:** `src/api/services/videoUploadService.ts`

**Complete Upload Flow:**

```
┌─────────────────────────────────────────┐
│  1. SELECT VIDEO FROM LIBRARY            │
│  videoUri = 'file://...'                 │
└──────────────┬──────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│  2. VALIDATE VIDEO                      │
│  - Check file size < 500MB               │
│  - Check duration < 10 minutes          │
│  - Check codec support                   │
└──────────────┬──────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│  3. UPLOAD VIDEO FILE                    │
│  - Multipart form data                  │
│  - Progress tracking                    │
│  - Retry on failure                     │
└──────────────┬──────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│  4. SERVER PROCESSES VIDEO              │
│  - Store in storage (S3/Firebase)       │
│  - Generate thumbnail                   │
│  - Return uploadId                      │
└──────────────┬──────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│  5. CREATE REEL METADATA                 │
│  POST /reels with uploadId              │
│  - Add title, description               │
│  - Add category, hashtags               │
│  - Optionally add competition           │
└──────────────┬──────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│  6. COMPLETE - REEL PUBLISHED            │
│  reelId returned                        │
└─────────────────────────────────────────┘
```

**Implementation:**

```typescript
export async function uploadVideoComplete(
  videoUri: string,
  request: VideoUploadRequest,
  onProgress?: (progress: UploadProgress) => void
): Promise<ApiResponse<VideoUploadResponse>> {
  try {
    // 1. Upload video file
    const uploadResponse = await uploadVideoFile(
      videoUri,
      onProgress
    )
    
    if (!uploadResponse.success) {
      return uploadResponse
    }
    
    // 2. Create reel metadata
    const reelResponse = await createReelFromUpload(
      uploadResponse.data.uploadId,
      request
    )
    
    return reelResponse
  } catch (error) {
    return {
      success: false,
      error: 'Upload failed',
      status: 500
    }
  }
}
```

### Image Handling

#### Image Picker

```typescript
import * as ImagePicker from 'expo-image-picker'

const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8
})

if (!result.canceled) {
  const imageUri = result.assets[0].uri
}
```

#### Image Optimization

**SafeImage Component:**
```typescript
interface SafeImageProps {
  source: string
  style?: object
  placeholder?: string
}

export const SafeImage = ({ source, placeholder }: SafeImageProps) => {
  const [uri, setUri] = useState<string | null>(null)
  const [error, setError] = useState(false)
  
  useEffect(() => {
    // Validate and load image
    if (source) {
      Image.prefetch(source)
        .then(() => setUri(source))
        .catch(() => setError(true))
    }
  }, [source])
  
  return (
    <Image
      source={{ uri: uri || placeholder }}
      style={{ width: 200, height: 200 }}
    />
  )
}
```

#### Image Processing

```typescript
import * as ImageManipulator from 'expo-image-manipulator'

const manipResult = await ImageManipulator.manipulateAsync(
  imageUri,
  [{ resize: { width: 400, height: 400 } }],
  { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
)
```

### Camera Access

**Video Recording:**
```typescript
import { Camera, CameraType } from 'expo-camera'

const [permission, requestPermission] = Camera.useCameraPermissions()

const recordVideo = async () => {
  const video = await cameraRef.current.recordAsync()
  const videoUri = video.uri
}
```

### Video Playback

**Expo Video:**
```typescript
import { VideoView, useVideoPlayer } from 'expo-video'

const player = useVideoPlayer(videoUri, player => {
  player.loop = false
  player.playbackRate = 1
})

return <VideoView player={player} style={{ width: 300, height: 400 }} />
```

---

## 23. Payment Integration

### Razorpay Integration

**Service:** `src/api/services/paymentIntegrationService.ts`

**Complete Payment Flow:**

```
┌───────────────────────────────────────────────┐
│  1. USER INITIATES COIN PURCHASE               │
│  - Select coin package                        │
│  - Confirm purchase                           │
└──────────────┬────────────────────────────────┘
               ▼
┌───────────────────────────────────────────────┐
│  2. CREATE RAZORPAY ORDER (Backend)            │
│  POST /payments/initiate                      │
│  - Package ID, amount                         │
│  - Returns: orderId, key                      │
└──────────────┬────────────────────────────────┘
               ▼
┌───────────────────────────────────────────────┐
│  3. OPEN RAZORPAY CHECKOUT                     │
│  - Display payment UI                         │
│  - User enters card/wallet details            │
│  - Show loading during payment                │
└──────────────┬────────────────────────────────┘
               ▼
┌───────────────────────────────────────────────┐
│  4. RAZORPAY PROCESSES PAYMENT                 │
│  - User completes payment                     │
│  - Returns: paymentId, signature              │
└──────────────┬────────────────────────────────┘
               ▼
┌───────────────────────────────────────────────┐
│  5. VERIFY PAYMENT (Backend)                   │
│  POST /payments/verify                        │
│  - Validate signature                         │
│  - Update wallet balance                      │
│  - Record transaction                         │
└──────────────┬────────────────────────────────┘
               ▼
┌───────────────────────────────────────────────┐
│  6. SUCCESS - COINS ADDED                      │
│  - Show success message                       │
│  - Update UI with new balance                 │
└───────────────────────────────────────────────┘
```

**Implementation:**

```typescript
// 1. Get available packages
const packages = await getCoinPackages()

// 2. Initiate payment
const { orderId, key } = await initiatePayment({
  packageId: selectedPackage.id,
  coins: selectedPackage.coins
})

// 3. Open Razorpay checkout
const result = await processRazorpayPayment(orderId, amount)

// 4. Verify payment
const verified = await verifyPayment({
  razorpayOrderId: result.orderId,
  razorpayPaymentId: result.paymentId
})

if (verified.success) {
  // Update UI with new wallet balance
}
```

### Wallet System

**Balance Query:**
```typescript
const wallet = await getWalletBalance()
// Returns: { coins: 500, balance: 5000, lastUpdated: Date }
```

**Transaction History:**
```typescript
const history = await getPaymentHistory(limit: 20, offset: 0)
// Returns: Array of payments with date, amount, type, status
```

### Support Payments (Tips)

**Tipping System:**
```typescript
const supportResponse = await sendSupportPayment({
  recipientId: creatorId,
  reelId: reelId,
  coins: 10,
  message: 'Great content!'
})
```

---

## 24. Monitoring & Analytics

### Error Tracking with Sentry

**Integration Points:**
- Uncaught exceptions
- API errors
- Custom errors

**Usage:**
```typescript
import * as Sentry from '@sentry/react-native'

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.ENV,
  tracesSampleRate: 1.0
})

// Capture error
try {
  // Operation
} catch (error) {
  Sentry.captureException(error, {
    tags: { component: 'ReelPlayer' }
  })
}

// Capture message
Sentry.captureMessage('User action logged')
```

### Logging Strategy

**Console Logging Pattern:**

```typescript
// Service logs
console.log('[reelService] GET Reels')
console.error('[reelService] Error fetching reels:', error)

// API logs
console.log('[axios] Request Details:', { method, url, headers })
console.log('[axios] Response Success:', { status, url })

// Hook logs
console.log('[useFollowStats] Fetching stats for user:', userId)
console.log('[FollowersScreen] Follow event received')
```

**Log Levels:**
- `console.log()` - Informational
- `console.warn()` - Warnings (handled errors)
- `console.error()` - Errors (unhandled exceptions)

### Analytics Events (Recommended)

**Key Events to Track:**
- User registration
- User login/logout
- Content viewed
- Content shared
- Like/comment action
- Competition joined
- Payment completed
- Video uploaded
- Profile visited
- Search performed

**Implementation (Firebase Analytics):**
```typescript
import { analytics } from 'firebase/app'
import { logEvent } from 'firebase/analytics'

logEvent(analytics, 'video_shared', {
  reel_id: reelId,
  shared_to: platform,
  timestamp: Date.now()
})
```

---

## 25. Internationalization & Localization

### Current Status

**Not explicitly configured in codebase**

### Recommended Implementation

**i18n Setup with i18next:**

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    hi: { translation: hiTranslations }
  },
  lng: 'en',
  interpolation: { escapeValue: false }
})
```

**Usage in Components:**
```typescript
import { useTranslation } from 'react-i18next'

const MyComponent = () => {
  const { t } = useTranslation()
  return <Text>{t('common.welcome')}</Text>
}
```

### Supported Languages (Recommended)

- English (en)
- Hindi (hi)
- Regional languages (Tamil, Telugu, Kannada, Malayalam)

---

## 26. Code Quality & Standards

### TypeScript Configuration

**tsconfig.json** (Root)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `ReelCard.tsx`)
- Hooks: `camelCase.ts` starting with `use` (e.g., `useFollowStats.ts`)
- Services: `camelCase.ts` (e.g., `reelService.ts`)
- Types: `types.ts` or `types/file.ts`

**Functions/Variables:**
- Functions: `camelCase` (e.g., `fetchReels`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_VIDEO_SIZE`)
- Private functions: prefix with `_` (e.g., `_validateInput`)

**Types/Interfaces:**
- Interfaces: `PascalCase` starting with `I` (e.g., `IUser`) or just `PascalCase` (e.g., `User`)
- Enums: `PascalCase` (e.g., `UserRole`)
- Types: `PascalCase` (e.g., `UserProfile`)

### Code Organization

**Single Responsibility Principle:**
- Each file has one primary responsibility
- Services handle API calls
- Components handle UI
- Hooks handle state logic
- Utils handle pure functions

**Module Organization:**
```
feature/
├── screens/          # Container components
├── components/       # Presentational components
├── hooks/           # Feature-specific hooks
├── services/        # Feature API services
├── types.ts         # Feature types
└── index.ts         # Public exports
```

### Linting & Formatting

**ESLint Rules:**
- No console logs in production
- No unused variables
- Consistent indentation
- No implicit any types

**Prettier:**
- 80 character line width
- 2 space indentation
- Trailing commas
- Single quotes preferred

---

## 27. Third-Party Integrations

### Firebase

**Services Used:**
- Authentication (optional, currently using JWT)
- Firestore/Realtime Database (optional)
- Cloud Storage (optional, for media)
- Analytics (recommended)

**Setup:**
```typescript
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
```

### Razorpay

**Integration:** Complete (see Payment Integration section)

### Socket.io

**Purpose:** Real-time communication

**Setup:**
```typescript
import io from 'socket.io-client'

const socket = io(process.env.EXPO_PUBLIC_API_BASE_URL, {
  auth: {
    token: authToken
  }
})

socket.on('follow', (data) => {
  // Handle follow event
})

socket.on('disconnect', () => {
  // Handle disconnection
})
```

### Google Sign-In

**Purpose:** OAuth authentication

**Setup:**
```typescript
import {
  GoogleSignin,
  statusCodes
} from '@react-native-google-signin/google-signin'

GoogleSignin.configure({
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
  hostedDomain: 'gullyfame.com'
})

const user = await GoogleSignin.signIn()
```

### AWS S3 (Recommended for Media)

**Usage:** Upload and store videos/images

```typescript
import { S3 } from 'aws-sdk'

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
})

const upload = await s3.upload({
  Bucket: 'gullyfame-media',
  Key: `videos/${reelId}.mp4`,
  Body: videoBuffer
})
```

---

## 28. Mobile-Specific Considerations

### Platform Differences

**iOS-Specific:**
- App Store requirements (app review, guidelines)
- Provisioning profiles
- Code signing certificates
- Push notification setup

**Android-Specific:**
- Play Store requirements
- Debug keystore + release keystore
- Firebase Cloud Messaging
- Biometric authentication

### Performance on Mobile

**Memory Management:**
- Unload images not visible on screen
- Clean up subscriptions/listeners
- Use `memo` for expensive components

```typescript
export const ReelCard = memo(({ reel }) => {
  // Component only re-renders if reel prop changes
  return <View>...</View>
}, (prevProps, nextProps) => prevProps.reel.id === nextProps.reel.id)
```

**Battery Optimization:**
- Reduce background tasks
- Minimize location polling
- Use efficient animations
- Optimize database queries

### Permissions

**Required Permissions:**
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

**Runtime Permissions:**
```typescript
import { useCameraPermissions, useMediaLibraryPermissions } from 'expo-media-library'

const [cameraPermission, requestCameraPermission] = useCameraPermissions()

if (!cameraPermission?.granted) {
  await requestCameraPermission()
}
```

### Network Handling

**Connection Detection:**
```typescript
import NetInfo from '@react-native-community/netinfo'

const unsubscribe = NetInfo.addEventListener(state => {
  dispatch(setNetworkConnected(state.isConnected))
})
```

**Offline Support:**
- Queue actions for sending when online
- Use cached data when offline
- Sync when connection restored

---

## 29. Performance Benchmarks

### Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| **Mobile App** | | |
| App startup time | < 3s | ? |
| Screen load time | < 2s | ? |
| Reel render time | < 500ms | ? |
| FPS during scroll | 60 FPS | ? |
| Memory usage | < 200MB | ? |
| **API Endpoints** | | |
| /reels response | < 500ms | ? |
| /users/profile response | < 300ms | ? |
| /competitions response | < 400ms | ? |
| Database query time | < 100ms | ? |

### Optimization Checklist

**Before Release:**
- [ ] Bundle size analyzed
- [ ] Images optimized
- [ ] Unnecessary dependencies removed
- [ ] Database indexes created
- [ ] API response times measured
- [ ] Memory leaks checked
- [ ] Slow screens profiled
- [ ] Network requests batched

---

## 30. Known Issues & Technical Debt

### Current Issues

1. **Backend Structure:**
   - Non-modular backend (all code in root)
   - Should be refactored into services/controllers/models
   - Recommended: Create folder structure

2. **Missing Tests:**
   - Test infrastructure set up but no tests written
   - Need unit tests for services
   - Need integration tests for critical flows
   - Need component tests

3. **Internationalization:**
   - Not implemented
   - Recommended: Add i18next for multi-language support

4. **Rate Limiting:**
   - Not implemented on backend
   - Recommend: Add express-rate-limit

5. **Caching Strategy:**
   - Minimal caching configured
   - Recommend: Add Redis for backend caching

6. **Token Refresh:**
   - Not explicitly handled in interceptor
   - Should auto-refresh expired tokens

7. **Logging:**
   - Only console logs
   - Recommend: Add structured logging (Winston, Bunyan)

### Tech Debt

1. **Backend Refactoring:**
   ```
   gully-fame-backend/
   ├── src/
   │   ├── routes/
   │   ├── controllers/
   │   ├── models/
   │   ├── services/
   │   ├── middleware/
   │   └── utils/
   ├── tests/
   ├── config/
   └── index.js
   ```

2. **Frontend State Management:**
   - Redux + Zustand + Context = too many state management solutions
   - Consolidate to single approach

3. **Dependency Versions:**
   - Review and update to latest stable versions
   - Consider removing unused dependencies

---

## 31. Future Roadmap & Scalability

### Short-Term Roadmap (1-3 months)

**Priority 1 - Stability:**
- [ ] Write comprehensive tests
- [ ] Implement rate limiting
- [ ] Add structured logging
- [ ] Set up monitoring dashboards
- [ ] Handle token refresh automatically

**Priority 2 - Performance:**
- [ ] Implement Redis caching
- [ ] Optimize database queries
- [ ] Add CDN for media delivery
- [ ] Implement pagination for all lists
- [ ] Add image lazy loading

**Priority 3 - Features:**
- [ ] Direct messaging system
- [ ] Live streaming support
- [ ] Notifications system
- [ ] Advanced analytics for creators
- [ ] Recommendation engine

### Long-Term Roadmap (3-12 months)

**Scalability Improvements:**
1. **Microservices Migration:**
   - Split backend into microservices:
     - Auth Service
     - User Service
     - Content Service
     - Payment Service
     - Analytics Service
   - Use message queues (RabbitMQ/Kafka)
   - API Gateway (Kong, AWS API Gateway)

2. **Database Scaling:**
   - Database replication (read replicas)
   - Sharding for horizontal scaling
   - Consider document database alternatives
   - Implement connection pooling

3. **Media Infrastructure:**
   - CDN for video delivery (Cloudflare, AWS CloudFront)
   - Video transcoding service (AWS Elemental, FFmpeg)
   - Image resizing service (ImageMagick, Thumbor)
   - Background job processing (Bull, Celery)

4. **Real-Time Enhancements:**
   - WebSocket server scaling (Redis Adapter for Socket.io)
   - Real-time notifications (Pub/Sub)
   - Live streaming (RTMP/HLS)

### Architecture Evolution

**Current (Monolithic Backend):**
```
┌─────────────────────────┐
│   All APIs in One       │
│   Express Server        │
│   (Users, Reels,        │
│    Payments, etc.)      │
└────────────┬────────────┘
             │
          MongoDB
```

**Future (Microservices):**
```
┌────────────────────────────────────────────┐
│            API Gateway                      │
└────┬────────────┬────────────┬────────────┘
     │            │            │
     ▼            ▼            ▼
┌─────────┐ ┌─────────┐ ┌──────────┐
│ Auth    │ │ Content │ │ Payments │
│Service  │ │ Service │ │ Service  │
└────┬────┘ └────┬────┘ └────┬─────┘
     │           │            │
     └───────────┴────────────┘
            │
         MongoDB
        (Sharded)
```

### Technology Upgrades

**Recommended Updates:**
1. **React Native:** Upgrade to latest New Architecture
2. **Expo:** Latest stable version
3. **Next.js:** Stay on latest (14.x)
4. **Express:** Consider alternatives (Fastify, Nest.js)
5. **MongoDB:** Consider migrating to cloud (MongoDB Atlas)

### Developer Experience Improvements

1. **Code Generation:**
   - Generators for new features, services, components
   - OpenAPI spec generation from code

2. **Developer Tools:**
   - Local development with Docker Compose
   - Database seeding script
   - Mock API server

3. **Documentation:**
   - API documentation (Swagger/OpenAPI)
   - Component Storybook
   - Architecture decision records (ADRs)

### Security Roadmap

1. **Authentication:**
   - Implement 2FA
   - Social login integration (Google, Apple)
   - Biometric authentication

2. **Authorization:**
   - Role-based access control (RBAC) formalization
   - Attribute-based access control (ABAC) for complex scenarios

3. **Data Protection:**
   - End-to-end encryption for messages
   - Data anonymization for analytics
   - GDPR compliance

---

## Conclusion

Gully Fame's architecture demonstrates a modern, scalable approach to building a short-form video social platform. The monorepo structure using Turborepo provides excellent developer experience and code sharing capabilities. The use of React Native and Expo enables cross-platform mobile development, while Next.js powers the admin dashboard.

### Key Strengths:
✅ Type-safe codebase with TypeScript  
✅ Real-time features with event-driven architecture  
✅ Modern state management patterns  
✅ Comprehensive API layer with interceptors  
✅ Mobile-optimized architecture  
✅ Error tracking and monitoring integration  

### Immediate Action Items:
1. Implement comprehensive test suite
2. Refactor backend into modular structure
3. Add rate limiting and caching
4. Enhance token refresh mechanism
5. Set up structured logging

### Long-Term Vision:
The platform is well-positioned for scaling to microservices, adding real-time features, and supporting creator monetization at scale. The foundational architecture supports both feature expansion and infrastructure scaling.

---

**Document prepared for technical onboarding and architectural reference.**

