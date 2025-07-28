// API Configuration for different environments

const getApiBaseUrl = () => {
  // If VITE_API_URL is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production/deployed environment, use the same origin as the frontend
  if (import.meta.env.PROD) {
    return `${window.location.origin}/api`;
  }
  
  // In development, use localhost:5000
  return 'http://localhost:5000/api';
};

const getBackendUrl = () => {
  // If VITE_BACKEND_URL is set, use it
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  
  // In production/deployed environment, use the same origin as the frontend
  if (import.meta.env.PROD) {
    return window.location.origin;
  }
  
  // In development, use localhost:5000
  return 'http://localhost:5000';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  BACKEND_URL: getBackendUrl(),
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

export default API_CONFIG;
