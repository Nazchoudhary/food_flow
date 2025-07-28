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
    process.exit(1);
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FoodFlow Backend API is running' });
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
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

// Get recent orders for dashboard
app.get('/api/dashboard/recent-orders', async (req, res) => {
  try {
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
    res.status(500).json({ error: 'Failed to fetch recent orders' });
  }
});

// Get payment summary
app.get('/api/dashboard/payment-summary', async (req, res) => {
  try {
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
    res.status(500).json({ error: 'Failed to fetch payment summary' });
  }
});

// =============================================================================
// MENU MANAGEMENT API ROUTES
// =============================================================================

// Get all menu items
app.get('/api/menu-items', async (req, res) => {
  try {
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
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
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
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Add new menu item
app.post('/api/menu-items', async (req, res) => {
  try {
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

// Update menu item
app.put('/api/menu-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, description, status } = req.body;

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

    await pool.execute(`
      UPDATE menu_items 
      SET name = ?, category_id = ?, price = ?, description = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `, [name, categoryId, price, description, status, id]);

    res.json({ message: 'Menu item updated successfully' });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// Delete menu item
app.delete('/api/menu-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM menu_items WHERE id = ?', [id]);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

// =============================================================================
// ORDER MANAGEMENT API ROUTES
// =============================================================================

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const { status, dateRange, tableNumber, searchQuery } = req.query;
    
    let query = `
      SELECT o.*, c.name as customer_name, c.whatsapp_number,
             GROUP_CONCAT(CONCAT(oi.quantity, 'x ', mi.name) SEPARATOR ', ') as items_summary
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
    `;
    
    const conditions = [];
    const params = [];

    if (status && status !== 'all') {
      conditions.push('o.status = ?');
      params.push(status);
    }

    if (dateRange === 'today') {
      conditions.push('DATE(o.created_at) = CURDATE()');
    }

    if (tableNumber && tableNumber !== 'all') {
      conditions.push('o.table_number LIKE ?');
      params.push(`%${tableNumber}%`);
    }

    if (searchQuery) {
      conditions.push('(c.name LIKE ? OR c.whatsapp_number LIKE ?)');
      params.push(`%${searchQuery}%`, `%${searchQuery}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC';

    const [orders] = await pool.execute(query, params);

    const formattedOrders = orders.map(order => ({
      id: order.order_id,
      timestamp: new Date(order.created_at),
      tableNumber: order.table_number,
      customerName: order.customer_name,
      whatsappNumber: order.whatsapp_number,
      itemsSummary: order.items_summary || 'No items',
      totalAmount: parseFloat(order.total_amount),
      status: order.status
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order statistics
app.get('/api/orders/stats', async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_orders,
        SUM(CASE WHEN status = 'unpaid' THEN 1 ELSE 0 END) as unpaid_orders,
        SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) as total_revenue
      FROM orders 
      WHERE DATE(created_at) = CURDATE()
    `);

    res.json({
      totalOrders: parseInt(stats[0].total_orders),
      paidOrders: parseInt(stats[0].paid_orders),
      unpaidOrders: parseInt(stats[0].unpaid_orders),
      totalRevenue: parseFloat(stats[0].total_revenue || 0),
      totalOrdersChange: 12,
      paidOrdersChange: 8,
      unpaidOrdersChange: -5,
      revenueChange: 15
    });
  } catch (error) {
    console.error('Order stats error:', error);
    res.status(500).json({ error: 'Failed to fetch order statistics' });
  }
});

// Update order status
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.execute(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE order_id = ?',
      [status, id]
    );

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// =============================================================================
// USER MANAGEMENT API ROUTES
// =============================================================================

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await pool.execute(`
      SELECT id, name, email, role, status, created_at, last_login
      FROM users
      ORDER BY created_at DESC
    `);

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.created_at,
      lastLogin: user.last_login
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Add new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const defaultPassword = 'TempPass123!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const [result] = await pool.execute(`
      INSERT INTO users (name, email, password, role, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'pending', NOW(), NOW())
    `, [name, email, hashedPassword, role]);

    res.status(201).json({ 
      id: result.insertId,
      name,
      email,
      role,
      status: 'pending',
      message: 'User created successfully' 
    });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;

    await pool.execute(`
      UPDATE users 
      SET name = ?, email = ?, role = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `, [name, email, role, status, id]);

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// =============================================================================
// DATABASE INITIALIZATION
// =============================================================================

// Initialize database tables and sample data
app.post('/api/init-database', async (req, res) => {
  try {
    // Create database if it doesn't exist
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();

    // Reconnect with database
    await initializeDatabase();

    // Create tables
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category_id INT,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        whatsapp_number VARCHAR(20) UNIQUE,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(50) UNIQUE NOT NULL,
        customer_id INT NOT NULL,
        table_number VARCHAR(20),
        total_amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'processing', 'completed', 'paid', 'unpaid', 'cancelled') DEFAULT 'pending',
        payment_method ENUM('cash', 'card', 'digital') NULL,
        items_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        menu_item_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'superadmin') DEFAULT 'admin',
        status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    res.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize database' });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 FoodFlow Backend API running on port ${PORT}`);
  
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
});
