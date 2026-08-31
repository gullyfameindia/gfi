/**
 * Mock Data Loader Utility
 * Provides easy switching between mock and real API data
 * Configure globally for development, staging, or production
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockDataManager } from "../mockData/mockDataManager";

export interface MockDataLoaderConfig {
  // Global enable/disable
  enabled: boolean;
  // Force mock data even if API is available
  forceMock: boolean;
  // Fallback to mock if API fails
  fallbackEnabled: boolean;
  // Enable verbose logging
  verboseLogging: boolean;
  // Delay mock responses (for testing loading states)
  mockResponseDelay: number;
}

class MockDataLoaderUtility {
  private config: MockDataLoaderConfig = {
    enabled: __DEV__, // Enabled by default in development
    forceMock: false,
    fallbackEnabled: true,
    verboseLogging: __DEV__,
    mockResponseDelay: 0,
  };

  private isInitialized = false;

  /**
   * Initialize the mock data loader from storage/config
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load config from AsyncStorage if available
      const storedConfig = await AsyncStorage.getItem("mockDataLoaderConfig");
      if (storedConfig) {
        const parsedConfig = JSON.parse(storedConfig);
        this.setConfig(parsedConfig);
      }

      // Initialize mockDataManager with current config
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

  /**
   * Set configuration
   */
  setConfig(config: Partial<MockDataLoaderConfig>): void {
    this.config = { ...this.config, ...config };
    this.log("[MockDataLoader] Config updated:", this.config);

    // Update mockDataManager
    mockDataManager.setConfig({
      useMockData: this.config.forceMock || this.config.enabled,
      enableLogging: this.config.verboseLogging,
      fallbackToMock: this.config.fallbackEnabled,
    });
  }

  /**
   * Get current configuration
   */
  getConfig(): MockDataLoaderConfig {
    return { ...this.config };
  }

  /**
   * Enable mock data globally
   */
  enable(): void {
    this.setConfig({ enabled: true });
  }

  /**
   * Disable mock data globally
   */
  disable(): void {
    this.setConfig({ enabled: false });
  }

  /**
   * Force use of mock data (overrides API)
   */
  forceMockData(): void {
    this.setConfig({ forceMock: true });
    this.log("[MockDataLoader] Forcing mock data mode");
  }

  /**
   * Allow API with mock fallback
   */
  allowAPI(): void {
    this.setConfig({ forceMock: false });
    this.log("[MockDataLoader] Allowing API with mock fallback");
  }

  /**
   * Enable verbose logging
   */
  enableVerboseLogging(): void {
    this.setConfig({ verboseLogging: true });
  }

  /**
   * Disable verbose logging
   */
  disableVerboseLogging(): void {
    this.setConfig({ verboseLogging: false });
  }

  /**
   * Set mock response delay (for testing loading states)
   */
  setMockResponseDelay(ms: number): void {
    this.setConfig({ mockResponseDelay: ms });
    this.log(`[MockDataLoader] Mock response delay set to ${ms}ms`);
  }

  /**
   * Get current mode as string
   */
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

  /**
   * Get mock data statistics
   */
  getMockDataStats() {
    return mockDataManager.getStats();
  }

  /**
   * Log available mock data
   */
  logMockDataAvailability(): void {
    mockDataManager.logAvailableData();
  }

  /**
   * Save configuration to storage
   */
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

  /**
   * Reset configuration to defaults
   */
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

  /**
   * Print current status
   */
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

  /**
   * Private logging helper
   */
  private log(...args: any[]): void {
    if (this.config.verboseLogging) {
      console.log(...args);
    }
  }
}

// Export singleton instance
export const mockDataLoader = new MockDataLoaderUtility();

// Development helper: Make globally accessible for debugging
if (__DEV__ && typeof global !== "undefined") {
  (global as any).__MOCK_DATA_LOADER__ = mockDataLoader;
}

export default mockDataLoader;
