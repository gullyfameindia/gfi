# 🌐 API Integration Guide

Complete guide for integrating real API endpoints with the hybrid mock/API system.

## Overview

The Gully Fame Mobile app uses a **hybrid approach**:
- **Development**: Mock data for fast feedback
- **Production**: Real API with mock fallback
- **All Environments**: Seamless switching between mock and real data

This guide covers:
1. API Architecture
2. Service Structure
3. Endpoint Mapping
4. Integration Steps
5. Testing Verification
6. Troubleshooting

---

## 1. API Architecture

### Request Flow

```
┌─────────────────┐
│  UI Component   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  Service Layer (API)    │
│ - musicLibraryService   │
│ - videoEditorService    │
│ - feedService           │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌─────────┐ ┌──────────┐
│  REAL   │ │   MOCK   │
│   API   │ │   DATA   │
│ (if ok) │ │(fallback)│
└─────────┘ └──────────┘
```

### Request Logic

Each service follows this pattern:

```typescript
async function getData() {
  try {
    // 1. Check if API should be used
    if (!shouldUseApi()) {
      return getMockData(); // Use mock directly
    }

    // 2. Try API
    const response = await apiClient.get('/endpoint');
    return normalizeResponse(response);
  } catch (error) {
    // 3. Check if should fallback to mock
    if (shouldFallbackToMock(error)) {
      return getMockData();
    }

    // 4. Throw error if not recoverable
    throw error;
  }
}
```

---

## 2. Service Structure

### musicLibraryService

**File:** `src/api/services/musicLibraryService.ts`

**Endpoints:**

| Method | API Endpoint | Mock Source | Purpose |
|--------|-------------|------------|---------|
| `getAudioList()` | `GET /api/music/tracks` | mockTracks.getAllTracks() | Get all music tracks |
| `getAudioList(_, category)` | `GET /api/music/tracks?category={cat}` | mockTracks.getByCategory() | Filter by category |
| `getAudioList(_, _, search)` | `GET /api/music/search?q={search}` | mockTracks.search() | Search tracks |
| `getCategories()` | `GET /api/music/categories` | mockCategories.getAll() | Get all categories |

**Expected Response Structure:**

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  source: "api" | "mock";
  code?: number;
}

// Audio Track
interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  category: string;
  duration: number;
  thumbnail?: string;
  url: string;
  plays?: number;
}

// Category
interface AudioCategory {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  trackCount: number;
}
```

### videoEditorService

**File:** `src/api/services/videoEditorService.ts`

**Endpoints:**

| Method | API Endpoint | Mock Source | Purpose |
|--------|-------------|------------|---------|
| `getVideoFilters()` | `GET /api/filters` | mockFilters.getAll() | Get video filters |
| `getEffects()` | `GET /api/effects` | mockFilters.getEffects() | Get video effects |
| `getTransitions()` | `GET /api/transitions` | mockFilters.getTransitions() | Get transitions |
| `getStickers()` | `GET /api/stickers` | mockFilters.getStickers() | Get stickers |

**Expected Response Structure:**

```typescript
// Video Filter/Effect/Transition/Sticker
interface VideoAsset {
  id: string;
  name: string;
  thumbnail: string;
  preview?: string;
  category?: string;
  tags?: string[];
}
```

### feedService

**File:** `src/api/services/feedService.ts`

**Endpoints:**

| Method | API Endpoint | Mock Source | Purpose |
|--------|-------------|------------|---------|
| `getTrendingReels()` | `GET /api/reels/trending` | mockReels.getTrendingReels() | Trending content |
| `getForYouReels()` | `GET /api/reels/for-you` | mockReels.getForYouReels() | Personalized feed |
| `getPopularReels()` | `GET /api/reels/popular` | mockReels.getPopularReels() | Popular content |
| `getSavedReels()` | `GET /api/user/saved-reels` | [] | User saved reels |
| `getCategories()` | `GET /api/categories` | mockCategories.getAllCategories() | Content categories |
| `getFeaturedCollections()` | `GET /api/collections/featured` | mockCategories.getFeaturedCollections() | Featured collections |
| `toggleLikeReel(reelId)` | `POST /api/reels/{id}/like` | Mock state | Like/unlike reel |
| `toggleSaveReel(reelId)` | `POST /api/reels/{id}/save` | Mock state | Save/unsave reel |

**Expected Response Structure:**

```typescript
// Reel
interface Reel {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
  likes: number;
  views: number;
  duration: number;
  category: string;
  liked?: boolean;
  saved?: boolean;
  shareUrl?: string;
}

// Category
interface Category {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  reelCount: number;
}

// Collection
interface Collection {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  reels: Reel[];
}
```

---

## 3. Endpoint Mapping

### Setting Up Real API Endpoints

Update the API base URL:

```typescript
// src/api/client.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken(); // From your auth service
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Environment Variables

Create `.env` files:

```bash
# .env.development
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_USE_MOCK_DATA=true

# .env.staging
REACT_APP_API_URL=https://staging-api.gullyfame.com/api
REACT_APP_USE_MOCK_DATA=false

# .env.production
REACT_APP_API_URL=https://api.gullyfame.com/api
REACT_APP_USE_MOCK_DATA=false
```

---

## 4. Integration Steps

### Step 1: Update Service Methods

Update each service to use real API:

```typescript
// BEFORE (mock only)
export async function getAudioList() {
  return {
    success: true,
    data: mockTracks.getAllTracks(),
    source: 'mock',
  };
}

// AFTER (API with fallback)
export async function getAudioList() {
  try {
    // Check if mock should be used
    if (mockDataLoader.shouldUseMockData()) {
      return {
        success: true,
        data: mockTracks.getAllTracks(),
        source: 'mock',
      };
    }

    // Try API
    const response = await apiClient.get('/music/tracks');
    return {
      success: true,
      data: response.data,
      source: 'api',
    };
  } catch (error) {
    // Fallback to mock
    const parsed = ErrorHandler.parseError(error);
    if (parsed.shouldUseMockData) {
      return {
        success: true,
        data: mockTracks.getAllTracks(),
        source: 'mock',
      };
    }
    throw error;
  }
}
```

### Step 2: Verify Data Format

Ensure API responses match expected interface:

```typescript
// Define expected types
interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  category: string;
  duration: number;
  thumbnail?: string;
  url: string;
}

// Normalize API response
function normalizeTrack(apiTrack: any): AudioTrack {
  return {
    id: apiTrack.id,
    title: apiTrack.title || apiTrack.name,
    artist: apiTrack.artist || apiTrack.creator,
    category: apiTrack.category || 'general',
    duration: apiTrack.duration || 0,
    thumbnail: apiTrack.thumbnail || apiTrack.image,
    url: apiTrack.url || apiTrack.audioUrl,
  };
}
```

### Step 3: Add Error Handling

Handle API-specific errors:

```typescript
export async function getAudioList() {
  try {
    const response = await apiClient.get('/music/tracks');
    return {
      success: true,
      data: response.data.map(normalizeTrack),
      source: 'api',
    };
  } catch (error: any) {
    const appError = ErrorHandler.parseError(error);

    // Log error
    ErrorHandler.logError(appError, 'getAudioList');

    // Decide on fallback
    if (appError.shouldUseMockData) {
      console.log('📀 Falling back to mock data');
      return {
        success: true,
        data: mockTracks.getAllTracks(),
        source: 'mock',
      };
    }

    // Re-throw if not recoverable
    throw appError;
  }
}
```

### Step 4: Update Configuration

Configure environment-specific behavior:

```typescript
// src/config/mockDataConfig.ts
const config = {
  development: {
    useMockData: true,
    apiPreferred: false,
    verboseLogging: true,
    mockResponseDelay: 0,
  },
  staging: {
    useMockData: false,
    apiPreferred: true,
    verboseLogging: false,
    mockResponseDelay: 0,
  },
  production: {
    useMockData: false,
    apiPreferred: true,
    verboseLogging: false,
    mockResponseDelay: 0,
  },
};
```

---

## 5. Testing Verification

### Run API Integration Tests

```typescript
// In browser console
__API_VERIFIER__.runFullVerification()

// Or run specific tests
__API_VERIFIER__.verifyWithMockData()
__API_VERIFIER__.verifyWithApi()
__API_VERIFIER__.verifyFallbackBehavior()
__API_VERIFIER__.compareResponses()
```

### Expected Output

```
🔬 FULL API INTEGRATION VERIFICATION SUITE

🎭 VERIFYING MOCK DATA MODE
✅ Get Audio List
   Items: 27
   Time: 45ms

✅ Get Audio Categories
   Items: 7
   Time: 10ms

[... more endpoints ...]

✅ Audio Track Structure:
{
  "id": "track-1",
  "title": "Beats",
  "artist": "Producer",
  "category": "hip-hop",
  "duration": 240
}

✅ All required keys present

✅ OVERALL: 13/13 endpoints verified (100%)
```

### Verification Checklist

- [ ] All endpoints return successfully
- [ ] Response times are acceptable (<500ms)
- [ ] Data structure matches expected interface
- [ ] Mock fallback works when API unavailable
- [ ] Error handling doesn't crash app
- [ ] Data counts are reasonable (>0)
- [ ] Pagination works (if applicable)
- [ ] Search/filter functionality works

---

## 6. Deployment Strategy

### Development Environment

```typescript
// Use mock data by default
mockDataLoader.forceMockData()
```

**Benefits:**
- Fast development without backend
- Test all features immediately
- No server dependency

### Staging Environment

```typescript
// Try API first, fallback to mock
mockDataLoader.allowAPI()
```

