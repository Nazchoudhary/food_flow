import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import BillPreview from './components/BillPreview';
import BillCustomization from './components/BillCustomization';
import OrderSelection from './components/OrderSelection';
import BillActions from './components/BillActions';
import BillHistory from './components/BillHistory';
import Icon from '../../components/AppIcon';

const BillGeneration = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [billData, setBillData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [billSettings, setBillSettings] = useState({
    taxRate: 8.5,
    discount: 0,
    serviceCharge: 0,
    includeGST: true,
    customNote: ''
  });

  // Mock data for orders
  const mockOrders = [
    {
      id: "ORD-2025-001",
      customer: {
        name: "John Smith",
        whatsapp: "+1-555-0123",
        tableNumber: 5
      },
      order: {
        items: [
          { id: 1, name: "Margherita Pizza", price: 18.99, quantity: 2 },
          { id: 2, name: "Caesar Salad", price: 12.50, quantity: 1 },
          { id: 3, name: "Coca Cola", price: 3.99, quantity: 3 }
        ]
      },
      billing: {
        billNumber: "BILL-2025-001",
        subtotal: 51.47,
        tax: 4.37,
        discount: 0,
        serviceCharge: 0,
        total: 55.84,
        isPaid: false,
        paymentMethod: null
      },
      createdAt: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: "ORD-2025-002",
      customer: {
        name: "Sarah Johnson",
        whatsapp: "+1-555-0456",
        tableNumber: 3
      },
      order: {
        items: [
          { id: 4, name: "Chicken Burger", price: 15.99, quantity: 1 },
          { id: 5, name: "French Fries", price: 6.99, quantity: 2 },
          { id: 6, name: "Iced Tea", price: 2.99, quantity: 2 }
        ]
      },
      billing: {
        billNumber: "BILL-2025-002",
        subtotal: 35.95,
        tax: 3.06,
        discount: 5.00,
        serviceCharge: 2.00,
        total: 36.01,
        isPaid: true,
        paymentMethod: "Credit Card"
      },
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: "ORD-2025-003",
      customer: {
        name: "Mike Davis",
        whatsapp: "+1-555-0789",
        tableNumber: 8
      },
      order: {
        items: [
          { id: 7, name: "Grilled Salmon", price: 24.99, quantity: 1 },
          { id: 8, name: "Steamed Vegetables", price: 8.99, quantity: 1 },
          { id: 9, name: "White Wine", price: 12.99, quantity: 1 }
        ]
      },
      billing: {
        billNumber: "BILL-2025-003",
        subtotal: 46.97,
        tax: 3.99,
        discount: 0,
        serviceCharge: 0,
        total: 50.96,
        isPaid: false,
        paymentMethod: null
      },
      createdAt: new Date(Date.now() - 900000).toISOString()
    }
  ];

  // Mock data for bill history
  const mockBillHistory = [
    {
      id: "HIST-001",
      billNumber: "BILL-2025-001",
      customerName: "John Smith",
      tableNumber: 5,
      totalAmount: 55.84,
      generatedAt: new Date(Date.now() - 7200000).toISOString(),
      sentAt: new Date(Date.now() - 7100000).toISOString(),
      deliveryStatus: "sent",
      whatsappNumber: "+1-555-0123"
    },
    {
      id: "HIST-002",
      billNumber: "BILL-2025-002",
      customerName: "Sarah Johnson",
      tableNumber: 3,
      totalAmount: 36.01,
      generatedAt: new Date(Date.now() - 10800000).toISOString(),
      sentAt: null,
      deliveryStatus: "failed",
      whatsappNumber: "+1-555-0456"
    },
    {
      id: "HIST-003",
      billNumber: "BILL-2024-999",
      customerName: "Emily Wilson",
      tableNumber: 2,
      totalAmount: 42.75,
      generatedAt: new Date(Date.now() - 86400000).toISOString(),
      sentAt: new Date(Date.now() - 86300000).toISOString(),
      deliveryStatus: "sent",
      whatsappNumber: "+1-555-0321"
    }
  ];

  const restaurantInfo = {
    name: "FoodFlow Restaurant",
    address: "123 Main Street, Downtown\nNew York, NY 10001",
    phone: "+1-555-FOOD-123",
    gst: "GST123456789"
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    generateBillData(order, billSettings);
  };

  const generateBillData = (order, settings) => {
    if (!order) return;

    const subtotal = order.order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = (subtotal * settings.taxRate) / 100;
    const total = subtotal + tax + settings.serviceCharge - settings.discount;

    setBillData({
      restaurant: restaurantInfo,
      customer: order.customer,
      order: order.order,
      billing: {
        ...order.billing,
        subtotal,
        tax,
        taxRate: settings.taxRate,
        discount: settings.discount,
        serviceCharge: settings.serviceCharge,
        total,
        customNote: settings.customNote
      }
    });
  };

  const handleSettingsChange = (newSettings) => {
    setBillSettings(newSettings);
    if (selectedOrder) {
      generateBillData(selectedOrder, newSettings);
    }
  };

  const handleApplySettings = () => {
    if (selectedOrder) {
      generateBillData(selectedOrder, billSettings);
    }
  };

  const handleGenerateBill = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGenerating(false);
  };

  const handleCopyBill = async () => {
    if (!billData) return;
    
    const billText = generateBillText(billData);
    try {
      await navigator.clipboard.writeText(billText);
    } catch (err) {
      console.error('Failed to copy bill text:', err);
    }
  };

  const handleSendWhatsApp = async () => {
    if (!billData) return;
    
    // Simulate WhatsApp API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update order status to paid if successful
    const updatedOrders = mockOrders.map(order => 
      order.id === selectedOrder.id 
        ? { ...order, billing: { ...order.billing, isPaid: true, paymentMethod: 'WhatsApp Payment' }}
        : order
    );
  };

  const handleMarkPaid = async () => {
    if (!selectedOrder) return;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update local state
    const updatedOrder = {
      ...selectedOrder,
      billing: { ...selectedOrder.billing, isPaid: true, paymentMethod: 'Cash' }
    };
    setSelectedOrder(updatedOrder);
    generateBillData(updatedOrder, billSettings);
  };

  const handleRefreshOrders = () => {
    // Simulate refresh
    console.log('Refreshing orders...');
  };

  const handleViewBill = (bill) => {
    console.log('Viewing bill:', bill);
  };

  const handleResendBill = (bill) => {
    console.log('Resending bill:', bill);
  };

  const generateBillText = (data) => {
    if (!data) return '';
    
    const { restaurant, order, customer, billing } = data;
    
    return `
═══════════════════════════
    ${restaurant.name}
═══════════════════════════
${restaurant.address}
Phone: ${restaurant.phone}
GST: ${restaurant.gst}

Date: ${new Date().toLocaleDateString('en-US')}
Time: ${new Date().toLocaleTimeString('en-US')}
Bill No: ${billing.billNumber}
Table: ${customer.tableNumber}
Customer: ${customer.name}

═══════════════════════════
           ORDER DETAILS
═══════════════════════════

${order.items.map(item => 
  `${item.name.padEnd(20)} x${item.quantity}\n$${item.price.toFixed(2).padStart(8)} = $${(item.price * item.quantity).toFixed(2).padStart(8)}`
).join('\n')}

───────────────────────────
Subtotal:        $${billing.subtotal.toFixed(2).padStart(8)}
Tax (${billing.taxRate}%):         $${billing.tax.toFixed(2).padStart(8)}
${billing.discount > 0 ? `Discount:        -$${billing.discount.toFixed(2).padStart(7)}\n` : ''}${billing.serviceCharge > 0 ? `Service Fee:     $${billing.serviceCharge.toFixed(2).padStart(8)}\n` : ''}───────────────────────────
TOTAL:           $${billing.total.toFixed(2).padStart(8)}

═══════════════════════════
Payment Status: ${billing.isPaid ? 'PAID' : 'PENDING'}
Payment Method: ${billing.paymentMethod || 'N/A'}

${billing.customNote ? `\n${billing.customNote}\n` : ''}
Thank you for dining with us!
Visit us again soon!
═══════════════════════════`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-0 md:ml-60 pt-16 transition-all duration-300">
        <div className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Bill Generation</h1>
              <p className="text-muted-foreground mt-2">
                Create, customize, and send customer bills via WhatsApp
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Clock" size={16} />
              <span>Last updated: {new Date().toLocaleTimeString('en-US')}</span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Order Selection & Customization */}
            <div className="xl:col-span-1 space-y-6">
              <OrderSelection
                orders={mockOrders}
                selectedOrder={selectedOrder}
                onOrderSelect={handleOrderSelect}
                onRefresh={handleRefreshOrders}
              />
              
              <BillCustomization
                billSettings={billSettings}
                onSettingsChange={handleSettingsChange}
                onApplySettings={handleApplySettings}
              />
            </div>

            {/* Middle Column - Bill Preview */}
            <div className="xl:col-span-1">
              <BillPreview
                billData={billData}
                isGenerating={isGenerating}
              />
            </div>

            {/* Right Column - Actions & History */}
            <div className="xl:col-span-1 space-y-6">
              <BillActions
                billData={billData}
                onGenerateBill={handleGenerateBill}
                onCopyBill={handleCopyBill}
                onSendWhatsApp={handleSendWhatsApp}
                onMarkPaid={handleMarkPaid}
              />
              
              <BillHistory
                billHistory={mockBillHistory}
                onViewBill={handleViewBill}
                onResendBill={handleResendBill}
              />
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bills Generated</p>
                  <p className="text-2xl font-bold text-foreground">127</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="MessageCircle" size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sent via WhatsApp</p>
                  <p className="text-2xl font-bold text-foreground">98</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payment</p>
                  <p className="text-2xl font-bold text-foreground">12</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">$3,247</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BillGeneration;