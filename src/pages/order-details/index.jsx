import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import CustomerDetailsCard from './components/CustomerDetailsCard';
import OrderItemsTable from './components/OrderItemsTable';
import OrderSummaryCard from './components/OrderSummaryCard';
import OrderActionsCard from './components/OrderActionsCard';
import OrderNotesCard from './components/OrderNotesCard';
import OrderStatusTimeline from './components/OrderStatusTimeline';

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock order data
  const mockOrder = {
    id: "ORD-2025-001",
    customerName: "John Smith",
    whatsappNumber: "+1 (555) 123-4567",
    tableNumber: 5,
    timestamp: new Date('2025-01-11T18:30:00'),
    lastUpdated: new Date('2025-01-11T18:45:00'),
    paymentStatus: "pending",
    confirmedAt: new Date('2025-01-11T18:32:00'),
    billGeneratedAt: null,
    paidAt: null,
    items: [
      {
        id: 1,
        name: "Margherita Pizza",
        category: "Pizza",
        quantity: 2,
        price: 18.99
      },
      {
        id: 2,
        name: "Caesar Salad",
        category: "Salads",
        quantity: 1,
        price: 12.50
      },
      {
        id: 3,
        name: "Garlic Bread",
        category: "Appetizers",
        quantity: 1,
        price: 8.99
      },
      {
        id: 4,
        name: "Coca Cola",
        category: "Beverages",
        quantity: 3,
        price: 3.50
      }
    ],
    notes: [
      {
        id: 1,
        content: "Customer requested extra cheese on pizza",
        author: "Admin User",
        timestamp: new Date('2025-01-11T18:35:00')
      },
      {
        id: 2,
        content: "Table 5 is ready for service",
        author: "Kitchen Staff",
        timestamp: new Date('2025-01-11T18:40:00')
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrder(mockOrder);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  const handleGenerateBill = async (orderId) => {
    try {
      // Simulate bill generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedOrder = {
        ...order,
        billGeneratedAt: new Date(),
        lastUpdated: new Date()
      };
      setOrder(updatedOrder);
      
      // Show success message
      alert('Bill generated successfully!');
    } catch (error) {
      alert('Failed to generate bill. Please try again.');
    }
  };

  const handleSendToWhatsApp = async (orderId) => {
    try {
      // Simulate WhatsApp API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedOrder = {
        ...order,
        lastUpdated: new Date()
      };
      setOrder(updatedOrder);
      
      // Show success message
      alert('Bill sent to WhatsApp successfully!');
    } catch (error) {
      alert('Failed to send bill to WhatsApp. Please try again.');
    }
  };

  const handleMarkAsPaid = async (orderId) => {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedOrder = {
        ...order,
        paymentStatus: 'paid',
        paidAt: new Date(),
        lastUpdated: new Date()
      };
      setOrder(updatedOrder);
      
      // Show success message
      alert('Order marked as paid successfully!');
    } catch (error) {
      alert('Failed to update payment status. Please try again.');
    }
  };

  const handleAddNote = async (orderId, noteContent) => {
    try {
      // Simulate adding note
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newNote = {
        id: order.notes.length + 1,
        content: noteContent,
        author: "Admin User",
        timestamp: new Date()
      };
      
      const updatedOrder = {
        ...order,
        notes: [...order.notes, newNote],
        lastUpdated: new Date()
      };
      setOrder(updatedOrder);
      
      // Show success message
      alert('Note added successfully!');
    } catch (error) {
      alert('Failed to add note. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="ml-0 md:ml-60 pt-16">
          <div className="p-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading order details...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="ml-0 md:ml-60 pt-16">
          <div className="p-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Order</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
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
      
      <main className="ml-0 md:ml-60 pt-16">
        <div className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Order Details</h1>
              <p className="text-muted-foreground">
                Complete information for order #{order.id}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={() => window.history.back()}
              >
                Back to Orders
              </Button>
              
              <Button
                variant="outline"
                iconName="Printer"
                iconPosition="left"
                onClick={() => window.print()}
              >
                Print
              </Button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <CustomerDetailsCard order={order} />
              <OrderItemsTable items={order.items} />
              <OrderNotesCard order={order} onAddNote={handleAddNote} />
            </div>
            
            {/* Right Column - Sidebar Content */}
            <div className="space-y-6">
              <OrderSummaryCard order={order} />
              <OrderActionsCard
                order={order}
                onGenerateBill={handleGenerateBill}
                onSendToWhatsApp={handleSendToWhatsApp}
                onMarkAsPaid={handleMarkAsPaid}
              />
              <OrderStatusTimeline order={order} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;