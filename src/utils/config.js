// API Configuration for different environments

const getApiBaseUrl = () => {
  // If VITE_API_URL is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In any deployed environment (not localhost), use the same origin
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${window.location.origin}/api`;
  }
  
  // In development with localhost, use the separate backend port
  return 'http://localhost:5000/api';
};

const getBackendUrl = () => {
  // If VITE_BACKEND_URL is set, use it
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  
  // In any deployed environment (not localhost), use the same origin
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return window.location.origin;
  }
  
  // In development with localhost, use the separate backend port
  return 'http://localhost:5000';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  BACKEND_URL: getBackendUrl(),
  TIMEOUT: 15000, // Increased timeout for deployed environments
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  // Debug info
  IS_DEPLOYED: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
  HOSTNAME: window.location.hostname,
  ORIGIN: window.location.origin
};

// Log configuration in development
if (import.meta.env.DEV) {
  console.log('API Configuration:', {
    BASE_URL: API_CONFIG.BASE_URL,
    BACKEND_URL: API_CONFIG.BACKEND_URL,
    IS_DEPLOYED: API_CONFIG.IS_DEPLOYED,
    HOSTNAME: API_CONFIG.HOSTNAME
  });
}

export default API_CONFIG;
