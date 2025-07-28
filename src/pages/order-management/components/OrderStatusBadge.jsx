import React from 'react';

const OrderStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return {
          label: 'Paid',
          className: 'bg-success/10 text-success border-success/20'
        };
      case 'unpaid':
        return {
          label: 'Unpaid',
          className: 'bg-warning/10 text-warning border-warning/20'
        };
      case 'processing':
        return {
          label: 'Processing',
          className: 'bg-primary/10 text-primary border-primary/20'
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          className: 'bg-error/10 text-error border-error/20'
        };
      case 'refunded':
        return {
          label: 'Refunded',
          className: 'bg-secondary/10 text-secondary border-secondary/20'
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-muted/10 text-muted-foreground border-muted/20'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`
      inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
      ${config.className}
    `}>
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;