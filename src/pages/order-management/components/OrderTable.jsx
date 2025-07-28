import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import OrderStatusBadge from './OrderStatusBadge';
import OrderActions from './OrderActions';

const OrderTable = ({ orders, onOrderAction, loading }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [selectedOrders, setSelectedOrders] = useState([]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(orders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={16} className="text-foreground" />
      : <Icon name="ArrowDown" size={16} className="text-foreground" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateItems = (items, maxLength = 50) => {
    if (items.length <= maxLength) return items;
    return items.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg">
        <div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg">
        <div className="p-8 text-center">
          <Icon name="ClipboardList" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Orders Found</h3>
          <p className="text-muted-foreground">No orders match your current filters. Try adjusting your search criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedOrders.length > 0 && (
        <div className="bg-primary/5 border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">
              {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOrderAction('bulk-mark-paid', selectedOrders)}
                iconName="CreditCard"
                iconPosition="left"
              >
                Mark as Paid
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOrderAction('bulk-send-bill', selectedOrders)}
                iconName="Send"
                iconPosition="left"
              >
                Send Bills
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === orders.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('id')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Order ID</span>
                  {getSortIcon('id')}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('timestamp')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Time</span>
                  {getSortIcon('timestamp')}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('tableNumber')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Table</span>
                  {getSortIcon('tableNumber')}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-foreground">Customer</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-foreground">Items</span>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('totalAmount')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Total</span>
                  {getSortIcon('totalAmount')}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-foreground">Status</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-foreground">#{order.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">{formatTime(order.timestamp)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{order.tableNumber}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.whatsappNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground" title={order.itemsSummary}>
                    {truncateItems(order.itemsSummary)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4">
                  <OrderActions order={order} onAction={onOrderAction} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;