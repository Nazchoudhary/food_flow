import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MenuItemCard = ({ item, onEdit, onDelete, onStatusToggle }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-success/10', text: 'text-success', label: 'Active' },
      inactive: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Inactive' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <div className={`w-1.5 h-1.5 rounded-full mr-1 ${status === 'active' ? 'bg-success' : 'bg-muted-foreground'}`}></div>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-card transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <Icon name="UtensilsCrossed" size={24} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
              {item.category}
            </span>
          </div>
        </div>
        {getStatusBadge(item.status)}
      </div>

      {item.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {item.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-foreground">
          {formatPrice(item.price)}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onStatusToggle(item.id)}
            className="h-8 w-8"
          >
            <Icon 
              name={item.status === 'active' ? 'EyeOff' : 'Eye'} 
              size={16} 
              className={item.status === 'active' ? 'text-warning' : 'text-success'}
            />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(item)}
            className="h-8 w-8"
          >
            <Icon name="Edit" size={16} className="text-primary" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item.id)}
            className="h-8 w-8"
          >
            <Icon name="Trash2" size={16} className="text-error" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;