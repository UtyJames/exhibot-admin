// src/utils/env.ts
export const env = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    target: import.meta.env.VITE_API_TARGET,
  },
  
  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Exhiibot Admin',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_APP_ENV || 'development',
  },
  
  // Environment Checks
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

// Validation
export const validateEnv = () => {
  const required = ['VITE_API_BASE_URL', 'VITE_API_TARGET'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
  
  console.log('✅ Environment variables loaded successfully');
  console.log('🌍 Environment:', env.app.environment);
  console.log('🔗 API Base URL:', env.api.baseUrl);
  
  return true;
};