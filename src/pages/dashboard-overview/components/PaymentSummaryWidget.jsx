import React from 'react';
import Icon from '../../../components/AppIcon';

const PaymentSummaryWidget = ({ paymentData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const paymentMethods = [
    {
      method: 'Cash',
      amount: paymentData.cash,
      icon: 'Banknote',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      method: 'Card',
      amount: paymentData.card,
      icon: 'CreditCard',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      method: 'Digital',
      amount: paymentData.digital,
      icon: 'Smartphone',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Payment Summary</h2>
          <div className="text-sm text-muted-foreground">Today</div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(paymentData.total)}
          </div>
          <div className="text-sm text-muted-foreground">Total Revenue</div>
        </div>
        
        <div className="space-y-4">
          {paymentMethods.map((payment) => (
            <div key={payment.method} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${payment.bgColor}`}>
                  <Icon name={payment.icon} size={16} className={payment.color} />
                </div>
                <span className="text-sm font-medium text-foreground">{payment.method}</span>
              </div>
              <div className="text-sm font-medium text-foreground">
                {formatCurrency(payment.amount)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pending Payments</span>
            <span className="font-medium text-warning">
              {formatCurrency(paymentData.pending)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummaryWidget;