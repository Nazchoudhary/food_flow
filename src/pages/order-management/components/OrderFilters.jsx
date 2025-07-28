import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const OrderFilters = ({ onFiltersChange, totalOrders, filteredOrders }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'today',
    tableNumber: 'all',
    searchQuery: ''
  });

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'paid', label: 'Paid' },
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'processing', label: 'Processing' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const tableOptions = [
    { value: 'all', label: 'All Tables' },
    { value: '1', label: 'Table 1' },
    { value: '2', label: 'Table 2' },
    { value: '3', label: 'Table 3' },
    { value: '4', label: 'Table 4' },
    { value: '5', label: 'Table 5' },
    { value: '6', label: 'Table 6' },
    { value: '7', label: 'Table 7' },
    { value: '8', label: 'Table 8' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      status: 'all',
      dateRange: 'today',
      tableNumber: 'all',
      searchQuery: ''
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters = filters.status !== 'all' || 
                          filters.dateRange !== 'today' || 
                          filters.tableNumber !== 'all' || 
                          filters.searchQuery !== '';

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Filter Orders</h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Showing {filteredOrders} of {totalOrders} orders</span>
          </div>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <Select
          label="Order Status"
          options={statusOptions}
          value={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
          className="w-full"
        />

        {/* Date Range Filter */}
        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={filters.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
          className="w-full"
        />

        {/* Table Number Filter */}
        <Select
          label="Table Number"
          options={tableOptions}
          value={filters.tableNumber}
          onChange={(value) => handleFilterChange('tableNumber', value)}
          className="w-full"
        />

        {/* Search Input */}
        <Input
          label="Search Customer"
          type="search"
          placeholder="Search by customer name..."
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          className="w-full"
        />
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground mr-2">Quick filters:</span>
        <Button
          variant={filters.status === 'unpaid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('status', filters.status === 'unpaid' ? 'all' : 'unpaid')}
        >
          Unpaid Orders
        </Button>
        <Button
          variant={filters.dateRange === 'today' && filters.status === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            handleFilterChange('dateRange', 'today');
            handleFilterChange('status', 'all');
          }}
        >
          Today's Orders
        </Button>
        <Button
          variant={filters.status === 'processing' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('status', filters.status === 'processing' ? 'all' : 'processing')}
        >
          Processing
        </Button>
      </div>
    </div>
  );
};

export default OrderFilters;