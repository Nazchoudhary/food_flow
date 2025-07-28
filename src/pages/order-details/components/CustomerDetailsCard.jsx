import React from 'react';
import Icon from '../../../components/AppIcon';

const CustomerDetailsCard = ({ order }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Customer Details</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>{new Date(order.timestamp).toLocaleString()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Icon name="User" size={20} color="white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Customer Name</p>
              <p className="font-medium text-foreground">{order.customerName}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
              <Icon name="MessageCircle" size={20} color="white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">WhatsApp Contact</p>
              <p className="font-medium text-foreground">{order.whatsappNumber}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <Icon name="MapPin" size={20} color="white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Table Number</p>
              <p className="font-medium text-foreground">Table {order.tableNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="Hash" size={20} color="white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-medium text-foreground">#{order.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsCard;