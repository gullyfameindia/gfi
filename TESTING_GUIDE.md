# 🧪 Gully Fame Mobile - Testing Guide

Complete guide for testing all mock data features and hybrid API integration.

## Overview

This document covers:
1. **Automated Test Suite** - Run all tests at once
2. **Manual Testing Checklist** - Step-by-step testing
3. **Feature Testing** - Individual feature verification
4. **API Integration Testing** - When backend is available
5. **Error Scenario Testing** - Test error handling

---

## 1. Automated Test Suite

### Running All Tests

The easiest way to test all features:

```typescript
// In browser console or React Native debugger:
__TEST_FEATURES__.runAllTests()
```

This runs 18+ tests across 4 test suites:
- **Music Library Service** (4 tests)
- **Video Editor Service** (4 tests)
- **Feed Service** (7 tests)
- **Error Handler** (3 tests)

### Expected Output

```
🧪 STARTING COMPREHENSIVE FEATURE TESTS

📀 TESTING MUSIC LIBRARY SERVICE

  ✅ Get Audio List
     ✓ Retrieved 27 tracks
     ⏱️  45ms

  ✅ Get Audio by Category
     ✓ Retrieved 8 hip-hop tracks
     ⏱️  12ms

  ✅ Search Audio
     ✓ Search returned 5 results
     ⏱️  8ms

  ✅ Get Categories
     ✓ Retrieved 7 music categories
     ⏱️  10ms

📊 TEST RESULTS SUMMARY

✅ Music Library: 4/4 passed (100%)
✅ Video Editor: 4/4 passed (100%)
✅ Feed: 7/7 passed (100%)
✅ Error Handler: 3/3 passed (100%)

✅ OVERALL: 18/18 tests passed (100%)

🎉 ALL TESTS PASSED! All features are working with mock data.
```

### Getting Test Results as JSON

```typescript
// Get structured results
const results = __TEST_FEATURES__.getResults()

// Returns:
{
  totalTests: 18,
  totalPassed: 18,
  totalDuration: 234,
  results: [
    {
      feature: "Music Library",
      test: "Get Audio List",
      passed: true,
      message: "✓ Retrieved 27 tracks",
      duration: 45,
      data: { trackCount: 27 }
    },
    // ... more results
  ]
}
```

---

## 2. Manual Testing Checklist

### Feature: Music Library

- [ ] **Open Music Library Modal**
  - Navigate to Video Editor → Music selection
  - Should show music library with mock tracks
  - Display track counts and category stats

- [ ] **Browse by Category**
  - Switch between categories (Hip-Hop, Pop, Electronic, etc.)
  - Verify track count updates for each category
  - Loading state appears briefly

- [ ] **Search Functionality**
  - Search for "beats" → Should return matching tracks
  - Search for "remix" → Should return remix tracks
  - Empty search → Shows all tracks

- [ ] **Play Preview**
  - Click track thumbnail
  - Audio player starts (or simulates playback in dev)
  - Track duration displays correctly

- [ ] **Select Track for Video**
  - Select a track → Should add to video editor
  - Selected state highlighted
  - Video preview includes audio

### Feature: Video Editor Filters

- [ ] **Open Filter Panel**
  - Navigate to Video Editor
  - Tap Filters button
  - Should display 20+ filter options

- [ ] **Apply Filters**
  - Select a filter (e.g., "Vintage", "Noir", "Sunset")
  - Video preview updates with filter effect
  - Filter name displays above preview

- [ ] **Browse Effects**
  - Switch to Effects tab
  - Should show 5+ video effects
  - Each effect has name and thumbnail

- [ ] **Use Transitions**
  - Add 2+ video clips
  - Select transition between clips
  - Transition preview shows effect

- [ ] **Add Stickers**
  - Open stickers panel
  - Should display 10+ sticker options
  - Tap sticker → appears on video
  - Can position and resize sticker

### Feature: Home Feed

- [ ] **View Trending Reels**
  - Navigate to Home
  - Trending tab is active by default
  - Shows 5 trending reels with stats
  - Each reel shows title, creator, likes, views

- [ ] **Switch to For You**
  - Tap "For You" tab
  - Loads 15 personalized reels
  - Loading spinner appears during fetch
  - Reels display in card format

- [ ] **Browse Popular**
  - Tap "Popular" tab
  - Shows 10 popular reels
  - Ranked by engagement

- [ ] **View Saved (Empty State)**
  - Tap "Saved" tab
  - Shows empty state message
  - User hasn't saved anything yet

- [ ] **Like a Reel**
  - On any reel, tap heart icon
  - Like count increases
  - Icon fills with color
  - State persists on tab switch

- [ ] **Save a Reel**
  - On any reel, tap bookmark icon
  - Reel moves to Saved tab
  - Icon fills with color
  - Can unsave to return

### Feature: Error Handling

- [ ] **Network Error**
  - Disconnect internet (or simulate network error)
  - ErrorFallback component appears
  - Shows user-friendly message
  - Displays "Using cached/mock data" info box
  - Retry button available

- [ ] **API Timeout**
  - Simulate slow network (via MockDataControls)
  - Set response delay to 3000ms
  - Timeout error appears
  - Can retry or view mock data

- [ ] **Server Error**
  - Simulate API error (500 status)
  - Error component displays
  - "Server error" message shown
  - Mock data fallback available

---

## 3. Feature Testing Details

### Music Library Service

**File:** `src/api/services/musicLibraryService.ts`

Test in console:
```typescript
import musicLibraryService from "../../api/services/musicLibraryService"

// Get all tracks
musicLibraryService.getAudioList()
// Returns: { success: true, data: [27 tracks], source: "mock/api" }

// Get by category
musicLibraryService.getAudioList(undefined, "hip-hop")
// Returns: { success: true, data: [8 hip-hop tracks] }

// Search
musicLibraryService.getAudioList(undefined, undefined, "beats")
// Returns: { success: true, data: [matching tracks] }

// Get categories
musicLibraryService.getCategories()
// Returns: { success: true, data: [7 categories] }
```

**Expected Data:**
- 27 total tracks across 7 categories
- Each track has: id, title, artist, category, duration, thumbnail
- Categories: Hip-Hop, Pop, Electronic, Indie, Rock, Jazz, Classical

### Video Editor Service

**File:** `src/api/services/videoEditorService.ts`

Test in console:
```typescript
import videoEditorService from "../../api/services/videoEditorService"

// Get filters
videoEditorService.getVideoFilters()
// Returns: { success: true, data: [20 filters] }

// Get effects
videoEditorService.getEffects()
// Returns: { success: true, data: [5 effects] }

// Get transitions
videoEditorService.getTransitions()
// Returns: { success: true, data: [4 transitions] }

// Get stickers
videoEditorService.getStickers()
// Returns: { success: true, data: [10 stickers] }
```

**Expected Data:**
- 20 filters: Vintage, Noir, Sunset, Neon, etc.
- 5 effects: Blur, Pixelate, Glow, etc.
- 4 transitions: Fade, Slide, Zoom, Flip
- 10 stickers: Emoji, Text, Shapes, etc.

### Feed Service

**File:** `src/api/services/feedService.ts`

Test in console:
```typescript
import feedService from "../../api/services/feedService"

// Get trending reels
feedService.getTrendingReels()
// Returns: { success: true, data: [5 trending reels] }

// Get for you reels
feedService.getForYouReels()
// Returns: { success: true, data: [15 personalized reels] }

// Get popular reels
feedService.getPopularReels()
// Returns: { success: true, data: [10 popular reels] }

// Get categories
feedService.getCategories()
// Returns: { success: true, data: [15 categories] }

// Get featured collections
feedService.getFeaturedCollections()
// Returns: { success: true, data: [8 collections] }

// Like a reel
feedService.toggleLikeReel("reel-1")
// Returns: { success: true, data: { liked: true } }

// Save a reel
feedService.toggleSaveReel("reel-1")
// Returns: { success: true, data: { saved: true } }
```

**Expected Data:**
- 12 total mock reels across multiple categories
- 15 content categories with metadata
- 8 featured collections
- Each reel has: id, title, creator, thumbnail, likes, views, duration

---

## 4. API Integration Testing

### When Backend is Available

1. **Update API Configuration**
   ```typescript
   // src/config/mockDataConfig.ts
   const config = {
     env: "staging", // or "production"
     useMockData: false, // Disable mock, use real API
     apiPreferred: true,
   }
   ```

2. **Test API Calls**
   ```typescript
   // In console:
   __TEST_FEATURES__.runAllTests()
   
   // Should now hit real API endpoints
   // Falls back to mock if API fails
   ```

3. **Verify Data Source**
   ```typescript
   musicLibraryService.getAudioList()
   // Check console logs for: "Source: api" or "Source: mock"
   ```

4. **Test Fallback**
   - Stop backend server
   - Try loading data
   - Should automatically fallback to mock data
   - No errors shown to user

---

## 5. Error Scenario Testing

### Using MockDataControls

Access dev controls:
```typescript
// In Home screen or any page
// Look for "🛠️ Dev Controls" button (dev mode only)

// Or in console:
import mockDataLoader from "../../utils/mockDataLoader"
mockDataLoader.forceMockData()
mockDataLoader.allowAPI()
mockDataLoader.setMockResponseDelay(3000) // Simulate slow network
```

### Test Scenarios

1. **Network Error**
   - Enable mock mode
   - Disable API in config
   - Try loading feature
   - ErrorFallback appears with network icon

2. **Timeout**
   - Set mock response delay: `setMockResponseDelay(5000)`
   - Try loading data
   - Should timeout and show error
   - Can retry or view cached data

3. **Unauthorized**
   - Clear auth token
   - Try loading protected data
   - Shows "Please login" message
   - Retry button not available

4. **Not Found**
   - Try loading non-existent reel: `feedService.toggleLikeReel("fake-id")`
   - Shows 404 error
   - Mock data fallback available

---

## 6. Logging and Debugging

### Enable Verbose Logging

```typescript
import mockDataLoader from "../../utils/mockDataLoader"

// Enable detailed logging
mockDataLoader.enableVerboseLogging()

// All API calls will log:
// [MockData] ✓ Music Library: getAudioList (source: mock)
// [MockData] Response time: 45ms
// [MockData] Returned 27 items
```

### View Current Status

```typescript
mockDataLoader.printStatus()

// Outputs:
// 🔧 Mock Data Configuration
// Mode: Hybrid (API preferred, fallback to mock)
// Mock Enabled: true
// Response Delay: 0ms
// Verbose Logging: true
// Available Mock Data:
//   - 27 Music Tracks
//   - 20 Video Filters
//   - 12 Reels
//   - 15 Categories
```

### Log Mock Data Availability

```typescript
mockDataLoader.logMockDataAvailability()

// Outputs all available mock data with counts
```

---

## 7. Performance Testing

### Response Times

Expected response times with mock data:
- Music Library: 10-50ms
- Video Editor: 5-30ms
- Feed Service: 20-100ms
- Error Handling: <5ms

### Load Testing

```typescript
// Test with multiple rapid requests
async function loadTest() {
  const start = Date.now()
  for (let i = 0; i < 100; i++) {
    await musicLibraryService.getAudioList()
  }
  const duration = Date.now() - start
  console.log(`100 requests in ${duration}ms (avg: ${duration / 100}ms)`)
}

loadTest()
```

Expected: < 5000ms for 100 requests (avg ~50ms per request)

---

## 8. Troubleshooting

### Tests Failing

1. **Check console for errors**
   - Open React Native debugger
   - Look for red error messages
   - Check network tab for failed requests

2. **Verify mock data is initialized**
   ```typescript
   await mockDataLoader.initialize()
   mockDataLoader.getMockDataStats()
   ```

3. **Force mock mode**
   ```typescript
   mockDataLoader.forceMockData()
   __TEST_FEATURES__.runAllTests()
   ```

### Data Not Displaying

1. **Check data source**
   ```typescript
   const result = await musicLibraryService.getAudioList()
   console.log(result) // Check if data is returned
   ```

2. **Verify component is using correct service**
   - Import from `src/api/services/`
   - Not from old location

3. **Check for TypeScript errors**
   - Run build: `npm run build`
   - Should complete without errors

### Error Fallback Not Showing

1. **Verify error handler is imported**
   ```typescript
   import ErrorHandler from "../../utils/errorHandler"
   ```

2. **Check error categorization**
   ```typescript
   const error = new Error("test")
   const parsed = ErrorHandler.parseError(error)
   console.log(parsed.type) // Should be 'unknown' or specific type
   ```

3. **Verify ErrorFallback component is rendered**
   - Check if conditional logic is correct
   - Look for component in React DevTools

---

## 9. Success Criteria

All features are working correctly when:

✅ **Music Library**
- [ ] Displays 27 tracks
- [ ] Filters by category
- [ ] Search returns results
- [ ] No errors in console

✅ **Video Editor**
- [ ] Shows 20+ filters
- [ ] Applies filters to preview
- [ ] Shows effects and transitions
- [ ] Can add stickers

✅ **Feed**
- [ ] All 4 tabs load data
- [ ] Trending shows 5 reels
- [ ] ForYou shows 15 reels
- [ ] Like/Save toggle works

✅ **Error Handling**
- [ ] Network errors show gracefully
- [ ] Timeout shows error UI
- [ ] Can retry failed requests
- [ ] Mock fallback available

✅ **Performance**
- [ ] Data loads within 100ms
- [ ] No lag in tab switching
- [ ] Smooth UI interactions
- [ ] No memory leaks

---

## 10. Next Steps

When backend API is ready:

1. Update API endpoints in services
2. Test with API by disabling mock mode
3. Verify data format matches interface
4. Update error handling for real API responses
5. Remove dev controls from production build
6. Run full integration tests
7. Deploy to staging
8. Perform UAT testing

---

## Quick Reference

```typescript
// Run all tests
__TEST_FEATURES__.runAllTests()

// Initialize mock data
await mockDataLoader.initialize()

// Force mock mode
mockDataLoader.forceMockData()

// Allow API with fallback
mockDataLoader.allowAPI()

// Enable verbose logging
mockDataLoader.enableVerboseLogging()

// Print current status
mockDataLoader.printStatus()

// Get individual services
import musicLibraryService from "src/api/services/musicLibraryService"
import videoEditorService from "src/api/services/videoEditorService"
import feedService from "src/api/services/feedService"

// Test error handling
import ErrorHandler from "src/utils/errorHandler"
const parsed = ErrorHandler.parseError(error)
```

---

Generated: August 24, 2026
Last Updated: Task #10 - Testing Mock Data Features
