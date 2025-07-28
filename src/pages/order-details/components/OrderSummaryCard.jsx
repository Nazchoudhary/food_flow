import React from 'react';

const OrderSummaryCard = ({ order }) => {
  const subtotal = order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const taxRate = 0.08; // 8% tax
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Order Summary</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span className="font-medium text-foreground">${taxAmount.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-border pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-foreground">Total</span>
            <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Payment Status</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            order.paymentStatus === 'paid' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
          }`}>
            {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;