export const API_CONFIG = {
  // Automatically use localhost for development, production URL for builds
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000'
    : 'https://grabeat-backend.up.railway.app', // Change this to your deployed backend URL
  
  // API timeout (30 seconds)
  TIMEOUT: 30000,
  
  // Number of retry attempts for failed requests
  RETRY_ATTEMPTS: 3,
  
  // API version (for future versioning)
  VERSION: 'v1',
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.BASE_URL;
  const version = API_CONFIG.VERSION;
  
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  return `${baseUrl}/api/${cleanEndpoint}`;
};

// Export environment info
export const ENV = {
  isDevelopment: __DEV__,
  isProduction: !__DEV__,
};
