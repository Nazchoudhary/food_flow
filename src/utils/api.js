import axios from 'axios';
import { API_CONFIG } from './config';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Retry logic for network errors
    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      
      try {
        return await api(originalRequest);
      } catch (retryError) {
        console.error('API retry failed:', retryError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to make requests with better error handling
const makeRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    
    // Provide more specific error messages
    if (!error.response) {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }
    
    if (error.response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    if (error.response.status === 404) {
      throw new Error('Requested resource not found.');
    }
    
    throw new Error(error.response?.data?.error || 'An unexpected error occurred.');
  }
};

// =============================================================================
// DASHBOARD API
// =============================================================================

export const dashboardAPI = {
  getMetrics: async () => {
    return makeRequest(() => api.get('/dashboard/metrics'));
  },

  getRecentOrders: async () => {
    return makeRequest(() => api.get('/dashboard/recent-orders'));
  },

  getPaymentSummary: async () => {
    return makeRequest(() => api.get('/dashboard/payment-summary'));
  },
};

// =============================================================================
// MENU API
// =============================================================================

export const menuAPI = {
  getMenuItems: async () => {
    return makeRequest(() => api.get('/menu-items'));
  },

  getCategories: async () => {
    return makeRequest(() => api.get('/categories'));
  },

  addMenuItem: async (itemData) => {
    return makeRequest(() => api.post('/menu-items', itemData));
  },

  updateMenuItem: async (id, itemData) => {
    return makeRequest(() => api.put(`/menu-items/${id}`, itemData));
  },

  deleteMenuItem: async (id) => {
    return makeRequest(() => api.delete(`/menu-items/${id}`));
  },
};

// =============================================================================
// ORDERS API
// =============================================================================

export const ordersAPI = {
  getOrders: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.append(key, value);
      }
    });
    
    return makeRequest(() => api.get(`/orders?${params.toString()}`));
  },

  getOrderStats: async () => {
    return makeRequest(() => api.get('/orders/stats'));
  },

  updateOrderStatus: async (orderId, status) => {
    return makeRequest(() => api.put(`/orders/${orderId}/status`, { status }));
  },
};

// =============================================================================
// USERS API
// =============================================================================

export const usersAPI = {
  getUsers: async () => {
    return makeRequest(() => api.get('/users'));
  },

  addUser: async (userData) => {
    return makeRequest(() => api.post('/users', userData));
  },

  updateUser: async (id, userData) => {
    return makeRequest(() => api.put(`/users/${id}`, userData));
  },

  deleteUser: async (id) => {
    return makeRequest(() => api.delete(`/users/${id}`));
  },
};

// =============================================================================
// CUSTOMERS API
// =============================================================================

export const customersAPI = {
  getCustomers: async () => {
    return makeRequest(() => api.get('/customers'));
  },
};

// =============================================================================
// PAGE DATA API
// =============================================================================

export const getPageData = async (path, searchParams = '') => {
  const params = new URLSearchParams();
  params.append('path', path);
  
  // Add additional search parameters
  if (searchParams) {
    const additionalParams = new URLSearchParams(searchParams);
    for (const [key, value] of additionalParams) {
      params.append(key, value);
    }
  }

  const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/page-data?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to load page data');
  }
  
  return response.json();
};

// =============================================================================
// NAVIGATION API
// =============================================================================

export const getNavigation = async () => {
  const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/navigation`);
  
  if (!response.ok) {
    throw new Error('Failed to load navigation');
  }
  
  return response.json();
};

// =============================================================================
// DATABASE INITIALIZATION
// =============================================================================

export const initializeDatabase = async () => {
  return makeRequest(() => api.post('/init-database'));
};

// =============================================================================
// HEALTH CHECK
// =============================================================================

export const healthCheck = async () => {
  return makeRequest(() => api.get('/health'));
};

export default api;