**Benefits:**
- Test real API integration
- Verify error handling
- Performance testing
- Backup with mock data

### Production Environment

```typescript
// API only, no mock fallback
mockDataLoader.disable()
```

**Benefits:**
- Real data only
- No dev clutter
- Production-ready

---

## 7. Troubleshooting

### API Not Responding

**Check:**
1. API base URL is correct
2. Backend server is running
3. Network connectivity
4. CORS headers are set
5. Auth token is valid

```typescript
// Test API connectivity
const isApiReachable = await fetch(API_BASE_URL)
  .then(() => true)
  .catch(() => false)

console.log('API reachable:', isApiReachable)
```

### Data Format Mismatch

**Compare mock vs API:**
```typescript
const mockData = await musicLibraryService.getAudioList() // With mock forced
const apiData = await musicLibraryService.getAudioList()  // With API

console.log('Mock:', JSON.stringify(mockData.data[0], null, 2))
console.log('API:', JSON.stringify(apiData.data[0], null, 2))
```

**Solution:**
- Update normalization function
- Add field mapping
- Handle optional fields

### Performance Issues

**Monitor response times:**
```typescript
const start = Date.now()
const result = await musicLibraryService.getAudioList()
const duration = Date.now() - start

console.log(`Response time: ${duration}ms`)
```

**Optimize:**
- Add caching layer
- Implement pagination
- Add request debouncing
- Consider data compression

### Fallback Not Triggering

**Debug:**
```typescript
mockDataLoader.enableVerboseLogging()
mockDataLoader.allowAPI()

// Try API call
const result = await musicLibraryService.getAudioList()
// Check console logs for fallback decision
```

**Check:**
- Error type is recoverable
- `shouldUseMockData` flag is true
- Mock data is available
- No exceptions thrown

---

## 8. Monitoring & Logging

### Enable Logging

```typescript
// In app initialization
mockDataLoader.enableVerboseLogging()
mockDataLoader.printStatus()

// Check logs
mockDataLoader.logMockDataAvailability()
```

### Log Output Example

```
🔧 Mock Data Configuration
Mode: Hybrid (API preferred, fallback to mock)
Mock Enabled: true
API Preferred: true
Verbose Logging: true
Response Delay: 0ms

Available Mock Data:
  📀 27 Music Tracks
  🎬 20 Video Filters
  📱 12 Reels
  📂 15 Categories

[MockData] ✓ Music Library: getAudioList
[MockData] Source: api
[MockData] Response time: 123ms
[MockData] Returned 27 items
```

---

## 9. Performance Metrics

### Expected Response Times

| Endpoint | Mock | API | Notes |
|----------|------|-----|-------|
| Get Tracks | 10-50ms | 100-500ms | Pagination helps |
| Get Filters | 5-30ms | 50-200ms | Cached often |
| Get Reels | 20-100ms | 200-1000ms | May include images |
| Search | 8-50ms | 150-800ms | Index dependent |
| Like/Save | <5ms | 100-500ms | Write operation |

### Caching Strategy

```typescript
// Implement response caching
const cache = new Map()

export async function getCachedAudioList() {
  const cacheKey = 'audio-list'

  if (cache.has(cacheKey)) {
    console.log('📦 Returning cached data')
    return cache.get(cacheKey)
  }

  const result = await getAudioList()
  cache.set(cacheKey, result)

  return result
}

// Clear cache on update
export function clearCache() {
  cache.clear()
}
```

---

## 10. Security Considerations

### Authentication

```typescript
// Add bearer token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### HTTPS Only

```typescript
// Enforce HTTPS in production
if (process.env.NODE_ENV === 'production') {
  if (window.location.protocol !== 'https:') {
    window.location.protocol = 'https:'
  }
}
```

### Sensitive Data

```typescript
// Don't log sensitive data
ErrorHandler.logError = (error, context) => {
  const safe = {
    type: error.type,
    message: error.message,
    timestamp: error.timestamp,
    // Don't log: originalError, statusCode details
  }
  console.warn(`[${context}]`, safe)
}
```

---

## 11. Quick Reference

```typescript
// Verify all APIs
__API_VERIFIER__.runFullVerification()

// Verify mock mode
__API_VERIFIER__.verifyWithMockData()

// Verify API mode
__API_VERIFIER__.verifyWithApi()

// Compare responses
__API_VERIFIER__.compareResponses()

// Check data structure
__API_VERIFIER__.verifyDataStructure()

// Get results
__API_VERIFIER__.getResults()
```

---

## 12. Related Guides

- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing all features
- [MockDataConfig](./src/config/mockDataConfig.ts) - Environment config
- [ErrorHandler](./src/utils/errorHandler.ts) - Error handling patterns
- [API Services](./src/api/services/) - Service implementations

---

Generated: August 24, 2026
Last Updated: Task #11 - API Integration Verification
