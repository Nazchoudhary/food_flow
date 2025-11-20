import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricCard from './components/MetricCard';
import RecentOrdersTable from './components/RecentOrdersTable';
import QuickActionsWidget from './components/QuickActionsWidget';
import NotificationToast from './components/NotificationToast';
import PaymentSummaryWidget from './components/PaymentSummaryWidget';
import { dashboardAPI } from '../../utils/api';
import { navigate } from '../../utils/navigation';

const DashboardOverview = ({ pageData }) => {
  const [notifications, setNotifications] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all dashboard data in parallel
        const [metricsResponse, ordersResponse, paymentsResponse] = await Promise.all([
          dashboardAPI.getMetrics(),
          dashboardAPI.getRecentOrders(),
          dashboardAPI.getPaymentSummary()
        ]);

        // Format metrics for display
        const formattedMetrics = [
          {
            title: "Today's Orders",
            value: metricsResponse.todaysOrders.value.toString(),
            change: metricsResponse.todaysOrders.change,
            changeType: metricsResponse.todaysOrders.changeType,
            icon: "ShoppingBag",
            iconColor: "bg-primary",
            description: metricsResponse.todaysOrders.description
          },
          {
            title: "Pending Orders",
            value: metricsResponse.pendingOrders.value.toString(),
            change: metricsResponse.pendingOrders.change,
            changeType: metricsResponse.pendingOrders.changeType,
            icon: "Clock",
            iconColor: "bg-warning",
            description: metricsResponse.pendingOrders.description
          },
          {
            title: "Total Revenue",
            value: metricsResponse.totalRevenue.value,
            change: metricsResponse.totalRevenue.change,
            changeType: metricsResponse.totalRevenue.changeType,
            icon: "DollarSign",
            iconColor: "bg-success",
            description: metricsResponse.totalRevenue.description
          },
          {
            title: "Average Order",
            value: metricsResponse.averageOrder.value,
            change: metricsResponse.averageOrder.change,
            changeType: metricsResponse.averageOrder.changeType,
            icon: "TrendingUp",
            iconColor: "bg-accent",
            description: metricsResponse.averageOrder.description
          }
        ];

        setDashboardMetrics(formattedMetrics);
        setRecentOrders(ordersResponse);
        setPaymentData(paymentsResponse);

        // Mock notifications (can be made dynamic later)
        const mockNotifications = [
          {
            id: 1,
            type: "new-order",
            title: "New Order Received",
            message: "Order #ORD-2025-006 from Table T-09",
            timestamp: new Date(Date.now() - 120000),
            orderId: "ORD-2025-006"
          },
          {
            id: 2,
            type: "payment",
            title: "Payment Confirmed",
            message: "Payment of $67.25 received for Order #ORD-2025-002",
            timestamp: new Date(Date.now() - 300000),
            orderId: "ORD-2025-002"
          }
        ];

        // Simulate real-time notifications
        setTimeout(() => {
          setNotifications(mockNotifications);
        }, 2000);

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
        
        // Fallback to mock data if API fails
        setDashboardMetrics([
          {
            title: "Today's Orders",
            value: "0",
            change: "0%",
            changeType: "neutral",
            icon: "ShoppingBag",
            iconColor: "bg-primary",
            description: "vs yesterday"
          },
          {
            title: "Pending Orders",
            value: "0",
            change: "0",
            changeType: "neutral",
            icon: "Clock",
            iconColor: "bg-warning",
            description: "awaiting preparation"
          },
          {
            title: "Total Revenue",
            value: "$0.00",
            change: "0%",
            changeType: "neutral",
            icon: "DollarSign",
            iconColor: "bg-success",
            description: "today's earnings"
          },
          {
            title: "Average Order",
            value: "$0.00",
            change: "0%",
            changeType: "neutral",
            icon: "TrendingUp",
            iconColor: "bg-accent",
            description: "per order value"
          }
        ]);
        setRecentOrders([]);
        setPaymentData({ total: 0, cash: 0, card: 0, digital: 0, pending: 0 });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleViewOrderDetails = (orderId) => {
    navigate(`/order-details?id=${orderId}`);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      // Update status via API (to be implemented)
      console.log(`Updating order ${orderId} to status: ${newStatus}`);
      
      // Update local state optimistically
      setRecentOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleAddMenuItem = () => {
    navigate('/menu-management');
  };

  const handleViewPayments = () => {
    navigate('/bill-generation');
  };

  const handleGenerateBill = () => {
    navigate('/bill-generation');
  };

  const handleDismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleViewOrderFromNotification = (orderId) => {
    navigate(`/order-details?id=${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="ml-0 md:ml-60 pt-16 transition-all duration-300">
          <div className="p-6 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard data...</p>
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
          <Breadcrumb breadcrumb={pageData?.breadcrumb} />
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}
          
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening at your restaurant today.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardMetrics.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                changeType={metric.changeType}
                icon={metric.icon}
                iconColor={metric.iconColor}
                description={metric.description}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Recent Orders Table - Takes up 3 columns */}
            <div className="xl:col-span-3">
              <RecentOrdersTable
                orders={recentOrders}
                onViewDetails={handleViewOrderDetails}
                onUpdateStatus={handleUpdateOrderStatus}
              />
            </div>

            {/* Right Sidebar Widgets - Takes up 1 column */}
            <div className="xl:col-span-1 space-y-6">
              <QuickActionsWidget
                onAddMenuItem={handleAddMenuItem}
                onViewPayments={handleViewPayments}
                onGenerateBill={handleGenerateBill}
              />
              
              {paymentData && (
                <PaymentSummaryWidget paymentData={paymentData} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Notification Toasts */}
      <NotificationToast
        notifications={notifications}
        onDismiss={handleDismissNotification}
        onViewOrder={handleViewOrderFromNotification}
      />
    </div>
  );
};

export default DashboardOverview;
