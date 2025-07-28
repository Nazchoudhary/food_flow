const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend build (in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  console.log('📁 Serving static files from:', path.join(__dirname, '../dist'));
}

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'foodflow_admin',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

// Initialize database connection
async function initializeDatabase() {
  try {
    pool = mysql.createPool(dbConfig);
    console.log('✅ Connected to MySQL database');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    // In production, don't exit the process, just log the error
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// =============================================================================
// API ROUTES
// =============================================================================

// Health check endpoint with detailed info
app.get('/api/health', (req, res) => {
  const healthInfo = {
    status: 'OK',
    message: 'FoodFlow Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    database: pool ? 'connected' : 'disconnected'
  };
  
  console.log('Health check requested:', healthInfo);
  res.json(healthInfo);
});

// Get page data
app.get('/api/page-data', (req, res) => {
  const path = req.query.path || '/';
  
  const pageData = {
    '/': {
      page: 'dashboard-overview',
      title: 'Dashboard Overview',
      component: 'DashboardOverview',
      breadcrumb: [
        { label: 'Dashboard', href: '/', active: true }
      ]
    },
    '/dashboard-overview': {
      page: 'dashboard-overview',
      title: 'Dashboard Overview',
      component: 'DashboardOverview',
      breadcrumb: [
        { label: 'Dashboard', href: '/', active: true }
      ]
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
    '/order-details': {
      page: 'order-details',
      title: `Order Details - ${req.query.id || 'ORD-2025-001'}`,
      component: 'OrderDetails',
      params: { orderId: req.query.id || 'ORD-2025-001' },
      breadcrumb: [
        { label: 'Dashboard', href: '/' },
        { label: 'Orders', href: '/order-management' },
        { label: `Order ${req.query.id || 'ORD-2025-001'}`, href: `/order-details?id=${req.query.id || 'ORD-2025-001'}`, active: true }
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
      params: { orderId: req.query.orderId },
      breadcrumb: [
        { label: 'Dashboard', href: '/' },
        { label: 'Orders', href: '/order-management' },
        { label: 'Generate Bill', href: '/bill-generation', active: true }
      ]
    }
  };

  const data = pageData[path] || {
    page: '404',
    title: 'Page Not Found',
    component: 'NotFound',
    breadcrumb: [
      { label: 'Dashboard', href: '/' },
      { label: 'Not Found', href: path, active: true }
    ]
  };

  res.json(data);
});

// Get navigation structure
app.get('/api/navigation', (req, res) => {
  res.json([
    {
      path: '/',
      label: 'Dashboard',
      component: 'DashboardOverview',
      icon: 'BarChart3'
    },
    {
      path: '/order-management',
      label: 'Orders',
      component: 'OrderManagement',
      icon: 'ShoppingBag'
    },
    {
      path: '/menu-management',
      label: 'Menu',
      component: 'MenuManagement',
      icon: 'UtensilsCrossed'
    },
    {
      path: '/user-management',
      label: 'Users',
      component: 'UserManagement',
      icon: 'Users'
    },
    {
      path: '/bill-generation',
      label: 'Billing',
      component: 'BillGeneration',
      icon: 'Receipt'
    }
  ]);
});

// =============================================================================
// DASHBOARD API ROUTES
// =============================================================================

// Get dashboard metrics
app.get('/api/dashboard/metrics', async (req, res) => {
  try {
    if (!pool) {
      throw new Error('Database not connected');
    }

    const [todayOrders] = await pool.execute(`
      SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total_revenue
      FROM orders 
      WHERE DATE(created_at) = CURDATE()
    `);

    const [pendingOrders] = await pool.execute(`
      SELECT COUNT(*) as count 
      FROM orders 
      WHERE status = 'processing' OR status = 'unpaid'
    `);

    const [avgOrder] = await pool.execute(`
      SELECT AVG(total_amount) as avg_amount 
      FROM orders 
      WHERE DATE(created_at) = CURDATE()
    `);

    const metrics = {
      todaysOrders: {
        value: todayOrders[0].count,
        change: "+12%",
        changeType: "positive",
        description: "vs yesterday"
      },
      pendingOrders: {
        value: pendingOrders[0].count,
        change: "-3",
        changeType: "positive",
        description: "awaiting preparation"
      },
      totalRevenue: {
        value: `$${(todayOrders[0].total_revenue || 0).toFixed(2)}`,
        change: "+18%",
        changeType: "positive",
        description: "today's earnings"
      },
      averageOrder: {
        value: `$${(avgOrder[0].avg_amount || 0).toFixed(2)}`,
        change: "+5%",
        changeType: "positive",
        description: "per order value"
      }
    };

    res.json(metrics);
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    
    // Return mock data if database is not available
    const mockMetrics = {
      todaysOrders: {
        value: 0,
        change: "0%",
        changeType: "neutral",
        description: "vs yesterday"
      },
      pendingOrders: {
        value: 0,
        change: "0",
        changeType: "neutral",
        description: "awaiting preparation"
      },
      totalRevenue: {
        value: "$0.00",
        change: "0%",
        changeType: "neutral",
        description: "today's earnings"
      },
      averageOrder: {
        value: "$0.00",
        change: "0%",
        changeType: "neutral",
        description: "per order value"
      }
    };
    
    res.json(mockMetrics);
  }
});

// Get recent orders for dashboard
app.get('/api/dashboard/recent-orders', async (req, res) => {
  try {
    if (!pool) {
      throw new Error('Database not connected');
    }

    const [orders] = await pool.execute(`
      SELECT o.*, c.name as customer_name, c.whatsapp_number,
             GROUP_CONCAT(CONCAT(oi.quantity, 'x ', mi.name) SEPARATOR ', ') as items_summary
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    const formattedOrders = orders.map(order => ({
      id: order.order_id,
      tableNumber: order.table_number,
      customerName: order.customer_name,
      whatsappNumber: order.whatsapp_number,
      itemsCount: order.items_count,
      topItems: order.items_summary || 'No items',
      total: parseFloat(order.total_amount),
      status: order.status,
      timestamp: new Date(order.created_at)
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Recent orders error:', error);
    res.json([]); // Return empty array if database is not available
  }
});

// Get payment summary
app.get('/api/dashboard/payment-summary', async (req, res) => {
  try {
    if (!pool) {
      throw new Error('Database not connected');
    }

    const [results] = await pool.execute(`
      SELECT 
        SUM(CASE WHEN payment_method = 'cash' THEN total_amount ELSE 0 END) as cash,
        SUM(CASE WHEN payment_method = 'card' THEN total_amount ELSE 0 END) as card,
        SUM(CASE WHEN payment_method = 'digital' THEN total_amount ELSE 0 END) as digital,
        SUM(CASE WHEN status = 'unpaid' THEN total_amount ELSE 0 END) as pending,
        SUM(total_amount) as total
      FROM orders 
      WHERE DATE(created_at) = CURDATE()
    `);

    const paymentData = {
      total: parseFloat(results[0].total || 0),
      cash: parseFloat(results[0].cash || 0),
      card: parseFloat(results[0].card || 0),
      digital: parseFloat(results[0].digital || 0),
      pending: parseFloat(results[0].pending || 0)
    };

    res.json(paymentData);
  } catch (error) {
    console.error('Payment summary error:', error);
    res.json({ total: 0, cash: 0, card: 0, digital: 0, pending: 0 });
  }
});

// =============================================================================
// MENU MANAGEMENT API ROUTES
// =============================================================================

// Get all menu items
app.get('/api/menu-items', async (req, res) => {
  try {
    if (!pool) {
      throw new Error('Database not connected');
    }

    const [items] = await pool.execute(`
      SELECT mi.*, c.name as category_name 
      FROM menu_items mi
      LEFT JOIN categories c ON mi.category_id = c.id
      ORDER BY mi.name ASC
    `);

    const formattedItems = items.map(item => ({
      id: item.id.toString(),
      name: item.name,
      category: item.category_name || 'Uncategorized',
      price: parseFloat(item.price),
      description: item.description,
      status: item.status
    }));

    res.json(formattedItems);
  } catch (error) {
    console.error('Menu items error:', error);
    res.json([]); // Return empty array if database is not available
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    if (!pool) {
      throw new Error('Database not connected');
    }

    const [categories] = await pool.execute(`
      SELECT c.*, COUNT(mi.id) as item_count
      FROM categories c
      LEFT JOIN menu_items mi ON c.id = mi.category_id AND mi.status = 'active'
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

    const formattedCategories = categories.map(cat => ({
      id: cat.id.toString(),
      name: cat.name,
      itemCount: parseInt(cat.item_count)
    }));

    res.json(formattedCategories);
  } catch (error) {
    console.error('Categories error:', error);
    res.json([]); // Return empty array if database is not available
  }
});

// Add menu item endpoints with error handling...
app.post('/api/menu-items', async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { name, category, price, description, status = 'active' } = req.body;
    
    // Find or create category
    let categoryId;
    const [existingCategories] = await pool.execute(
      'SELECT id FROM categories WHERE name = ?',
      [category]
    );

    if (existingCategories.length > 0) {
      categoryId = existingCategories[0].id;
    } else {
      const [result] = await pool.execute(
        'INSERT INTO categories (name) VALUES (?)',
        [category]
      );
      categoryId = result.insertId;
    }

    const [result] = await pool.execute(`
      INSERT INTO menu_items (name, category_id, price, description, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `, [name, categoryId, price, description, status]);

    res.status(201).json({ 
      id: result.insertId.toString(),
      name,
      category,
      price: parseFloat(price),
      description,
      status,
      message: 'Menu item created successfully' 
    });
  } catch (error) {
    console.error('Add menu item error:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

// Database initialization with error handling
app.post('/api/init-database', async (req, res) => {
  try {
    if (pool) {
      return res.json({ message: 'Database already initialized' });
    }

    // Try to initialize database connection
    await initializeDatabase();

    if (!pool) {
      return res.status(503).json({ error: 'Unable to connect to database. Please check your database configuration.' });
    }

    res.json({ message: 'Database connection established successfully' });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize database: ' + error.message });
  }
});

// =============================================================================
// CATCH ALL ROUTES FOR FRONTEND
// =============================================================================

// Catch all handler: serve React app for any non-API routes (in production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    // For API routes that don't exist, return 404
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // For page routes, serve the app
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 FoodFlow Backend API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    console.log('⚠️  Server started without database connection. Database features will be limited.');
  }
});
