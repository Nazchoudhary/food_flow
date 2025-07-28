import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationToast = ({ notifications, onDismiss, onViewOrder }) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  const handleDismiss = (notificationId) => {
    setVisibleNotifications(prev => prev.filter(n => n.id !== notificationId));
    onDismiss(notificationId);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new-order':
        return { icon: 'ShoppingBag', color: 'text-success' };
      case 'payment':
        return { icon: 'CreditCard', color: 'text-primary' };
      case 'alert':
        return { icon: 'AlertTriangle', color: 'text-warning' };
      default:
        return { icon: 'Bell', color: 'text-muted-foreground' };
    }
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-[1200] space-y-3 max-w-sm">
      {visibleNotifications.map((notification) => {
        const { icon, color } = getNotificationIcon(notification.type);
        
        return (
          <div
            key={notification.id}
            className="bg-card border border-border rounded-lg shadow-modal p-4 animate-in slide-in-from-right-full duration-300"
          >
            <div className="flex items-start space-x-3">
              <div className={`mt-0.5 ${color}`}>
                <Icon name={icon} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {notification.title}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="X"
                    onClick={() => handleDismiss(notification.id)}
                    className="ml-2 h-6 w-6 p-0"
                  />
                </div>
                
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
                
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  
                  {notification.orderId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewOrder(notification.orderId)}
                    >
                      View Order
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationToast;