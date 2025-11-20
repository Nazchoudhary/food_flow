import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import OrderFilters from './components/OrderFilters';
import OrderStats from './components/OrderStats';
import OrderTable from './components/OrderTable';
import OrderPagination from './components/OrderPagination';
import Button from '../../components/ui/Button';
import { ordersAPI } from '../../utils/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'today',
    tableNumber: 'all',
    searchQuery: ''
  });
  const [error, setError] = useState(null);

  // Load orders data
  useEffect(() => {
    const loadOrdersData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [ordersResponse, statsResponse] = await Promise.all([
          ordersAPI.getOrders(filters),
          ordersAPI.getOrderStats()
        ]);

        setOrders(ordersResponse);
        setFilteredOrders(ordersResponse);
        setStats(statsResponse);
      } catch (error) {
        console.error('Failed to load orders data:', error);
        setError('Failed to load orders data. Please check your connection and try again.');
        
        // Fallback to empty data if API fails
        setOrders([]);
        setFilteredOrders([]);
        setStats({
          totalOrders: 0,
          paidOrders: 0,
          unpaidOrders: 0,
          totalRevenue: 0,
          totalOrdersChange: 0,
          paidOrdersChange: 0,
          unpaidOrdersChange: 0,
          revenueChange: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrdersData();
  }, [filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleOrderAction = async (action, orderId) => {
    console.log(`Action: ${action}, Order ID: ${orderId}`);
    
    try {
      switch (action) {
        case 'mark-paid':
          await ordersAPI.updateOrderStatus(orderId, 'paid');
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === orderId ? { ...order, status: 'paid' } : order
            )
          );
          setFilteredOrders(prevOrders =>
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
            await ordersAPI.updateOrderStatus(orderId, 'cancelled');
            setOrders(prevOrders =>
              prevOrders.map(order =>
                order.id === orderId ? { ...order, status: 'cancelled' } : order
              )
            );
            setFilteredOrders(prevOrders =>
              prevOrders.map(order =>
                order.id === orderId ? { ...order, status: 'cancelled' } : order
              )
            );
          }
          break;
        
        case 'bulk-mark-paid':
          await Promise.all(
            orderId.map(id => ordersAPI.updateOrderStatus(id, 'paid'))
          );
          setOrders(prevOrders =>
            prevOrders.map(order =>
              orderId.includes(order.id) ? { ...order, status: 'paid' } : order
            )
          );
          setFilteredOrders(prevOrders =>
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
    } catch (error) {
      console.error('Failed to perform order action:', error);
      setError('Failed to perform order action. Please try again.');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="ml-0 md:ml-60 pt-16 transition-all duration-300">
          <div className="p-6 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading orders data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
              
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive text-sm">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="text-destructive hover:text-destructive/80 text-sm underline mt-1"
                  >
                    Dismiss
                  </button>
                </div>
              )}
              
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
                    onClick={handleRefresh}
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
            <OrderStats stats={stats} />

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
                loading={false}
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
