import axios from 'axios';
import { API_CONFIG } from './config';
import { 
  mockDashboardMetrics, 
  mockRecentOrders, 
  mockPaymentData,
  mockMenuItems,
  mockCategories,
  mockOrders,
  mockOrderStats,
  mockUsers,
  mockNavigation
} from './mockData';

// Track if we're in demo mode (backend unavailable)
let demoMode = false;

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Check if response is JSON
const isJsonResponse = (response) => {
  try {
    const contentType = response.headers?.['content-type'] || response.headers?.['Content-Type'];
    return contentType && contentType.includes('application/json');
  } catch (error) {
    return false;
  }
};

// Check if error suggests backend is unavailable
const isBackendUnavailable = (error) => {
  if (!error.response) return true; // Network error
  
  const status = error.response.status;
  const contentType = error.response.headers?.['content-type'] || error.response.headers?.['Content-Type'];
  
  // 404, 502, 503 or HTML response suggests backend is not available
  return status === 404 || status === 502 || status === 503 || 
         (contentType && contentType.includes('text/html'));
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to get auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors with retry logic
api.interceptors.response.use(
  (response) => {
    try {
      // Check if response is actually JSON
      if (!isJsonResponse(response)) {
        console.warn('Non-JSON response received, switching to demo mode');
        demoMode = true;
        // Don't throw here, let the makeRequest function handle it
      }
      return response;
    } catch (error) {
      console.warn('Response interceptor error:', error);
      return response;
    }
  },
  async (error) => {
    try {
      const originalRequest = error.config;

      // Check if backend is unavailable
      if (isBackendUnavailable(error)) {
        console.log('Backend unavailable, switching to demo mode');
        demoMode = true;
        // Don't throw here, let the makeRequest function handle the fallback
        return Promise.reject(error);
      }

      // Handle 401 errors
      if (error.response?.status === 401) {
        try {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        } catch (localStorageError) {
          console.warn('Failed to handle 401 error:', localStorageError);
        }
        return Promise.reject(error);
      }

      // Retry logic for network errors (but not if we're already in demo mode)
      if (!error.response && !originalRequest._retry && !demoMode) {
        originalRequest._retry = true;
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
        
        try {
          return await api(originalRequest);
        } catch (retryError) {
          console.warn('API retry failed:', retryError);
          if (isBackendUnavailable(retryError)) {
            demoMode = true;
          }
          return Promise.reject(retryError);
        }
      }

      return Promise.reject(error);
    } catch (interceptorError) {
      console.error('Error in response interceptor:', interceptorError);
      return Promise.reject(error);
    }
  }
);

// Safe API wrapper that handles all errors gracefully
const safeApiCall = async (apiCall, fallbackData = null) => {
  try {
    if (demoMode && fallbackData !== null) {
      console.log('Demo mode: returning mock data');
      return fallbackData;
    }

    const response = await apiCall();
    
    // Check if we got a valid response
    if (!response || !response.data) {
      throw new Error('Invalid response received');
    }
    
    return response.data;
  } catch (error) {
    console.warn('API call failed:', error);
    
    // If we have fallback data and the backend seems unavailable, use it
    if (fallbackData !== null && (isBackendUnavailable(error) || demoMode)) {
      console.log('Using fallback data due to backend unavailability');
      demoMode = true;
      return fallbackData;
    }
    
    // Re-throw if no fallback available
    throw error;
  }
};

// Simpler makeRequest function
const makeRequest = async (requestFn, fallbackData = null) => {
  return safeApiCall(requestFn, fallbackData);
};

// =============================================================================
// DASHBOARD API
// =============================================================================

export const dashboardAPI = {
  getMetrics: async () => {
    return makeRequest(() => api.get('/dashboard/metrics'), mockDashboardMetrics);
  },

  getRecentOrders: async () => {
    return makeRequest(() => api.get('/dashboard/recent-orders'), mockRecentOrders);
  },

  getPaymentSummary: async () => {
    return makeRequest(() => api.get('/dashboard/payment-summary'), mockPaymentData);
  },
};

// =============================================================================
// MENU API
// =============================================================================

export const menuAPI = {
  getMenuItems: async () => {
    return makeRequest(() => api.get('/menu-items'), mockMenuItems);
  },

  getCategories: async () => {
    return makeRequest(() => api.get('/categories'), mockCategories);
  },

  addMenuItem: async (itemData) => {
    if (demoMode) {
      const newItem = {
        id: Date.now().toString(),
        ...itemData
      };
      mockMenuItems.push(newItem);
      return newItem;
    }
    return makeRequest(() => api.post('/menu-items', itemData));
  },

  updateMenuItem: async (id, itemData) => {
    if (demoMode) {
      const index = mockMenuItems.findIndex(item => item.id === id);
      if (index !== -1) {
        mockMenuItems[index] = { ...mockMenuItems[index], ...itemData };
      }
      return { message: 'Menu item updated successfully' };
    }
    return makeRequest(() => api.put(`/menu-items/${id}`, itemData));
  },

  deleteMenuItem: async (id) => {
    if (demoMode) {
      const index = mockMenuItems.findIndex(item => item.id === id);
      if (index !== -1) {
        mockMenuItems.splice(index, 1);
      }
      return { message: 'Menu item deleted successfully' };
    }
    return makeRequest(() => api.delete(`/menu-items/${id}`));
  },
};

// =============================================================================
// ORDERS API
// =============================================================================

export const ordersAPI = {
  getOrders: async (filters = {}) => {
    if (demoMode) {
      let filteredOrders = [...mockOrders];
      
      if (filters.status && filters.status !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === filters.status);
      }
      
      return filteredOrders;
    }

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.append(key, value);
      }
    });
    
    return makeRequest(() => api.get(`/orders?${params.toString()}`), mockOrders);
  },

  getOrderStats: async () => {
    return makeRequest(() => api.get('/orders/stats'), mockOrderStats);
  },

  updateOrderStatus: async (orderId, status) => {
    if (demoMode) {
      const order = mockOrders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
      }
      return { message: 'Order status updated successfully' };
    }
    return makeRequest(() => api.put(`/orders/${orderId}/status`, { status }));
  },
};

// =============================================================================
// USERS API
// =============================================================================

export const usersAPI = {
  getUsers: async () => {
    return makeRequest(() => api.get('/users'), mockUsers);
  },

  addUser: async (userData) => {
    if (demoMode) {
      const newUser = {
        id: mockUsers.length + 1,
        ...userData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        lastLogin: null
      };
      mockUsers.push(newUser);
      return newUser;
    }
    return makeRequest(() => api.post('/users', userData));
  },

  updateUser: async (id, userData) => {
    if (demoMode) {
      const index = mockUsers.findIndex(user => user.id === id);
      if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...userData };
      }
      return { message: 'User updated successfully' };
    }
    return makeRequest(() => api.put(`/users/${id}`, userData));
  },

  deleteUser: async (id) => {
    if (demoMode) {
      const index = mockUsers.findIndex(user => user.id === id);
      if (index !== -1) {
        mockUsers.splice(index, 1);
      }
      return { message: 'User deleted successfully' };
    }
    return makeRequest(() => api.delete(`/users/${id}`));
  },
};

// =============================================================================
// CUSTOMERS API
// =============================================================================

export const customersAPI = {
  getCustomers: async () => {
    return makeRequest(() => api.get('/customers'), []);
  },
};

// =============================================================================
// PAGE DATA API
// =============================================================================

export const getPageData = async (path, searchParams = '') => {
  const fallbackPageData = {
    '/': { 
      page: 'dashboard-overview', 
      title: 'Dashboard Overview', 
      component: 'DashboardOverview',
      breadcrumb: [{ label: 'Dashboard', href: '/', active: true }]
    },
    '/order-management': { 
      page: 'order-management', 
      title: 'Order Management', 
      component: 'OrderManagement',
      breadcrumb: [
        { label: 'Dashboard', href: '/' },
        { label: 'Orders', href: '/order-management', active: true }
      ]
    },
    '/menu-management': { 
      page: 'menu-management', 
      title: 'Menu Management', 
      component: 'MenuManagement',
      breadcrumb: [
        { label: 'Dashboard', href: '/' },
        { label: 'Menu', href: '/menu-management', active: true }
      ]
    },
    '/user-management': { 
      page: 'user-management', 
      title: 'User Management', 
      component: 'UserManagement',
      breadcrumb: [
        { label: 'Dashboard', href: '/' },
        { label: 'Users', href: '/user-management', active: true }
      ]
    },
    '/bill-generation': { 
      page: 'bill-generation', 
      title: 'Bill Generation', 
      component: 'BillGeneration',
      breadcrumb: [
        { label: 'Dashboard', href: '/' },
        { label: 'Orders', href: '/order-management' },
        { label: 'Generate Bill', href: '/bill-generation', active: true }
      ]
    },
    '/order-details': { 
      page: 'order-details', 
      title: 'Order Details', 
      component: 'OrderDetails',
      breadcrumb: [
        { label: 'Dashboard', href: '/' },
        { label: 'Orders', href: '/order-management' },
        { label: 'Order Details', href: '/order-details', active: true }
      ]
    }
  };

  const defaultData = fallbackPageData[path] || fallbackPageData['/'];

  if (demoMode) {
    return defaultData;
  }

  try {
    const params = new URLSearchParams();
    params.append('path', path);
    
    if (searchParams) {
      const additionalParams = new URLSearchParams(searchParams);
      for (const [key, value] of additionalParams) {
        params.append(key, value);
      }
    }

    const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/page-data?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Non-JSON response received');
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Page data fetch failed, using fallback:', error);
    demoMode = true;
    return defaultData;
  }
};

// =============================================================================
// NAVIGATION API
// =============================================================================

export const getNavigation = async () => {
  if (demoMode) {
    return mockNavigation;
  }

  try {
    const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/navigation`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Non-JSON response received');
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Navigation fetch failed, using fallback:', error);
    demoMode = true;
    return mockNavigation;
  }
};

// =============================================================================
// DATABASE INITIALIZATION
// =============================================================================

export const initializeDatabase = async () => {
  if (demoMode) {
    throw new Error('Database initialization not available in demo mode');
  }
  return makeRequest(() => api.post('/init-database'));
};

// =============================================================================
// HEALTH CHECK
// =============================================================================

export const healthCheck = async () => {
  if (demoMode) {
    return {
      status: 'DEMO',
      message: 'Running in demo mode - backend not available',
      timestamp: new Date().toISOString(),
      environment: 'demo',
      database: 'mock'
    };
  }

  try {
    const response = await makeRequest(() => api.get('/health'));
    return response;
  } catch (error) {
    console.warn('Health check failed, switching to demo mode:', error);
    demoMode = true;
    return {
      status: 'DEMO',
      message: 'Backend health check failed - running in demo mode',
      timestamp: new Date().toISOString(),
      environment: 'demo',
      database: 'mock'
    };
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const isDemoMode = () => demoMode;

export const setDemoMode = (enabled) => {
  demoMode = enabled;
  console.log('Demo mode set to:', enabled);
};

export const resetDemoMode = () => {
  demoMode = false;
  console.log('Demo mode reset');
};

export default api;
