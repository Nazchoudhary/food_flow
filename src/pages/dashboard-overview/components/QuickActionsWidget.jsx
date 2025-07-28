import React from 'react';
import Icon from '../../../components/AppIcon';


const QuickActionsWidget = ({ onAddMenuItem, onViewPayments, onGenerateBill }) => {
  const quickActions = [
    {
      id: 'add-menu-item',
      title: 'Add Menu Item',
      description: 'Quickly add new items to your menu',
      icon: 'Plus',
      iconColor: 'bg-success',
      action: onAddMenuItem
    },
    {
      id: 'view-payments',
      title: 'Payment Summary',
      description: 'View today\'s payment overview',
      icon: 'CreditCard',
      iconColor: 'bg-primary',
      action: onViewPayments
    },
    {
      id: 'generate-bill',
      title: 'Generate Bill',
      description: 'Create bill for pending orders',
      icon: 'Receipt',
      iconColor: 'bg-accent',
      action: onGenerateBill
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        <p className="text-sm text-muted-foreground mt-1">Frequently used operations</p>
      </div>
      
      <div className="p-6 space-y-4">
        {quickActions.map((action) => (
          <div
            key={action.id}
            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
            onClick={action.action}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.iconColor}`}>
                <Icon name={action.icon} size={20} color="white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">{action.title}</h3>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsWidget;