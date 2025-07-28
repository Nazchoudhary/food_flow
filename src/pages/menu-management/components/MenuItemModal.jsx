import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MenuItemModal = ({ isOpen, onClose, onSave, item, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || '',
        price: item.price?.toString() || '',
        description: item.description || '',
        status: item.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        category: '',
        price: '',
        description: '',
        status: 'active'
      });
    }
    setErrors({});
  }, [item, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        id: item?.id || Date.now().toString()
      };
      
      await onSave(itemData);
      onClose();
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.name,
    label: cat.name
  }));

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1300] p-4">
      <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {item ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Item Name"
            type="text"
            placeholder="Enter item name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            required
          />

          <Select
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(value) => handleInputChange('category', value)}
            placeholder="Select category"
            error={errors.category}
            required
          />

          <Input
            label="Price"
            type="number"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            error={errors.price}
            required
            min="0"
            step="0.01"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter item description"
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <Select
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(value) => handleInputChange('status', value)}
            required
          />

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName="Save"
              iconPosition="left"
            >
              {item ? 'Update Item' : 'Add Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemModal;