





import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockDataManager } from "../mockData/mockDataManager";

export interface MockDataLoaderConfig {
  
  enabled: boolean;
  
  forceMock: boolean;
  
  fallbackEnabled: boolean;
  
  verboseLogging: boolean;
  
  mockResponseDelay: number;
}

class MockDataLoaderUtility {
  private config: MockDataLoaderConfig = {
    enabled: __DEV__, 
    forceMock: false,
    fallbackEnabled: true,
    verboseLogging: __DEV__,
    mockResponseDelay: 0,
  };

  private isInitialized = false;

  


  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      
      const storedConfig = await AsyncStorage.getItem("mockDataLoaderConfig");
      if (storedConfig) {
        const parsedConfig = JSON.parse(storedConfig);
        this.setConfig(parsedConfig);
      }

      
      mockDataManager.setConfig({
        useMockData: this.config.forceMock || this.config.enabled,
        enableLogging: this.config.verboseLogging,
        fallbackToMock: this.config.fallbackEnabled,
      });

      this.isInitialized = true;
      this.log("[MockDataLoader] Initialized successfully");
    } catch (error) {
      console.error("[MockDataLoader] Initialization error:", error);
    }
  }

  


  setConfig(config: Partial<MockDataLoaderConfig>): void {
    this.config = { ...this.config, ...config };
    this.log("[MockDataLoader] Config updated:", this.config);

    
    mockDataManager.setConfig({
      useMockData: this.config.forceMock || this.config.enabled,
      enableLogging: this.config.verboseLogging,
      fallbackToMock: this.config.fallbackEnabled,
    });
  }

  


  getConfig(): MockDataLoaderConfig {
    return { ...this.config };
  }

  


  enable(): void {
    this.setConfig({ enabled: true });
  }

  


  disable(): void {
    this.setConfig({ enabled: false });
  }

  


  forceMockData(): void {
    this.setConfig({ forceMock: true });
    this.log("[MockDataLoader] Forcing mock data mode");
  }

  


  allowAPI(): void {
    this.setConfig({ forceMock: false });
    this.log("[MockDataLoader] Allowing API with mock fallback");
  }

  


  enableVerboseLogging(): void {
    this.setConfig({ verboseLogging: true });
  }

  


  disableVerboseLogging(): void {
    this.setConfig({ verboseLogging: false });
  }

  


  setMockResponseDelay(ms: number): void {
    this.setConfig({ mockResponseDelay: ms });
    this.log(`[MockDataLoader] Mock response delay set to ${ms}ms`);
  }

  


  getMode(): string {
    if (this.config.forceMock) {
      return "MOCK_ONLY";
    } else if (this.config.enabled && this.config.fallbackEnabled) {
      return "HYBRID (API + Mock Fallback)";
    } else if (this.config.enabled) {
      return "MOCK_ENABLED";
    } else {
      return "API_ONLY";
    }
  }

  


  getMockDataStats() {
    return mockDataManager.getStats();
  }

  


  logMockDataAvailability(): void {
    mockDataManager.logAvailableData();
  }

  


  async saveConfig(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        "mockDataLoaderConfig",
        JSON.stringify(this.config)
      );
      this.log("[MockDataLoader] Config saved to storage");
    } catch (error) {
      console.error("[MockDataLoader] Failed to save config:", error);
    }
  }

  


  async resetConfig(): Promise<void> {
    this.config = {
      enabled: __DEV__,
      forceMock: false,
      fallbackEnabled: true,
      verboseLogging: __DEV__,
      mockResponseDelay: 0,
    };
    await this.saveConfig();
    this.log("[MockDataLoader] Config reset to defaults");
  }

  


  printStatus(): void {
    console.log("========== MOCK DATA LOADER STATUS ==========");
    console.log(`Mode: ${this.getMode()}`);
    console.log(`Enabled: ${this.config.enabled}`);
    console.log(`Force Mock: ${this.config.forceMock}`);
    console.log(`Fallback Enabled: ${this.config.fallbackEnabled}`);
    console.log(`Verbose Logging: ${this.config.verboseLogging}`);
    console.log(`Mock Response Delay: ${this.config.mockResponseDelay}ms`);
    console.log("\n========== MOCK DATA STATISTICS ==========");
    const stats = this.getMockDataStats();
    console.log(`Music Tracks: ${stats.musicTracks}`);
    console.log(`Music Categories: ${stats.musicCategories}`);
    console.log(`Video Filters: ${stats.videoFilters}`);
    console.log(`Reels: ${stats.reels}`);
    console.log(`Categories: ${stats.categories}`);
    console.log(`Collections: ${stats.collections}`);
    console.log("==========================================");
  }

  


  private log(...args: any[]): void {
    if (this.config.verboseLogging) {
      console.log(...args);
    }
  }
}


export const mockDataLoader = new MockDataLoaderUtility();


if (__DEV__ && typeof global !== "undefined") {
  (global as any).__MOCK_DATA_LOADER__ = mockDataLoader;
}

export default mockDataLoader;
