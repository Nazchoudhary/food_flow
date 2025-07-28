import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const BillHistory = ({ billHistory, onViewBill, onResendBill }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('today');

  const filterBillsByDate = (bills) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return bills.filter(bill => {
      const billDate = new Date(bill.generatedAt);
      
      switch (dateFilter) {
        case 'today':
          return billDate >= today;
        case 'yesterday':
          return billDate >= yesterday && billDate < today;
        case 'week':
          return billDate >= weekAgo;
        case 'all':
        default:
          return true;
      }
    });
  };

  const filteredBills = filterBillsByDate(billHistory).filter(bill =>
    bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.tableNumber.toString().includes(searchTerm)
  );

  const getDeliveryStatusBadge = (status) => {
    const statusConfig = {
      sent: { color: 'text-success', bg: 'bg-success/10', icon: 'CheckCircle', text: 'Sent' },
      failed: { color: 'text-error', bg: 'bg-error/10', icon: 'XCircle', text: 'Failed' },
      pending: { color: 'text-warning', bg: 'bg-warning/10', icon: 'Clock', text: 'Pending' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
        <Icon name={config.icon} size={12} className="mr-1" />
        {config.text}
      </span>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Bill History</h3>
        <div className="flex items-center space-x-2">
          <Icon name="History" size={20} className="text-primary" />
          <span className="text-sm text-muted-foreground">{filteredBills.length} bills</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        <Input
          type="search"
          placeholder="Search by customer, bill number, or table..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="flex space-x-2 overflow-x-auto">
          <Button
            variant={dateFilter === 'today' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateFilter('today')}
          >
            Today
          </Button>
          <Button
            variant={dateFilter === 'yesterday' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateFilter('yesterday')}
          >
            Yesterday
          </Button>
          <Button
            variant={dateFilter === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateFilter('week')}
          >
            This Week
          </Button>
          <Button
            variant={dateFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateFilter('all')}
          >
            All Time
          </Button>
        </div>
      </div>

      {/* Bills List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredBills.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="FileText" size={48} className="mx-auto mb-2 opacity-50" />
            <p>No bills found matching your criteria</p>
          </div>
        ) : (
          filteredBills.map((bill) => (
            <div
              key={bill.id}
              className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-foreground">
                      {bill.tableNumber}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{bill.customerName}</h4>
                    <p className="text-sm text-muted-foreground">Bill #{bill.billNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getDeliveryStatusBadge(bill.deliveryStatus)}
                  <span className="font-semibold text-primary">${bill.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm mb-3">
                <div className="flex items-center space-x-4">
                  <span className="text-muted-foreground">
                    Generated: {new Date(bill.generatedAt).toLocaleString('en-US')}
                  </span>
                  {bill.sentAt && (
                    <span className="text-muted-foreground">
                      Sent: {new Date(bill.sentAt).toLocaleString('en-US')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewBill(bill)}
                    iconName="Eye"
                    iconPosition="left"
                  >
                    View
                  </Button>
                  {bill.deliveryStatus === 'failed' && (
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => onResendBill(bill)}
                      iconName="RefreshCw"
                      iconPosition="left"
                    >
                      Resend
                    </Button>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Icon name="MessageCircle" size={12} />
                  <span>{bill.whatsappNumber}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BillHistory;