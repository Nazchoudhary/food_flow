import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect, isCollapsed }) => {
  const handleCategoryClick = (categoryId) => {
    onCategorySelect(categoryId);
  };

  if (isCollapsed) {
    return (
      <div className="mb-4">
        <select
          value={selectedCategory || ''}
          onChange={(e) => onCategorySelect(e.target.value || null)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} ({category.itemCount})
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Categories</h3>
        <Icon name="Filter" size={20} className="text-muted-foreground" />
      </div>
      
      <div className="space-y-2">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <span>All Categories</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full">
            {categories.reduce((total, cat) => total + cat.itemCount, 0)}
          </span>
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <span>{category.name}</span>
            <span className="text-xs bg-muted px-2 py-1 rounded-full">
              {category.itemCount}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;