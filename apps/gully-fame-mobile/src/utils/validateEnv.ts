// apps/gully-fame-mobile/src/utils/validateEnv.ts

const required = [
  'EXPO_PUBLIC_API_BASE_URL',
] as const;

export function validateEnv() {
  const missing: string[] = [];

  required.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n\nCheck your .env file!`
    );
  }
}