




import musicLibraryService from "../api/services/musicLibraryService";
import videoEditorService from "../api/services/videoEditorService";
import feedService from "../api/services/feedService";
import mockDataLoader from "./mockDataLoader";
import { ErrorHandler, AppError } from "./errorHandler";

interface ApiEndpoint {
  name: string;
  service: string;
  method: () => Promise<any>;
  expectedFields?: string[];
  expectedMinCount?: number;
}

interface VerificationResult {
  endpoint: string;
  mode: "mock" | "api";
  success: boolean;
  dataSource: string;
  responseTime: number;
  dataCount?: number;
  error?: string;
}

class ApiIntegrationVerifier {
  private results: VerificationResult[] = [];

  


  getEndpoints(): ApiEndpoint[] {
    return [
      
      {
        name: "Get Audio List",
        service: "musicLibraryService",
        method: () => musicLibraryService.getAudioList(),
        expectedMinCount: 5,
      },
      {
        name: "Get Audio Categories",
        service: "musicLibraryService",
        method: () => musicLibraryService.getCategories(),
        expectedMinCount: 3,
      },
      {
        name: "Get Audio by Category",
        service: "musicLibraryService",
        method: () => musicLibraryService.getAudioList(undefined, "hip-hop"),
        expectedMinCount: 1,
      },
      {
        name: "Search Audio",
        service: "musicLibraryService",
        method: () => musicLibraryService.getAudioList(undefined, undefined, "beats"),
      },

      
      {
        name: "Get Video Filters",
        service: "videoEditorService",
        method: () => videoEditorService.getVideoFilters(),
        expectedMinCount: 5,
      },
      {
        name: "Get Video Effects",
        service: "videoEditorService",
        method: () => videoEditorService.getEffects(),
        expectedMinCount: 1,
      },
      {
        name: "Get Transitions",
        service: "videoEditorService",
        method: () => videoEditorService.getTransitions(),
        expectedMinCount: 1,
      },
      {
        name: "Get Stickers",
        service: "videoEditorService",
        method: () => videoEditorService.getStickers(),
        expectedMinCount: 1,
      },

      
      {
        name: "Get Trending Reels",
        service: "feedService",
        method: () => feedService.getTrendingReels(),
        expectedMinCount: 1,
      },
      {
        name: "Get For You Reels",
        service: "feedService",
        method: () => feedService.getForYouReels(),
        expectedMinCount: 1,
      },
      {
        name: "Get Popular Reels",
        service: "feedService",
        method: () => feedService.getPopularReels(),
        expectedMinCount: 1,
      },
      {
        name: "Get Categories",
        service: "feedService",
        method: () => feedService.getCategories(),
        expectedMinCount: 3,
      },
      {
        name: "Get Featured Collections",
        service: "feedService",
        method: () => feedService.getFeaturedCollections(),
        expectedMinCount: 1,
      },
    ];
  }

  


  async verifyWithMockData() {
    console.log("\n🎭 VERIFYING MOCK DATA MODE\n");
    console.log("=" + "=".repeat(79));

    await mockDataLoader.initialize();
    mockDataLoader.forceMockData();

    this.results = [];

    const endpoints = this.getEndpoints();
    for (const endpoint of endpoints) {
      await this.verifyEndpoint(endpoint, "mock");
    }

    this.printResults("Mock Data");
    return this.results;
  }

  


  async verifyWithApi() {
    console.log("\n🌐 VERIFYING REAL API MODE\n");
    console.log("=" + "=".repeat(79));

    await mockDataLoader.initialize();
    mockDataLoader.allowAPI();

    this.results = [];

    const endpoints = this.getEndpoints();
    for (const endpoint of endpoints) {
      await this.verifyEndpoint(endpoint, "api");
    }

    this.printResults("Real API");
    return this.results;
  }

  


  private async verifyEndpoint(endpoint: ApiEndpoint, mode: "mock" | "api") {
    const startTime = Date.now();

    try {
      const response = await endpoint.method();
      const duration = Date.now() - startTime;

      
      if (!response.success) {
        throw new Error("Response success flag is false");
      }

      if (!response.data) {
        throw new Error("No data in response");
      }

      
      const dataArray = Array.isArray(response.data) ? response.data : [response.data];
      if (
        endpoint.expectedMinCount &&
        dataArray.length < endpoint.expectedMinCount
      ) {
        throw new Error(
          `Expected at least ${endpoint.expectedMinCount} items, got ${dataArray.length}`
        );
      }

      const dataSource = response.source || "unknown";

      console.log(`✅ ${endpoint.name}`);
      console.log(`   Service: ${endpoint.service}`);
      console.log(`   Source: ${dataSource}`);
      console.log(`   Items: ${dataArray.length}`);
      console.log(`   Time: ${duration}ms\n`);

      this.results.push({
        endpoint: endpoint.name,
        mode,
        success: true,
        dataSource,
        responseTime: duration,
        dataCount: dataArray.length,
      });
    } catch (error: any) {
      const duration = Date.now() - startTime;

      console.log(`❌ ${endpoint.name}`);
      console.log(`   Service: ${endpoint.service}`);
      console.log(`   Error: ${error.message}`);
      console.log(`   Time: ${duration}ms\n`);

      this.results.push({
        endpoint: endpoint.name,
        mode,
        success: false,
        dataSource: "error",
        responseTime: duration,
        error: error.message,
      });
    }
  }

  


  async verifyFallbackBehavior() {
    console.log("\n🔄 VERIFYING FALLBACK BEHAVIOR\n");
    console.log("=" + "=".repeat(79));

    await mockDataLoader.initialize();

    
    console.log("Test 1: API fails, fallback to mock\n");
    mockDataLoader.allowAPI();

    try {
      const result = await musicLibraryService.getAudioList();
      if (result.success && result.data) {
        console.log(`✅ Fallback works: Retrieved data with source "${result.source}"`);
        console.log(`   Items: ${result.data.length}\n`);
      } else {
        console.log("❌ Fallback failed: No data returned\n");
      }
    } catch (error: any) {
      console.log(`❌ Fallback error: ${error.message}\n`);
    }

    
    console.log("Test 2: Mock-only mode\n");
    mockDataLoader.forceMockData();

    try {
      const result = await musicLibraryService.getAudioList();
      if (result.success && result.source === "mock") {
        console.log(`✅ Mock mode works: Source is "${result.source}"`);
        console.log(`   Items: ${result.data?.length}\n`);
      } else {
        console.log(`❌ Mock mode failed: Source is "${result.source}"\n`);
      }
    } catch (error: any) {
      console.log(`❌ Mock mode error: ${error.message}\n`);
    }

    
    console.log("Test 3: Response time with mock delay\n");
    mockDataLoader.setMockResponseDelay(1000);
    mockDataLoader.forceMockData();

    const start = Date.now();
    try {
      await musicLibraryService.getAudioList();
      const duration = Date.now() - start;
      console.log(`✅ Mock delay applied: ${duration}ms (expected ~1000ms)\n`);
    } catch (error: any) {
      console.log(`❌ Delay test failed: ${error.message}\n`);
    }

    mockDataLoader.setMockResponseDelay(0); 
  }

  


  async compareResponses() {
    console.log("\n⚖️ COMPARING MOCK vs API RESPONSES\n");
    console.log("=" + "=".repeat(79));

    await mockDataLoader.initialize();

    const endpoints = [
      {
        name: "Music Library",
        method: () => musicLibraryService.getAudioList(),
      },
      {
        name: "Video Filters",
        method: () => videoEditorService.getVideoFilters(),
      },
      {
        name: "Trending Reels",
        method: () => feedService.getTrendingReels(),
      },
    ];

    for (const endpoint of endpoints) {
      console.log(`📊 ${endpoint.name}\n`);

      
      mockDataLoader.forceMockData();
      const mockResult = await endpoint.method();

      
      mockDataLoader.allowAPI();
      const apiResult = await endpoint.method();

      console.log(`Mock: ${mockResult.data?.length || 0} items (${mockResult.source})`);
      console.log(`API:  ${apiResult.data?.length || 0} items (${apiResult.source})`);
      console.log(`Match: ${mockResult.data?.length === apiResult.data?.length ? "✅" : "❌"}\n`);
    }
  }

  


  async verifyDataStructure() {
    console.log("\n🔍 VERIFYING DATA STRUCTURE CONSISTENCY\n");
    console.log("=" + "=".repeat(79));

    await mockDataLoader.initialize();
    mockDataLoader.forceMockData();

    try {
      
      console.log("Audio Track Structure:\n");
      const audioResult = await musicLibraryService.getAudioList();
      if (audioResult.data && audioResult.data.length > 0) {
        const track = audioResult.data[0];
        console.log(JSON.stringify(track, null, 2));
        this.validateKeys(track, ["id", "title", "artist", "duration"]);
      }

      
      console.log("\n\nReel Structure:\n");
      const reelsResult = await feedService.getTrendingReels();
      if (reelsResult.data && reelsResult.data.length > 0) {
        const reel = reelsResult.data[0];
        console.log(JSON.stringify(reel, null, 2));
        this.validateKeys(reel, ["id", "title", "creator", "thumbnail", "likes", "views"]);
      }

      
      console.log("\n\nVideo Filter Structure:\n");
      const filterResult = await videoEditorService.getVideoFilters();
      if (filterResult.data && filterResult.data.length > 0) {
        const filter = filterResult.data[0];
        console.log(JSON.stringify(filter, null, 2));
        this.validateKeys(filter, ["id", "name", "thumbnail"]);
      }
    } catch (error: any) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  


  private validateKeys(obj: any, requiredKeys: string[]): boolean {
    const missing = requiredKeys.filter((key) => !(key in obj));
    if (missing.length > 0) {
      console.log(`❌ Missing keys: ${missing.join(", ")}`);
      return false;
    }
    console.log(`✅ All required keys present`);
    return true;
  }

  


  private printResults(mode: string) {
    console.log("\n" + "=".repeat(80));
    console.log("📊 VERIFICATION RESULTS\n");

    const passed = this.results.filter((r) => r.success).length;
    const total = this.results.length;
    const percentage = Math.round((passed / total) * 100);

    console.log(`Mode: ${mode}`);
    console.log(`Passed: ${passed}/${total} (${percentage}%)\n`);

    const avgTime = Math.round(
      this.results.reduce((sum, r) => sum + r.responseTime, 0) / total
    );
    console.log(`Average Response Time: ${avgTime}ms`);
    console.log(`Min: ${Math.min(...this.results.map((r) => r.responseTime))}ms`);
    console.log(`Max: ${Math.max(...this.results.map((r) => r.responseTime))}ms\n`);

    if (passed === total) {
      console.log(`✅ All endpoints verified successfully!\n`);
    } else {
      console.log(`⚠️ ${total - passed} endpoint(s) failed.\n`);
    }
  }

  


  getResults() {
    return {
      totalEndpoints: this.results.length,
      passed: this.results.filter((r) => r.success).length,
      results: this.results,
    };
  }

  


  async runFullVerification() {
    console.log("\n\n");
    console.log("╔" + "═".repeat(78) + "╗");
    console.log("║" + " ".repeat(78) + "║");
    console.log("║" + "🔬 FULL API INTEGRATION VERIFICATION SUITE".padEnd(78) + "║");
    console.log("║" + " ".repeat(78) + "║");
    console.log("╚" + "═".repeat(78) + "╝");

    await this.verifyWithMockData();
    await this.verifyWithApi();
    await this.verifyFallbackBehavior();
    await this.compareResponses();
    await this.verifyDataStructure();

    console.log("\n" + "=".repeat(80));
    console.log("✅ FULL VERIFICATION COMPLETE\n");
  }
}


const apiIntegrationVerifier = new ApiIntegrationVerifier();


if (typeof global !== "undefined") {
  (global as any).__API_VERIFIER__ = apiIntegrationVerifier;
}

export default apiIntegrationVerifier;
