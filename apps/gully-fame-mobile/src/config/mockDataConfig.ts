




export type Environment = "development" | "staging" | "production";

export interface EnvironmentMockDataConfig {
  enabled: boolean;
  forceMock: boolean;
  fallbackToMock: boolean;
  verboseLogging: boolean;
  mockResponseDelay: number;
}




export const MOCK_DATA_CONFIGS: Record<Environment, EnvironmentMockDataConfig> =
  {
    development: {
      enabled: true, 
      forceMock: false, 
      fallbackToMock: true, 
      verboseLogging: true, 
      mockResponseDelay: 0, 
    },
    staging: {
      enabled: true, 
      forceMock: false, 
      fallbackToMock: true, 
      verboseLogging: false, 
      mockResponseDelay: 0,
    },
    production: {
      enabled: false, 
      forceMock: false, 
      fallbackToMock: true, 
      verboseLogging: false, 
      mockResponseDelay: 0,
    },
  };




export function getEnvironment(): Environment {
  if (__DEV__) {
    return "development";
  }

  
  if (process.env.EXPO_PUBLIC_ENVIRONMENT === "staging") {
    return "staging";
  }

  return "production";
}




export function getMockDataConfig(): EnvironmentMockDataConfig {
  const environment = getEnvironment();
  return MOCK_DATA_CONFIGS[environment];
}




export function getEnvironmentName(): string {
  const environment = getEnvironment();
  return environment.charAt(0).toUpperCase() + environment.slice(1);
}




export function isDevelopment(): boolean {
  return __DEV__;
}




export function isStaging(): boolean {
  return getEnvironment() === "staging";
}




export function isProduction(): boolean {
  return getEnvironment() === "production";
}




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
