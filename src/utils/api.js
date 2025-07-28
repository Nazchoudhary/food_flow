import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// =============================================================================
// DASHBOARD API
// =============================================================================

export const dashboardAPI = {
  getMetrics: async () => {
    const response = await api.get('/dashboard/metrics');
    return response.data;
  },

  getRecentOrders: async () => {
    const response = await api.get('/dashboard/recent-orders');
    return response.data;
  },

  getPaymentSummary: async () => {
    const response = await api.get('/dashboard/payment-summary');
    return response.data;
  },
};

// =============================================================================
// MENU API
// =============================================================================

export const menuAPI = {
  getMenuItems: async () => {
    const response = await api.get('/menu-items');
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  addMenuItem: async (itemData) => {
    const response = await api.post('/menu-items', itemData);
    return response.data;
  },

  updateMenuItem: async (id, itemData) => {
    const response = await api.put(`/menu-items/${id}`, itemData);
    return response.data;
  },

  deleteMenuItem: async (id) => {
    const response = await api.delete(`/menu-items/${id}`);
    return response.data;
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
    
    const response = await api.get(`/orders?${params.toString()}`);
    return response.data;
  },

  getOrderStats: async () => {
    const response = await api.get('/orders/stats');
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },
};

// =============================================================================
// USERS API
// =============================================================================

export const usersAPI = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  addUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// =============================================================================
// CUSTOMERS API
// =============================================================================

export const customersAPI = {
  getCustomers: async () => {
    const response = await api.get('/customers');
    return response.data;
  },
};

// =============================================================================
// DATABASE INITIALIZATION
// =============================================================================

export const initializeDatabase = async () => {
  const response = await api.post('/init-database');
  return response.data;
};

// =============================================================================
// HEALTH CHECK
// =============================================================================

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
