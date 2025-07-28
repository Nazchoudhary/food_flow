import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName, isMultiple = false, count = 1 }) => {
  if (!isOpen) return null;

  const title = isMultiple 
    ? `Delete ${count} Menu Items` 
    : 'Delete Menu Item';
    
  const message = isMultiple
    ? `Are you sure you want to delete ${count} selected menu items? This action cannot be undone.`
    : `Are you sure you want to delete "${itemName}"? This action cannot be undone.`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1400] p-4">
      <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
              <Icon name="AlertTriangle" size={24} className="text-error" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">This action is permanent</p>
            </div>
          </div>

          <p className="text-sm text-foreground mb-6">
            {message}
          </p>

          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              iconName="Trash2"
              iconPosition="left"
            >
              {isMultiple ? `Delete ${count} Items` : 'Delete Item'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;