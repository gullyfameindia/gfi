





import musicLibraryService from "../api/services/musicLibraryService";
import videoEditorService from "../api/services/videoEditorService";
import feedService from "../api/services/feedService";
import mockDataLoader from "./mockDataLoader";
import { ErrorHandler } from "./errorHandler";

interface TestResult {
  feature: string;
  test: string;
  passed: boolean;
  message: string;
  duration: number;
  data?: any;
}

class TestFeatures {
  private results: TestResult[] = [];
  private startTime = 0;

  async runAllTests() {
    console.log("\n🧪 STARTING COMPREHENSIVE FEATURE TESTS\n");
    console.log("=" + "=".repeat(79));

    this.results = [];

    
    await mockDataLoader.initialize();
    mockDataLoader.forceMockData(); 

    
    await this.testMusicLibrary();
    await this.testVideoEditor();
    await this.testFeed();
    await this.testErrorHandling();

    
    this.printResults();

    return this.results;
  }

  private async testMusicLibrary() {
    console.log("\n📀 TESTING MUSIC LIBRARY SERVICE\n");

    
    await this.runTest("Music Library", "Get Audio List", async () => {
      const result = await musicLibraryService.getAudioList();
      if (!result.success || !result.data || result.data.length === 0) {
        throw new Error("No audio data returned");
      }
      return {
        message: `✓ Retrieved ${result.data.length} tracks`,
        data: { trackCount: result.data.length },
      };
    });

    
    await this.runTest("Music Library", "Get Audio by Category", async () => {
      const result = await musicLibraryService.getAudioList(undefined, "hip-hop");
      if (!result.success) {
        throw new Error("Failed to fetch category");
      }
      return {
        message: `✓ Retrieved ${result.data?.length || 0} hip-hop tracks`,
        data: { categoryTrackCount: result.data?.length || 0 },
      };
    });

    
    await this.runTest("Music Library", "Search Audio", async () => {
      const result = await musicLibraryService.getAudioList(undefined, undefined, "beats");
      if (!result.success) {
        throw new Error("Search failed");
      }
      return {
        message: `✓ Search returned ${result.data?.length || 0} results`,
        data: { searchResults: result.data?.length || 0 },
      };
    });

    
    await this.runTest("Music Library", "Get Categories", async () => {
      const result = await musicLibraryService.getCategories();
      if (!result.success || !result.data || result.data.length === 0) {
        throw new Error("No categories returned");
      }
      return {
        message: `✓ Retrieved ${result.data.length} music categories`,
        data: { categoryCount: result.data.length },
      };
    });
  }

  private async testVideoEditor() {
    console.log("\n🎬 TESTING VIDEO EDITOR SERVICE\n");

    
    await this.runTest("Video Editor", "Get Video Filters", async () => {
      const result = await videoEditorService.getVideoFilters();
      if (!result.success || !result.data || result.data.length === 0) {
        throw new Error("No filters returned");
      }
      return {
        message: `✓ Retrieved ${result.data.length} video filters`,
        data: { filterCount: result.data.length },
      };
    });

    
    await this.runTest("Video Editor", "Get Effects", async () => {
      const result = await videoEditorService.getEffects();
      if (!result.success || !result.data || result.data.length === 0) {
        throw new Error("No effects returned");
      }
      return {
        message: `✓ Retrieved ${result.data.length} video effects`,
        data: { effectCount: result.data.length },
      };
    });

    
    await this.runTest("Video Editor", "Get Transitions", async () => {
      const result = await videoEditorService.getTransitions();
      if (!result.success || !result.data || result.data.length === 0) {
        throw new Error("No transitions returned");
      }
      return {
        message: `✓ Retrieved ${result.data.length} video transitions`,
        data: { transitionCount: result.data.length },
      };
    });

    
    await this.runTest("Video Editor", "Get Stickers", async () => {
      const result = await videoEditorService.getStickers();
      if (!result.success || !result.data || result.data.length === 0) {
        throw new Error("No stickers returned");
      }
      return {
        message: `✓ Retrieved ${result.data.length} stickers`,
        data: { stickerCount: result.data.length },
      };
    });
  }

  private async testFeed() {
    console.log("\n📱 TESTING FEED SERVICE\n");

    
    await this.runTest("Feed", "Get Trending Reels", async () => {
      const result = await feedService.getTrendingReels();
      if (!result.success || !result.data || result.data.length === 0) {
        throw new Error("No trending reels returned");
      }
      return {
        message: `✓ Retrieved ${result.data.length} trending reels`,
        data: { reelCount: result.data.length },
      };
    });

    
    await this.runTest("Feed", "Get For You Reels", async () => {
      const result = await feedService.getForYouReels();
      if (!result.success || !result.data || result.data.length === 0) {
        throw new Error("No for you reels returned");
      }
      return {
        message: `✓ Retrieved ${result.data.length} for you reels`,
        data: { reelCount: result.data.length },
      };
    });

    
    await this.runTest("Feed", "Get Popular Reels", async () => {
      const result = await feedService.getPopularReels();
      if (!result.success || !result.data || result.data.length === 0) {
        throw new Error("No popular reels returned");
      }
      return {
        message: `✓ Retrieved ${result.data.length} popular reels`,
        data: { reelCount: result.data.length },
      };
    });

    
    await this.runTest("Feed", "Get Categories", async () => {
      const result = await feedService.getCategories();
      if (!result.success || !result.data || result.data.length === 0) {
        throw new Error("No categories returned");
      }
      return {
        message: `✓ Retrieved ${result.data.length} content categories`,
        data: { categoryCount: result.data.length },
      };
    });

    
    await this.runTest("Feed", "Get Featured Collections", async () => {
      const result = await feedService.getFeaturedCollections();
      if (!result.success || !result.data || result.data.length === 0) {
        throw new Error("No collections returned");
      }
      return {
        message: `✓ Retrieved ${result.data.length} featured collections`,
        data: { collectionCount: result.data.length },
      };
    });

    
    await this.runTest("Feed", "Toggle Like Reel", async () => {
      const reelsResult = await feedService.getTrendingReels();
      if (!reelsResult.data || reelsResult.data.length === 0) {
        throw new Error("No reels to test like");
      }
      const reelId = reelsResult.data[0].id;
      const result = await feedService.toggleLikeReel(reelId);
      if (!result.success) {
        throw new Error("Failed to toggle like");
      }
      return {
        message: `✓ Successfully toggled like on reel ${reelId}`,
        data: { reelId, liked: result.data?.liked },
      };
    });

    
    await this.runTest("Feed", "Toggle Save Reel", async () => {
      const reelsResult = await feedService.getTrendingReels();
      if (!reelsResult.data || reelsResult.data.length === 0) {
        throw new Error("No reels to test save");
      }
      const reelId = reelsResult.data[0].id;
      const result = await feedService.toggleSaveReel(reelId);
      if (!result.success) {
        throw new Error("Failed to toggle save");
      }
      return {
        message: `✓ Successfully toggled save on reel ${reelId}`,
        data: { reelId, saved: result.data?.saved },
      };
    });
  }

  private async testErrorHandling() {
    console.log("\n⚠️ TESTING ERROR HANDLING\n");

    
    await this.runTest("Error Handler", "Parse Network Error", async () => {
      const error = new Error("Network Error");
      (error as any).code = "NETWORK_ERROR";
      const parsed = ErrorHandler.parseError(error);
      if (parsed.type !== "network" || !parsed.shouldUseMockData) {
        throw new Error("Network error not properly categorized");
      }
      return {
        message: `✓ Network error correctly categorized`,
        data: { errorType: parsed.type, shouldUseMock: parsed.shouldUseMockData },
      };
    });

    
    await this.runTest("Error Handler", "Parse Timeout Error", async () => {
      const error = new Error("Request timeout");
      const parsed = ErrorHandler.parseError(error);
      if (parsed.type !== "timeout") {
        throw new Error("Timeout error not properly categorized");
      }
      return {
        message: `✓ Timeout error correctly categorized`,
        data: { errorType: parsed.type },
      };
    });

    
    await this.runTest("Error Handler", "Get User Message", async () => {
      const error = new Error("Network Error");
      (error as any).code = "NETWORK_ERROR";
      const parsed = ErrorHandler.parseError(error);
      const message = ErrorHandler.getUserMessage(parsed);
      if (!message || message.length === 0) {
        throw new Error("No user message generated");
      }
      return {
        message: `✓ User message generated: "${message}"`,
        data: { userMessage: message },
      };
    });
  }

  private async runTest(
    category: string,
    testName: string,
    testFn: () => Promise<{ message: string; data?: any }>
  ) {
    const startTime = Date.now();
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;

      console.log(`  ✅ ${testName}`);
      console.log(`     ${result.message}`);
      console.log(`     ⏱️  ${duration}ms\n`);

      this.results.push({
        feature: category,
        test: testName,
        passed: true,
        message: result.message,
        duration,
        data: result.data,
      });
    } catch (error: any) {
      const duration = Date.now() - startTime;

      console.log(`  ❌ ${testName}`);
      console.log(`     Error: ${error.message}`);
      console.log(`     ⏱️  ${duration}ms\n`);

      this.results.push({
        feature: category,
        test: testName,
        passed: false,
        message: error.message,
        duration,
      });
    }
  }

  private printResults() {
    console.log("\n" + "=".repeat(80));
    console.log("📊 TEST RESULTS SUMMARY\n");

    const grouped = this.results.reduce(
      (acc, result) => {
        if (!acc[result.feature]) {
          acc[result.feature] = [];
        }
        acc[result.feature].push(result);
        return acc;
      },
      {} as Record<string, TestResult[]>
    );

    let totalPassed = 0;
    let totalTests = 0;

    for (const [feature, tests] of Object.entries(grouped)) {
      const passed = tests.filter((t) => t.passed).length;
      const total = tests.length;
      totalPassed += passed;
      totalTests += total;

      const percentage = Math.round((passed / total) * 100);
      const status = percentage === 100 ? "✅" : "⚠️";

      console.log(`${status} ${feature}: ${passed}/${total} passed (${percentage}%)`);
      console.log(`   Total time: ${tests.reduce((sum, t) => sum + t.duration, 0)}ms`);
      console.log("");
    }

    console.log("=" + "=".repeat(79));
    const overallPercentage = Math.round((totalPassed / totalTests) * 100);
    const overallStatus = overallPercentage === 100 ? "✅" : "⚠️";

    console.log(`\n${overallStatus} OVERALL: ${totalPassed}/${totalTests} tests passed (${overallPercentage}%)\n`);

    if (totalPassed === totalTests) {
      console.log("🎉 ALL TESTS PASSED! All features are working with mock data.\n");
    } else {
      console.log(`⚠️ ${totalTests - totalPassed} test(s) failed. Check logs above.\n`);
    }

    return {
      totalPassed,
      totalTests,
      percentage: overallPercentage,
      results: this.results,
    };
  }

  


  getResults() {
    return {
      totalTests: this.results.length,
      totalPassed: this.results.filter((r) => r.passed).length,
      totalDuration: this.results.reduce((sum, r) => sum + r.duration, 0),
      results: this.results,
    };
  }
}


const testFeatures = new TestFeatures();


if (typeof global !== "undefined") {
  (global as any).__TEST_FEATURES__ = testFeatures;
}

export default testFeatures;
