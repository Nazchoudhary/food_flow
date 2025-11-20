// Mock data for demo mode when backend is not available

export const mockDashboardMetrics = {
  todaysOrders: {
    value: 47,
    change: "+12%",
    changeType: "positive",
    description: "vs yesterday"
  },
  pendingOrders: {
    value: 8,
    change: "-3",
    changeType: "positive", 
    description: "awaiting preparation"
  },
  totalRevenue: {
    value: "$2,847.50",
    change: "+18%",
    changeType: "positive",
    description: "today's earnings"
  },
  averageOrder: {
    value: "$60.57",
    change: "+5%",
    changeType: "positive",
    description: "per order value"
  }
};

export const mockRecentOrders = [
  {
    id: "ORD-2025-001",
    tableNumber: "T-05",
    customerName: "Sarah Johnson",
    whatsappNumber: "+1-555-0123",
    itemsCount: 3,
    topItems: "Burger, Fries, Coke",
    total: 28.50,
    status: "paid",
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: "ORD-2025-002",
    tableNumber: "T-12",
    customerName: "Mike Rodriguez",
    whatsappNumber: "+1-555-0124",
    itemsCount: 5,
    topItems: "Pizza, Salad, Wine",
    total: 67.25,
    status: "unpaid",
    timestamp: new Date(Date.now() - 600000)
  },
  {
    id: "ORD-2025-003",
    tableNumber: "T-08",
    customerName: "Emily Chen",
    whatsappNumber: "+1-555-0125",
    itemsCount: 2,
    topItems: "Pasta, Garlic Bread",
    total: 34.75,
    status: "processing",
    timestamp: new Date(Date.now() - 900000)
  },
  {
    id: "ORD-2025-004",
    tableNumber: "T-03",
    customerName: "David Wilson",
    whatsappNumber: "+1-555-0126",
    itemsCount: 4,
    topItems: "Steak, Potatoes, Salad",
    total: 89.50,
    status: "paid",
    timestamp: new Date(Date.now() - 1200000)
  },
  {
    id: "ORD-2025-005",
    tableNumber: "T-15",
    customerName: "Lisa Anderson",
    whatsappNumber: "+1-555-0127",
    itemsCount: 1,
    topItems: "Caesar Salad",
    total: 16.25,
    status: "unpaid",
    timestamp: new Date(Date.now() - 1500000)
  }
];

export const mockPaymentData = {
  total: 2847.50,
  cash: 1245.75,
  card: 1156.25,
  digital: 445.50,
  pending: 387.75
};

export const mockMenuItems = [
  {
    id: "1",
    name: "Classic Margherita Pizza",
    category: "Pizza",
    price: 12.99,
    description: "Fresh tomato sauce, mozzarella cheese, and basil leaves on a crispy crust",
    status: "active"
  },
  {
    id: "2", 
    name: "Grilled Chicken Caesar Salad",
    category: "Salads",
    price: 14.50,
    description: "Crisp romaine lettuce, grilled chicken, parmesan cheese, and caesar dressing",
    status: "active"
  },
  {
    id: "3",
    name: "Beef Burger Deluxe",
    category: "Burgers",
    price: 16.99,
    description: "Juicy beef patty with lettuce, tomato, cheese, and special sauce",
    status: "active"
  },
  {
    id: "4",
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 8.99,
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    status: "active"
  },
  {
    id: "5",
    name: "Fish and Chips",
    category: "Main Course",
    price: 18.50,
    description: "Beer-battered fish with crispy fries and tartar sauce",
    status: "inactive"
  },
  {
    id: "6",
    name: "Vegetarian Pasta",
    category: "Pasta",
    price: 13.99,
    description: "Penne pasta with seasonal vegetables in marinara sauce",
    status: "active"
  },
  {
    id: "7",
    name: "BBQ Chicken Wings",
    category: "Appetizers",
    price: 11.99,
    description: "Crispy chicken wings tossed in tangy BBQ sauce",
    status: "active"
  },
  {
    id: "8",
    name: "Greek Salad",
    category: "Salads",
    price: 10.99,
    description: "Mixed greens, olives, feta cheese, and Greek dressing",
    status: "inactive"
  }
];

export const mockCategories = [
  { id: "pizza", name: "Pizza", itemCount: 1 },
  { id: "salads", name: "Salads", itemCount: 2 },
  { id: "burgers", name: "Burgers", itemCount: 1 },
  { id: "desserts", name: "Desserts", itemCount: 1 },
  { id: "main-course", name: "Main Course", itemCount: 1 },
  { id: "pasta", name: "Pasta", itemCount: 1 },
  { id: "appetizers", name: "Appetizers", itemCount: 1 }
];

export const mockOrders = [
  {
    id: 'ORD-2025-001',
    timestamp: new Date('2025-01-11T18:30:00'),
    tableNumber: 'Table 3',
    customerName: 'John Smith',
    whatsappNumber: '+1-555-0123',
    itemsSummary: 'Margherita Pizza x2, Caesar Salad x1, Coca Cola x2',
    totalAmount: 45.50,
    status: 'unpaid'
  },
  {
    id: 'ORD-2025-002',
    timestamp: new Date('2025-01-11T18:15:00'),
    tableNumber: 'Table 1',
    customerName: 'Sarah Johnson',
    whatsappNumber: '+1-555-0124',
    itemsSummary: 'Chicken Alfredo x1, Garlic Bread x1, Iced Tea x1',
    totalAmount: 28.75,
    status: 'paid'
  },
  {
    id: 'ORD-2025-003',
    timestamp: new Date('2025-01-11T17:45:00'),
    tableNumber: 'Table 5',
    customerName: 'Mike Davis',
    whatsappNumber: '+1-555-0125',
    itemsSummary: 'BBQ Burger x1, French Fries x1, Milkshake x1',
    totalAmount: 22.90,
    status: 'processing'
  },
  {
    id: 'ORD-2025-004',
    timestamp: new Date('2025-01-11T17:30:00'),
    tableNumber: 'Table 2',
    customerName: 'Emily Wilson',
    whatsappNumber: '+1-555-0126',
    itemsSummary: 'Vegetarian Wrap x2, Fresh Juice x2',
    totalAmount: 32.00,
    status: 'paid'
  }
];

export const mockOrderStats = {
  totalOrders: 8,
  paidOrders: 4,
  unpaidOrders: 2,
  totalRevenue: 287.05,
  totalOrdersChange: 12,
  paidOrdersChange: 8,
  unpaidOrdersChange: -5,
  revenueChange: 15
};

export const mockUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@foodflow.com",
    role: "superadmin",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
    lastLogin: "2025-01-11T14:22:00Z"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@foodflow.com",
    role: "admin",
    status: "active",
    createdAt: "2024-02-20T09:15:00Z",
    lastLogin: "2025-01-11T11:45:00Z"
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike.davis@foodflow.com",
    role: "admin",
    status: "inactive",
    createdAt: "2024-03-10T16:20:00Z",
    lastLogin: "2025-01-09T08:30:00Z"
  },
  {
    id: 4,
    name: "Emily Wilson",
    email: "emily.wilson@foodflow.com",
    role: "admin",
    status: "pending",
    createdAt: "2025-01-10T12:00:00Z",
    lastLogin: null
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@foodflow.com",
    role: "superadmin",
    status: "active",
    createdAt: "2024-01-05T08:45:00Z",
    lastLogin: "2025-01-10T16:20:00Z"
  }
];

export const mockNavigation = [
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
];
