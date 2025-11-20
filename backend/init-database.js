const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'foodflow_admin'
};

async function initDatabase() {
  let connection;
  
  try {
    // Create database if it doesn't exist
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    console.log('Creating database...');
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();

    // Connect to the database
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');

    // Create tables
    console.log('Creating tables...');
    
    // Categories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Menu items table
    await connection.execute(`
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

    // Customers table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        whatsapp_number VARCHAR(20) UNIQUE,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Orders table
    await connection.execute(`
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

    // Order items table
    await connection.execute(`
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

    // Users table
    await connection.execute(`
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

    console.log('Tables created successfully');

    // Insert sample data
    console.log('Inserting sample data...');

    // Insert categories
    const categories = [
      'Pizza', 'Salads', 'Burgers', 'Desserts', 'Main Course', 'Pasta', 'Appetizers', 'Beverages'
    ];

    for (const category of categories) {
      await connection.execute(
        'INSERT IGNORE INTO categories (name) VALUES (?)',
        [category]
      );
    }

    // Get category IDs
    const [categoryRows] = await connection.execute('SELECT id, name FROM categories');
    const categoryMap = {};
    categoryRows.forEach(row => {
      categoryMap[row.name] = row.id;
    });

    // Insert menu items
    const menuItems = [
      ['Classic Margherita Pizza', categoryMap['Pizza'], 12.99, 'Fresh tomato sauce, mozzarella cheese, and basil leaves on a crispy crust', 'active'],
      ['Grilled Chicken Caesar Salad', categoryMap['Salads'], 14.50, 'Crisp romaine lettuce, grilled chicken, parmesan cheese, and caesar dressing', 'active'],
      ['Beef Burger Deluxe', categoryMap['Burgers'], 16.99, 'Juicy beef patty with lettuce, tomato, cheese, and special sauce', 'active'],
      ['Chocolate Lava Cake', categoryMap['Desserts'], 8.99, 'Warm chocolate cake with molten center, served with vanilla ice cream', 'active'],
      ['Fish and Chips', categoryMap['Main Course'], 18.50, 'Beer-battered fish with crispy fries and tartar sauce', 'inactive'],
      ['Vegetarian Pasta', categoryMap['Pasta'], 13.99, 'Penne pasta with seasonal vegetables in marinara sauce', 'active'],
      ['BBQ Chicken Wings', categoryMap['Appetizers'], 11.99, 'Crispy chicken wings tossed in tangy BBQ sauce', 'active'],
      ['Greek Salad', categoryMap['Salads'], 10.99, 'Mixed greens, olives, feta cheese, and Greek dressing', 'inactive'],
      ['Pepperoni Pizza', categoryMap['Pizza'], 15.99, 'Classic pepperoni with mozzarella cheese and tomato sauce', 'active'],
      ['Chicken Alfredo', categoryMap['Pasta'], 17.50, 'Creamy alfredo sauce with grilled chicken over fettuccine', 'active'],
      ['Coca Cola', categoryMap['Beverages'], 2.99, 'Classic Coca Cola soft drink', 'active'],
      ['Fresh Orange Juice', categoryMap['Beverages'], 4.50, 'Freshly squeezed orange juice', 'active']
    ];

    for (const item of menuItems) {
      await connection.execute(
        'INSERT IGNORE INTO menu_items (name, category_id, price, description, status) VALUES (?, ?, ?, ?, ?)',
        item
      );
    }

    // Insert customers
    const customers = [
      ['Sarah Johnson', '+1-555-0123', 'sarah.johnson@email.com'],
      ['Mike Rodriguez', '+1-555-0124', 'mike.rodriguez@email.com'],
      ['Emily Chen', '+1-555-0125', 'emily.chen@email.com'],
      ['David Wilson', '+1-555-0126', 'david.wilson@email.com'],
      ['Lisa Anderson', '+1-555-0127', 'lisa.anderson@email.com'],
      ['John Smith', '+1-555-0128', 'john.smith@email.com'],
      ['Maria Garcia', '+1-555-0129', 'maria.garcia@email.com'],
      ['Robert Taylor', '+1-555-0130', 'robert.taylor@email.com']
    ];

    for (const customer of customers) {
      await connection.execute(
        'INSERT IGNORE INTO customers (name, whatsapp_number, email) VALUES (?, ?, ?)',
        customer
      );
    }

    // Insert sample orders
    const [customerRows] = await connection.execute('SELECT id FROM customers LIMIT 5');
    const [menuItemRows] = await connection.execute('SELECT id, price FROM menu_items WHERE status = "active" LIMIT 8');

    const orders = [
      ['ORD-2025-001', customerRows[0].id, 'T-05', 28.50, 'paid', 'cash', 3],
      ['ORD-2025-002', customerRows[1].id, 'T-12', 67.25, 'unpaid', null, 5],
      ['ORD-2025-003', customerRows[2].id, 'T-08', 34.75, 'processing', null, 2],
      ['ORD-2025-004', customerRows[3].id, 'T-03', 89.50, 'paid', 'card', 4],
      ['ORD-2025-005', customerRows[4].id, 'T-15', 16.25, 'unpaid', null, 1],
      ['ORD-2025-006', customerRows[0].id, 'T-09', 45.80, 'paid', 'digital', 3],
      ['ORD-2025-007', customerRows[1].id, 'T-07', 23.75, 'processing', null, 2],
      ['ORD-2025-008', customerRows[2].id, 'T-11', 52.60, 'paid', 'card', 4]
    ];

    for (const order of orders) {
      const [result] = await connection.execute(
        'INSERT INTO orders (order_id, customer_id, table_number, total_amount, status, payment_method, items_count) VALUES (?, ?, ?, ?, ?, ?, ?)',
        order
      );

      // Insert order items for each order
      const orderId = result.insertId;
      const itemCount = order[6]; // items_count
      
      for (let i = 0; i < itemCount; i++) {
        const menuItem = menuItemRows[i % menuItemRows.length];
        const quantity = Math.floor(Math.random() * 3) + 1;
        
        await connection.execute(
          'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, menuItem.id, quantity, menuItem.price]
        );
      }
    }

    // Insert admin users
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const users = [
      ['John Smith', 'john.smith@foodflow.com', hashedPassword, 'superadmin', 'active'],
      ['Sarah Johnson', 'sarah.johnson@foodflow.com', hashedPassword, 'admin', 'active'],
      ['Mike Davis', 'mike.davis@foodflow.com', hashedPassword, 'admin', 'inactive'],
      ['Emily Wilson', 'emily.wilson@foodflow.com', hashedPassword, 'admin', 'pending'],
      ['David Brown', 'david.brown@foodflow.com', hashedPassword, 'superadmin', 'active']
    ];

    for (const user of users) {
      await connection.execute(
        'INSERT IGNORE INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
        user
      );
    }

    console.log('✅ Database initialization completed successfully!');
    console.log('📊 Sample data inserted:');
    console.log('  - Categories: 8');
    console.log('  - Menu Items: 12');
    console.log('  - Customers: 8');
    console.log('  - Orders: 8');
    console.log('  - Admin Users: 5');
    console.log('');
    console.log('🔐 Default admin credentials:');
    console.log('  Email: john.smith@foodflow.com');
    console.log('  Password: admin123');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run initialization
initDatabase();
