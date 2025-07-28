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

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're in demo mode (backend unavailable)
let demoMode = false;

// Check if response is JSON
const isJsonResponse = (response) => {
  const contentType = response.headers?.['content-type'];
  return contentType && contentType.includes('application/json');
};

// Check if error suggests backend is unavailable
const isBackendUnavailable = (error) => {
  if (!error.response) return true; // Network error
  
  const status = error.response.status;
  const contentType = error.response.headers?.['content-type'];
  
  // 404, 502, 503 or HTML response suggests backend is not available
  return status === 404 || status === 502 || status === 503 || 
         (contentType && contentType.includes('text/html'));
};

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
  (response) => {
    // Check if response is actually JSON
    if (!isJsonResponse(response)) {
      throw new Error('Backend returned non-JSON response. Backend may not be running.');
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if backend is unavailable
    if (isBackendUnavailable(error)) {
      demoMode = true;
      throw new Error('Backend is not available. Running in demo mode.');
    }

    // Handle 401 errors
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
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
        console.error('API retry failed:', retryError);
        if (isBackendUnavailable(retryError)) {
          demoMode = true;
        }
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to make requests with better error handling
const makeRequest = async (requestFn, fallbackData = null) => {
  if (demoMode && fallbackData) {
    console.log('Demo mode: returning mock data');
    return fallbackData;
  }

  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    
    // If backend is unavailable and we have fallback data, use it
    if (isBackendUnavailable(error) && fallbackData) {
      demoMode = true;
      console.log('Backend unavailable, switching to demo mode with mock data');
      return fallbackData;
    }
    
    // Provide more specific error messages
    if (!error.response) {
      throw new Error('Unable to connect to server. Running in demo mode.');
    }
    
    if (error.response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    if (error.response.status === 404) {
      throw new Error('API endpoint not found. Backend may not be properly configured.');
    }
    
    throw new Error(error.response?.data?.error || error.message || 'An unexpected error occurred.');
  }
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

    const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/page-data?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Non-JSON response received');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Page data fetch failed:', error);
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
    const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/navigation`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Non-JSON response received');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Navigation fetch failed:', error);
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

  return makeRequest(() => api.get('/health'));
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const isDemoMode = () => demoMode;

export const setDemoMode = (enabled) => {
  demoMode = enabled;
};

export default api;
