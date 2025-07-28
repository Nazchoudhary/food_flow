import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  variant = 'destructive',
  isLoading = false 
}) => {
  if (!isOpen) return null;

  const getIconName = () => {
    switch (variant) {
      case 'destructive':
        return 'AlertTriangle';
      case 'warning':
        return 'AlertCircle';
      case 'success':
        return 'CheckCircle';
      default:
        return 'HelpCircle';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'destructive':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'success':
        return 'text-success';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1400] p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md shadow-modal">
        <div className="p-6">
          {/* Icon and Title */}
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${getIconColor()}`}>
              <Icon name={getIconName()} size={20} />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>

          {/* Message */}
          <p className="text-muted-foreground mb-6">{message}</p>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {cancelText}
            </Button>
            <Button 
              variant={variant} 
              onClick={onConfirm} 
              loading={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;