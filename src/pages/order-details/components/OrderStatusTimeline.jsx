import React from 'react';
import Icon from '../../../components/AppIcon';

const OrderStatusTimeline = ({ order }) => {
  const statusHistory = [
    {
      status: 'Order Received',
      timestamp: order.timestamp,
      icon: 'ShoppingCart',
      color: 'bg-primary',
      completed: true
    },
    {
      status: 'Order Confirmed',
      timestamp: order.confirmedAt || order.timestamp,
      icon: 'CheckCircle',
      color: 'bg-success',
      completed: true
    },
    {
      status: 'Bill Generated',
      timestamp: order.billGeneratedAt,
      icon: 'FileText',
      color: 'bg-accent',
      completed: !!order.billGeneratedAt
    },
    {
      status: 'Payment Received',
      timestamp: order.paidAt,
      icon: 'CreditCard',
      color: 'bg-success',
      completed: order.paymentStatus === 'paid'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Order Timeline</h3>
      
      <div className="space-y-4">
        {statusHistory.map((item, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              item.completed ? item.color : 'bg-muted'
            }`}>
              <Icon 
                name={item.icon} 
                size={20} 
                color={item.completed ? 'white' : 'currentColor'} 
                className={!item.completed ? 'text-muted-foreground' : ''}
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className={`font-medium ${
                  item.completed ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {item.status}
                </h4>
                {item.completed && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                )}
              </div>
              
              {!item.completed && index === statusHistory.findIndex(s => !s.completed) && (
                <p className="text-sm text-muted-foreground mt-1">Pending</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;