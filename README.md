# FoodFlow Admin Dashboard

A comprehensive restaurant management system with dynamic data fetching from MySQL database.

## 🏗️ Architecture Overview

- **Frontend**: React with Vite, TailwindCSS, and modern UI components
- **Backend**: Node.js with Express.js API server
- **Database**: MySQL with complete relational schema
- **Authentication**: JWT-based user authentication
- **Real-time Updates**: Dynamic data fetching and state management

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL Server
- npm or yarn

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 2. Database Setup

1. Ensure MySQL is running on your system
2. Update database credentials in `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=foodflow_admin
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 3. Start the Application

**Start Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Start Frontend (Terminal 2):**
```bash
npm start
```

### 4. Initialize Database

When you first open the application, you'll see a database initialization screen. Click "Initialize Database" to:
- Create all necessary tables
- Insert sample data
- Set up admin users

**Default Admin Login:**
- Email: `john.smith@foodflow.com`
- Password: `admin123`

## 📊 Database Structure

### Tables Overview

#### 1. **categories**
```sql
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. **menu_items**
```sql
CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_id INT,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

#### 3. **customers**
```sql
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  whatsapp_number VARCHAR(20) UNIQUE,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 4. **orders**
```sql
CREATE TABLE orders (
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
);
```

#### 5. **order_items**
```sql
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);
```

#### 6. **users**
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'superadmin') DEFAULT 'admin',
  status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🎯 Sample Data

### Categories (8 items)
- Pizza, Salads, Burgers, Desserts, Main Course, Pasta, Appetizers, Beverages

### Menu Items (12 items)
- Classic Margherita Pizza ($12.99)
- Grilled Chicken Caesar Salad ($14.50)
- Beef Burger Deluxe ($16.99)
- Chocolate Lava Cake ($8.99)
- Fish and Chips ($18.50)
- Vegetarian Pasta ($13.99)
- BBQ Chicken Wings ($11.99)
- Greek Salad ($10.99)
- Pepperoni Pizza ($15.99)
- Chicken Alfredo ($17.50)
- Coca Cola ($2.99)
- Fresh Orange Juice ($4.50)

### Customers (8 profiles)
- Complete customer profiles with WhatsApp numbers and emails

### Orders (8 sample orders)
- Various order statuses (paid, unpaid, processing)
- Different table numbers and payment methods
- Realistic order totals and timestamps

### Admin Users (5 users)
- 2 Superadmins, 3 Admins
- Different status levels (active, inactive, pending)
- Secure password hashing with bcrypt

## 🔧 API Endpoints

### Dashboard
- `GET /api/dashboard/metrics` - Daily metrics and KPIs
- `GET /api/dashboard/recent-orders` - Latest 10 orders
- `GET /api/dashboard/payment-summary` - Payment breakdown by method

### Menu Management
- `GET /api/menu-items` - All menu items with categories
- `GET /api/categories` - All categories with item counts
- `POST /api/menu-items` - Create new menu item
- `PUT /api/menu-items/:id` - Update menu item
- `DELETE /api/menu-items/:id` - Delete menu item

### Order Management
- `GET /api/orders` - All orders with filtering
- `GET /api/orders/stats` - Order statistics
- `PUT /api/orders/:id/status` - Update order status

### User Management
- `GET /api/users` - All admin users
- `POST /api/users` - Create new admin user
- `PUT /api/users/:id` - Update user details
- `DELETE /api/users/:id` - Delete user

### System
- `GET /api/health` - Backend health check
- `POST /api/init-database` - Initialize database and tables

## 🎨 Features

### ✅ Completed Features
- **Dynamic Dashboard**: Real-time metrics, recent orders, payment summaries
- **Menu Management**: Full CRUD operations with categories and filtering
- **Order Management**: Order tracking, status updates, filtering and search
- **User Management**: Admin user roles and permissions
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Error Handling**: Comprehensive error states and fallbacks
- **Loading States**: Smooth loading indicators throughout the app
- **Database Integration**: Complete MySQL integration with relationships

### 🔄 Dynamic Data Flow
1. **Frontend** makes API requests to backend
2. **Backend** processes requests and queries MySQL
3. **Real-time updates** reflect changes immediately
4. **Error handling** provides fallbacks and user feedback
5. **Loading states** ensure smooth user experience

## 🛠️ Development

### Running in Development Mode

**Backend with auto-reload:**
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

**Frontend with hot-reload:**
```bash
npm start  # Vite dev server with HMR
```

### Manual Database Operations

**Initialize database manually:**
```bash
cd backend
node init-database.js
```

**Reset database (if needed):**
```sql
DROP DATABASE foodflow_admin;
```
Then run the initialization again.

## 📱 Responsive Design

- **Mobile**: Optimized card layouts and touch-friendly interfaces
- **Tablet**: Adaptive grid systems and collapsible sidebars
- **Desktop**: Full table views with advanced filtering and sorting

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive data validation
- **SQL Injection Protection**: Parameterized queries
- **Role-based Access**: Admin and SuperAdmin permissions

## 🚀 Production Deployment

1. Set production environment variables
2. Build the frontend: `npm run build`
3. Configure MySQL for production
4. Set up process manager (PM2)
5. Configure reverse proxy (Nginx)
6. Enable HTTPS and security headers

## 🆘 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MySQL is running
- Verify database credentials in `.env`
- Ensure port 5000 is available

**Database connection fails:**
- Verify MySQL user permissions
- Check firewall settings
- Confirm database exists

**Frontend shows initialization screen:**
- Ensure backend is running on port 5000
- Check network connectivity
- Try refreshing the browser

### Support

For technical issues or questions, please refer to the error messages in the application or check the browser console for detailed error information.
