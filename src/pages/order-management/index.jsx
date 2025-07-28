import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import OrderFilters from './components/OrderFilters';
import OrderStats from './components/OrderStats';
import OrderTable from './components/OrderTable';
import OrderPagination from './components/OrderPagination';

import Button from '../../components/ui/Button';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'today',
    tableNumber: 'all',
    searchQuery: ''
  });

  // Mock data for orders
  const mockOrders = [
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
    },
    {
      id: 'ORD-2025-005',
      timestamp: new Date('2025-01-11T17:00:00'),
      tableNumber: 'Table 4',
      customerName: 'David Brown',
      whatsappNumber: '+1-555-0127',
      itemsSummary: 'Grilled Salmon x1, Rice Pilaf x1, White Wine x1',
      totalAmount: 38.25,
      status: 'unpaid'
    },
    {
      id: 'ORD-2025-006',
      timestamp: new Date('2025-01-11T16:45:00'),
      tableNumber: 'Table 6',
      customerName: 'Lisa Anderson',
      whatsappNumber: '+1-555-0128',
      itemsSummary: 'Chicken Tacos x3, Guacamole x1, Corona x2',
      totalAmount: 41.50,
      status: 'paid'
    },
    {
      id: 'ORD-2025-007',
      timestamp: new Date('2025-01-11T16:30:00'),
      tableNumber: 'Table 7',
      customerName: 'Robert Taylor',
      whatsappNumber: '+1-555-0129',
      itemsSummary: 'Steak Dinner x1, Mashed Potatoes x1, Red Wine x1',
      totalAmount: 52.75,
      status: 'processing'
    },
    {
      id: 'ORD-2025-008',
      timestamp: new Date('2025-01-11T16:15:00'),
      tableNumber: 'Table 8',
      customerName: 'Jennifer Martinez',
      whatsappNumber: '+1-555-0130',
      itemsSummary: 'Pasta Primavera x1, Breadsticks x1, Lemonade x1',
      totalAmount: 26.40,
      status: 'paid'
    }
  ];

  // Mock stats data
  const mockStats = {
    totalOrders: 8,
    paidOrders: 4,
    unpaidOrders: 2,
    totalRevenue: 287.05,
    totalOrdersChange: 12,
    paidOrdersChange: 8,
    unpaidOrdersChange: -5,
    revenueChange: 15
  };

  useEffect(() => {
    // Simulate API call
    const loadOrders = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    };

    loadOrders();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = orders;

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Table filter
    if (filters.tableNumber !== 'all') {
      filtered = filtered.filter(order => 
        order.tableNumber.toLowerCase().includes(filters.tableNumber.toLowerCase())
      );
    }

    // Search filter
    if (filters.searchQuery) {
      filtered = filtered.filter(order =>
        order.customerName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        order.whatsappNumber.includes(filters.searchQuery)
      );
    }

    // Date range filter (simplified for demo)
    if (filters.dateRange === 'today') {
      const today = new Date();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.timestamp);
        return orderDate.toDateString() === today.toDateString();
      });
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, orders]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleOrderAction = async (action, orderId) => {
    console.log(`Action: ${action}, Order ID: ${orderId}`);
    
    switch (action) {
      case 'mark-paid':
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: 'paid' } : order
          )
        );
        break;
      case 'send-bill':
        // Simulate sending bill via WhatsApp
        alert(`Bill sent to customer for order ${orderId}`);
        break;
      case 'view-details':
        // Navigate to order details page
        window.location.href = `/order-details?id=${orderId}`;
        break;
      case 'generate-bill':
        // Navigate to bill generation page
        window.location.href = `/bill-generation?orderId=${orderId}`;
        break;
      case 'cancel-order':
        if (window.confirm('Are you sure you want to cancel this order?')) {
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === orderId ? { ...order, status: 'cancelled' } : order
            )
          );
        }
        break;
      case 'bulk-mark-paid':
        setOrders(prevOrders =>
          prevOrders.map(order =>
            orderId.includes(order.id) ? { ...order, status: 'paid' } : order
          )
        );
        break;
      case 'bulk-send-bill':
        alert(`Bills sent for ${orderId.length} orders`);
        break;
      default:
        console.log(`Unhandled action: ${action}`);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-0 md:ml-60 pt-16 transition-all duration-300">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <Breadcrumb />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Order Management</h1>
                  <p className="text-muted-foreground">
                    Manage and track all restaurant orders from WhatsApp integration
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    iconName="RefreshCw"
                    iconPosition="left"
                    onClick={() => window.location.reload()}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="default"
                    iconName="Download"
                    iconPosition="left"
                    onClick={() => alert('Export functionality coming soon')}
                  >
                    Export Orders
                  </Button>
                </div>
              </div>
            </div>

            {/* Order Statistics */}
            <OrderStats stats={mockStats} />

            {/* Filters */}
            <OrderFilters
              onFiltersChange={handleFiltersChange}
              totalOrders={orders.length}
              filteredOrders={filteredOrders.length}
            />

            {/* Orders Table */}
            <div className="mb-6">
              <OrderTable
                orders={paginatedOrders}
                onOrderAction={handleOrderAction}
                loading={loading}
              />
            </div>

            {/* Pagination */}
            {filteredOrders.length > 0 && (
              <OrderPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredOrders.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderManagement;