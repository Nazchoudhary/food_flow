import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ selectedItems, onBulkDelete, onBulkStatusChange, onClearSelection }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (selectedItems.length === 0) return null;

  const handleBulkAction = (action) => {
    switch (action) {
      case 'delete':
        onBulkDelete();
        break;
      case 'activate': onBulkStatusChange('active');
        break;
      case 'deactivate': onBulkStatusChange('inactive');
        break;
      default:
        break;
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-primary-foreground">
              {selectedItems.length}
            </span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              iconName="ChevronDown"
              iconPosition="right"
            >
              Bulk Actions
            </Button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-modal z-[100]">
                <div className="p-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    <Icon name="Eye" size={16} className="text-success" />
                    <span>Activate Items</span>
                  </button>
                  
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    <Icon name="EyeOff" size={16} className="text-warning" />
                    <span>Deactivate Items</span>
                  </button>
                  
                  <div className="border-t border-border my-2"></div>
                  
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-md transition-colors"
                  >
                    <Icon name="Trash2" size={16} />
                    <span>Delete Items</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
          >
            Clear Selection
          </Button>
        </div>
      </div>

      {/* Backdrop for dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-[50]"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default BulkActions;