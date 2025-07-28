import React from 'react';
import Icon from '../../../components/AppIcon';

const OrderStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: 'ClipboardList',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: stats.totalOrdersChange,
      changeType: stats.totalOrdersChange >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Paid Orders',
      value: stats.paidOrders,
      icon: 'CreditCard',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: stats.paidOrdersChange,
      changeType: stats.paidOrdersChange >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Unpaid Orders',
      value: stats.unpaidOrders,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: stats.unpaidOrdersChange,
      changeType: stats.unpaidOrdersChange >= 0 ? 'negative' : 'positive'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: 'DollarSign',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: stats.revenueChange,
      changeType: stats.revenueChange >= 0 ? 'positive' : 'negative'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat) => (
        <div key={stat.title} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={stat.icon} size={24} className={stat.color} />
            </div>
            <div className="flex items-center space-x-1">
              <Icon 
                name={stat.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className={stat.changeType === 'positive' ? 'text-success' : 'text-error'} 
              />
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-success' : 'text-error'
              }`}>
                {Math.abs(stat.change)}%
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStats;