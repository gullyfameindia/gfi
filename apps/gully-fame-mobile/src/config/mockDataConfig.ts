/**
 * Mock Data Configuration
 * Environment-specific settings for mock data behavior
 */

export type Environment = "development" | "staging" | "production";

export interface EnvironmentMockDataConfig {
  enabled: boolean;
  forceMock: boolean;
  fallbackToMock: boolean;
  verboseLogging: boolean;
  mockResponseDelay: number;
}

/**
 * Default configuration for each environment
 */
export const MOCK_DATA_CONFIGS: Record<Environment, EnvironmentMockDataConfig> =
  {
    development: {
      enabled: true, // Always use mock data in dev
      forceMock: false, // But allow API if available
      fallbackToMock: true, // Fall back to mock on error
      verboseLogging: true, // Show detailed logs
      mockResponseDelay: 0, // No artificial delay
    },
    staging: {
      enabled: true, // Mock data available
      forceMock: false, // Prefer API
      fallbackToMock: true, // Fall back to mock on error
      verboseLogging: false, // Less verbose
      mockResponseDelay: 0,
    },
    production: {
      enabled: false, // Mock data disabled
      forceMock: false, // Use API only
      fallbackToMock: true, // Still fall back if critical error
      verboseLogging: false, // No dev logs
      mockResponseDelay: 0,
    },
  };

/**
 * Get configuration for current environment
 */
export function getEnvironment(): Environment {
  if (__DEV__) {
    return "development";
  }

  // Check for staging environment variable
  if (process.env.EXPO_PUBLIC_ENVIRONMENT === "staging") {
    return "staging";
  }

  return "production";
}

/**
 * Get mock data configuration for current environment
 */
export function getMockDataConfig(): EnvironmentMockDataConfig {
  const environment = getEnvironment();
  return MOCK_DATA_CONFIGS[environment];
}

/**
 * Get environment name for display
 */
export function getEnvironmentName(): string {
  const environment = getEnvironment();
  return environment.charAt(0).toUpperCase() + environment.slice(1);
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return __DEV__;
}

/**
 * Check if we're in staging mode
 */
export function isStaging(): boolean {
  return getEnvironment() === "staging";
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return getEnvironment() === "production";
}

/**
 * Get description of current mock data setup
 */
export function describeMockDataSetup(): string {
  const environment = getEnvironment();
  const config = getMockDataConfig();

  let description = `Environment: ${environment}\n`;
  description += `Mock Data Enabled: ${config.enabled}\n`;
  description += `Force Mock: ${config.forceMock}\n`;
  description += `Fallback to Mock: ${config.fallbackToMock}\n`;
  description += `Verbose Logging: ${config.verboseLogging}\n`;
  description += `Mock Response Delay: ${config.mockResponseDelay}ms`;

  return description;
}

export default {
  getEnvironment,
  getMockDataConfig,
  getEnvironmentName,
  isDevelopment,
  isStaging,
  isProduction,
  describeMockDataSetup,
  MOCK_DATA_CONFIGS,
};
