import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricCard from './components/MetricCard';
import RecentOrdersTable from './components/RecentOrdersTable';
import QuickActionsWidget from './components/QuickActionsWidget';
import NotificationToast from './components/NotificationToast';
import PaymentSummaryWidget from './components/PaymentSummaryWidget';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  // Mock data for dashboard metrics
  const dashboardMetrics = [
    {
      title: "Today\'s Orders",
      value: "47",
      change: "+12%",
      changeType: "positive",
      icon: "ShoppingBag",
      iconColor: "bg-primary",
      description: "vs yesterday"
    },
    {
      title: "Pending Orders",
      value: "8",
      change: "-3",
      changeType: "positive",
      icon: "Clock",
      iconColor: "bg-warning",
      description: "awaiting preparation"
    },
    {
      title: "Total Revenue",
      value: "$2,847",
      change: "+18%",
      changeType: "positive",
      icon: "DollarSign",
      iconColor: "bg-success",
      description: "today\'s earnings"
    },
    {
      title: "Average Order",
      value: "$60.57",
      change: "+5%",
      changeType: "positive",
      icon: "TrendingUp",
      iconColor: "bg-accent",
      description: "per order value"
    }
  ];

  // Mock data for recent orders
  const recentOrders = [
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

  // Mock payment data
  const paymentData = {
    total: 2847.50,
    cash: 1245.75,
    card: 1156.25,
    digital: 445.50,
    pending: 387.75
  };

  // Mock notifications
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

  useEffect(() => {
    // Simulate real-time notifications
    const timer = setTimeout(() => {
      setNotifications(mockNotifications);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleViewOrderDetails = (orderId) => {
    navigate('/order-details', { state: { orderId } });
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    // In real app, this would make an API call
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
    navigate('/order-details', { state: { orderId } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-0 md:ml-60 pt-16 transition-all duration-300">
        <div className="p-6">
          <Breadcrumb />
          
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
              
              <PaymentSummaryWidget paymentData={paymentData} />
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