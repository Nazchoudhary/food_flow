import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const OrderSelection = ({ orders, selectedOrder, onOrderSelect, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.tableNumber.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'unpaid' && !order.billing.isPaid) ||
                         (statusFilter === 'paid' && order.billing.isPaid);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (isPaid) => {
    return isPaid ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
        <Icon name="CheckCircle" size={12} className="mr-1" />
        Paid
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
        <Icon name="Clock" size={12} className="mr-1" />
        Pending
      </span>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Select Order</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          iconName="RefreshCw"
          iconPosition="left"
        >
          Refresh
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        <Input
          type="search"
          placeholder="Search by customer name, order ID, or table..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="flex space-x-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All Orders
          </Button>
          <Button
            variant={statusFilter === 'unpaid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('unpaid')}
          >
            Unpaid
          </Button>
          <Button
            variant={statusFilter === 'paid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('paid')}
          >
            Paid
          </Button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Search" size={48} className="mx-auto mb-2 opacity-50" />
            <p>No orders found matching your criteria</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                selectedOrder?.id === order.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
              onClick={() => onOrderSelect(order)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-foreground">
                      {order.customer.tableNumber}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{order.customer.name}</h4>
                    <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                  </div>
                </div>
                {getStatusBadge(order.billing.isPaid)}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-muted-foreground">
                    {order.order.items.length} items
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(order.createdAt).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <span className="font-semibold text-primary">
                  ${order.billing.total.toFixed(2)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderSelection;