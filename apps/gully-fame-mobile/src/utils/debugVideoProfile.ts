




import { Reel } from "@/api/services/reelsService";


export const MOCK_REELS: Reel[] = [
  {
    _id: "mock-1",
    userId: "user-123",
    title: "Test Video 1",
    description: "This is a test video",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4",
    thumbnail: "https://peach.blender.org/wp-content/uploads/image-1.jpg?x11217",
    duration: 596,
    likes: 100,
    comments: 5,
    shares: 2,
    views: 500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "mock-2",
    userId: "user-123",
    title: "Test Video 2",
    description: "Second test video",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4",
    thumbnail: "https://www.sintel.org/images/1.png",
    duration: 654,
    likes: 50,
    comments: 3,
    shares: 1,
    views: 250,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "mock-3",
    userId: "user-123",
    title: "Test Video 3",
    description: "Third test video",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4",
    duration: 15,
    likes: 200,
    comments: 8,
    shares: 5,
    views: 1000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEBUG_STEPS = {
  STEP_1: "Check useUserReels hook is being called",
  STEP_2: "Verify userId is being passed correctly",
  STEP_3: "Check API response in console logs",
  STEP_4: "Verify reels array is populated",
  STEP_5: "Check thumbnail URLs exist",
  STEP_6: "Test with mock data",
  STEP_7: "Verify FlatList is rendering items",
  STEP_8: "Check for key prop errors",
};




export function generateDebugReport(
  userId: string,
  reels: Reel[],
  loading: boolean,
  error: string | null
): string {
  const lines: string[] = [];

  lines.push("=== VIDEO PROFILE DEBUG REPORT ===\n");

  
  lines.push("USER INFO:");
  lines.push(`  User ID: ${userId}`);
  lines.push(`  User ID Empty: ${!userId}`);

  
  lines.push("\nREELS INFO:");
  lines.push(`  Total Reels: ${reels.length}`);
  lines.push(`  Loading: ${loading}`);
  lines.push(`  Error: ${error || "None"}`);

  if (reels.length > 0) {
    lines.push("\n  INDIVIDUAL REELS:");
    reels.forEach((reel, idx) => {
      lines.push(`\n  Reel ${idx}:`);
      lines.push(`    ID: ${reel._id || reel.id || "MISSING"}`);
      lines.push(`    Title: ${reel.title || "MISSING"}`);
      lines.push(`    Video URL: ${reel.videoUrl ? "✓ Present" : "✗ MISSING"}`);
      lines.push(`    Thumbnail: ${reel.thumbnail ? "✓ Present" : "✗ MISSING"}`);
      lines.push(`    Duration: ${reel.duration || "MISSING"}`);
      lines.push(`    Views: ${reel.views || 0}`);
    });
  }

  
  lines.push("\n\nRECOMMENDATIONS:");
  if (!userId) {
    lines.push("  ⚠️  User ID is empty - check if profileData.id is available");
  }
  if (reels.length === 0 && !loading && error) {
    lines.push("  ⚠️  API error - check network tab and error message");
  }
  if (reels.length === 0 && loading) {
    lines.push("  ℹ️  Still loading - wait for API response");
  }
  if (reels.length > 0 && reels.some((r) => !r.thumbnail)) {
    lines.push("  ⚠️  Some videos missing thumbnails - backend needs to generate them");
  }
  if (reels.length > 0 && reels.every((r) => r.thumbnail)) {
    lines.push("  ✓ All videos have thumbnails");
  }

  lines.push("\n\nNEXT STEPS:");
  lines.push("1. Open React Native Debugger");
  lines.push("2. Check console logs for [useUserReels] messages");
  lines.push("3. Check network tab for reels API call");
  lines.push("4. Try using mock data to test rendering");
  lines.push("5. Verify FlatList keys are unique");

  return lines.join("\n");
}




export function validateReel(reel: Reel): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!reel._id && !reel.id) {
    errors.push("Missing ID (_id or id)");
  }

  if (!reel.videoUrl) {
    errors.push("Missing videoUrl");
  }

  if (!reel.thumbnail) {
    errors.push("Missing thumbnail");
  }

  if (!reel.userId) {
    errors.push("Missing userId");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}




export async function testReelsAPI(
  reelsService: any,
  userId: string
): Promise<{
  success: boolean;
  reels: Reel[];
  error: string | null;
  logs: string[];
}> {
  const logs: string[] = [];

  try {
    logs.push(`[TEST] Starting API test for userId: ${userId}`);

    if (!userId) {
      logs.push("[TEST] ⚠️  User ID is empty");
      return { success: false, reels: [], error: "Empty user ID", logs };
    }

    logs.push("[TEST] Calling getUserReels...");
    const response = await reelsService.getUserReels(userId, { page: 1, limit: 50 });

    logs.push(`[TEST] Response received - success: ${response.success}`);
    logs.push(`[TEST] Reels count: ${response.data?.items?.length || 0}`);
    logs.push(`[TEST] Message: ${response.message}`);

    if (response.success && response.data?.items) {
      const reels = response.data.items;
      logs.push(`[TEST] ✓ Successfully fetched ${reels.length} reels`);

      reels.forEach((reel: Reel) => {
        const validation = validateReel(reel);
        if (!validation.valid) {
          logs.push(`[TEST] ⚠️  Reel ${reel._id || reel.id}: ${validation.errors.join(", ")}`);
        }
      });

      return { success: true, reels, error: null, logs };
    } else {
      logs.push(`[TEST] ✗ API returned unsuccessful response`);
      return {
        success: false,
        reels: [],
        error: response.message || "Unknown error",
        logs,
      };
    }
  } catch (error: any) {
    const errorMessage = error.message || String(error);
    logs.push(`[TEST] ✗ Exception occurred: ${errorMessage}`);
    return {
      success: false,
      reels: [],
      error: errorMessage,
      logs,
    };
  }
}




export function testWithMockData(): {
  reels: Reel[];
  logs: string[];
} {
  const logs: string[] = [];

  logs.push("[MOCK TEST] Using mock data");
  logs.push(`[MOCK TEST] Mock reels count: ${MOCK_REELS.length}`);

  MOCK_REELS.forEach((reel, idx) => {
    const validation = validateReel(reel);
    logs.push(
      `[MOCK TEST] Reel ${idx}: ${validation.valid ? "✓ Valid" : "✗ Invalid - " + validation.errors.join(", ")}`
    );
  });

  logs.push("[MOCK TEST] If mock data renders correctly:");
  logs.push("  → Component rendering is working");
  logs.push("  → Issue is with API or data fetching");
  logs.push("[MOCK TEST] If mock data doesn't render:");
  logs.push("  → Issue is with component rendering or FlatList");

  return {
    reels: MOCK_REELS,
    logs,
  };
}

export const debugVideoProfile = {
  MOCK_REELS,
  DEBUG_STEPS,
  generateDebugReport,
  validateReel,
  testReelsAPI,
  testWithMockData,
};
