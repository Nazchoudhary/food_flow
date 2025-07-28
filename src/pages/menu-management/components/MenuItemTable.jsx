import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MenuItemTable = ({ 
  items, 
  onEdit, 
  onDelete, 
  onStatusToggle, 
  selectedItems, 
  onItemSelect, 
  onSelectAll,
  sortConfig,
  onSort 
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleSort = (key) => {
    onSort(key);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

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
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedItems.length === items.length && items.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
              </th>
              
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Item Name</span>
                  <Icon name={getSortIcon('name')} size={16} />
                </button>
              </th>
              
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Category</span>
                  <Icon name={getSortIcon('category')} size={16} />
                </button>
              </th>
              
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('price')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Price</span>
                  <Icon name={getSortIcon('price')} size={16} />
                </button>
              </th>
              
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Status</span>
                  <Icon name={getSortIcon('status')} size={16} />
                </button>
              </th>
              
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr
                key={item.id}
                className={`hover:bg-muted/30 transition-colors ${
                  selectedItems.includes(item.id) ? 'bg-primary/5' : ''
                }`}
                onMouseEnter={() => setHoveredRow(item.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => onItemSelect(item.id)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                </td>
                
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Icon name="UtensilsCrossed" size={20} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground truncate max-w-xs">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                    {item.category}
                  </span>
                </td>
                
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-foreground">
                    {formatPrice(item.price)}
                  </span>
                </td>
                
                <td className="px-4 py-3">
                  {getStatusBadge(item.status)}
                </td>
                
                <td className="px-4 py-3">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {items.length === 0 && (
        <div className="text-center py-12">
          <Icon name="UtensilsCrossed" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No menu items found</h3>
          <p className="text-muted-foreground">Add your first menu item to get started.</p>
        </div>
      )}
    </div>
  );
};

export default MenuItemTable;