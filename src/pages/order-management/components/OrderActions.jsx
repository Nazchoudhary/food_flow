import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderActions = ({ order, onAction }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAction = (actionType) => {
    onAction(actionType, order.id);
    setIsDropdownOpen(false);
  };

  const getQuickActions = () => {
    const actions = [];
    
    if (order.status === 'unpaid') {
      actions.push({
        label: 'Mark as Paid',
        icon: 'CreditCard',
        action: 'mark-paid',
        variant: 'success'
      });
    }
    
    if (order.status !== 'cancelled') {
      actions.push({
        label: 'Send Bill',
        icon: 'Send',
        action: 'send-bill',
        variant: 'default'
      });
    }

    return actions;
  };

  const getDropdownActions = () => {
    return [
      {
        label: 'View Details',
        icon: 'Eye',
        action: 'view-details'
      },
      {
        label: 'Generate Bill',
        icon: 'Receipt',
        action: 'generate-bill'
      },
      {
        label: 'Print Receipt',
        icon: 'Printer',
        action: 'print-receipt'
      },
      {
        label: 'Contact Customer',
        icon: 'MessageCircle',
        action: 'contact-customer'
      },
      ...(order.status !== 'cancelled' ? [{
        label: 'Cancel Order',
        icon: 'X',
        action: 'cancel-order',
        variant: 'destructive'
      }] : []),
      ...(order.status === 'paid' ? [{
        label: 'Process Refund',
        icon: 'RotateCcw',
        action: 'process-refund',
        variant: 'warning'
      }] : [])
    ];
  };

  const quickActions = getQuickActions();
  const dropdownActions = getDropdownActions();

  return (
    <div className="flex items-center space-x-2">
      {/* Quick Actions */}
      {quickActions.slice(0, 2).map((action) => (
        <Button
          key={action.action}
          variant={action.variant || 'outline'}
          size="sm"
          onClick={() => handleAction(action.action)}
          iconName={action.icon}
          iconPosition="left"
          className="hidden sm:flex"
        >
          {action.label}
        </Button>
      ))}

      {/* More Actions Dropdown */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Icon name="MoreVertical" size={16} />
        </Button>

        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-modal z-20">
              <div className="p-1">
                {dropdownActions.map((action) => (
                  <button
                    key={action.action}
                    onClick={() => handleAction(action.action)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors
                      ${action.variant === 'destructive' ?'text-error hover:bg-error/10' 
                        : action.variant === 'warning' ?'text-warning hover:bg-warning/10' :'text-popover-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <Icon name={action.icon} size={16} />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderActions;