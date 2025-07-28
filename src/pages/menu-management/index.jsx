import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import CategoryFilter from './components/CategoryFilter';
import MenuItemTable from './components/MenuItemTable';
import MenuItemModal from './components/MenuItemModal';
import MenuItemCard from './components/MenuItemCard';
import BulkActions from './components/BulkActions';
import DeleteConfirmModal from './components/DeleteConfirmModal';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mock data
  const mockMenuItems = [
    {
      id: "1",
      name: "Classic Margherita Pizza",
      category: "Pizza",
      price: 12.99,
      description: "Fresh tomato sauce, mozzarella cheese, and basil leaves on a crispy crust",
      status: "active"
    },
    {
      id: "2",
      name: "Grilled Chicken Caesar Salad",
      category: "Salads",
      price: 14.50,
      description: "Crisp romaine lettuce, grilled chicken, parmesan cheese, and caesar dressing",
      status: "active"
    },
    {
      id: "3",
      name: "Beef Burger Deluxe",
      category: "Burgers",
      price: 16.99,
      description: "Juicy beef patty with lettuce, tomato, cheese, and special sauce",
      status: "active"
    },
    {
      id: "4",
      name: "Chocolate Lava Cake",
      category: "Desserts",
      price: 8.99,
      description: "Warm chocolate cake with molten center, served with vanilla ice cream",
      status: "active"
    },
    {
      id: "5",
      name: "Fish and Chips",
      category: "Main Course",
      price: 18.50,
      description: "Beer-battered fish with crispy fries and tartar sauce",
      status: "inactive"
    },
    {
      id: "6",
      name: "Vegetarian Pasta",
      category: "Pasta",
      price: 13.99,
      description: "Penne pasta with seasonal vegetables in marinara sauce",
      status: "active"
    },
    {
      id: "7",
      name: "BBQ Chicken Wings",
      category: "Appetizers",
      price: 11.99,
      description: "Crispy chicken wings tossed in tangy BBQ sauce",
      status: "active"
    },
    {
      id: "8",
      name: "Greek Salad",
      category: "Salads",
      price: 10.99,
      description: "Mixed greens, olives, feta cheese, and Greek dressing",
      status: "inactive"
    }
  ];

  const mockCategories = [
    { id: "pizza", name: "Pizza", itemCount: 1 },
    { id: "salads", name: "Salads", itemCount: 2 },
    { id: "burgers", name: "Burgers", itemCount: 1 },
    { id: "desserts", name: "Desserts", itemCount: 1 },
    { id: "main-course", name: "Main Course", itemCount: 1 },
    { id: "pasta", name: "Pasta", itemCount: 1 },
    { id: "appetizers", name: "Appetizers", itemCount: 1 }
  ];

  useEffect(() => {
    setMenuItems(mockMenuItems);
    setCategories(mockCategories);
    setFilteredItems(mockMenuItems);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let filtered = menuItems;

    // Filter by category
    if (selectedCategory) {
      const categoryName = categories.find(cat => cat.id === selectedCategory)?.name;
      if (categoryName) {
        filtered = filtered.filter(item => item.category === categoryName);
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort items
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredItems(filtered);
  }, [menuItems, selectedCategory, searchTerm, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = (itemData) => {
    if (editingItem) {
      // Update existing item
      setMenuItems(prev => prev.map(item => 
        item.id === editingItem.id ? { ...itemData, id: editingItem.id } : item
      ));
    } else {
      // Add new item
      setMenuItems(prev => [...prev, { ...itemData, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId) => {
    const item = menuItems.find(item => item.id === itemId);
    setDeletingItem({ id: itemId, name: item?.name });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingItem) {
      if (Array.isArray(deletingItem.id)) {
        // Bulk delete
        setMenuItems(prev => prev.filter(item => !deletingItem.id.includes(item.id)));
        setSelectedItems([]);
      } else {
        // Single delete
        setMenuItems(prev => prev.filter(item => item.id !== deletingItem.id));
      }
    }
    setIsDeleteModalOpen(false);
    setDeletingItem(null);
  };

  const handleStatusToggle = (itemId) => {
    setMenuItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' }
        : item
    ));
  };

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleBulkDelete = () => {
    setDeletingItem({ id: selectedItems, isMultiple: true, count: selectedItems.length });
    setIsDeleteModalOpen(true);
  };

  const handleBulkStatusChange = (status) => {
    setMenuItems(prev => prev.map(item =>
      selectedItems.includes(item.id) ? { ...item, status } : item
    ));
    setSelectedItems([]);
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-0 md:ml-60 pt-16 min-h-screen">
        <div className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Menu Management</h1>
              <p className="text-muted-foreground">
                Manage your restaurant menu items, categories, and pricing
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
              >
                Export Menu
              </Button>
              <Button
                onClick={handleAddItem}
                iconName="Plus"
                iconPosition="left"
              >
                Add New Item
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold text-foreground">{menuItems.length}</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="UtensilsCrossed" size={20} className="text-primary" />
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Items</p>
                  <p className="text-2xl font-bold text-success">
                    {menuItems.filter(item => item.status === 'active').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="Eye" size={20} className="text-success" />
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                </div>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="Grid3x3" size={20} className="text-accent" />
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Price</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${(menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length || 0).toFixed(2)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={20} className="text-secondary" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Category Filter - Desktop */}
            <div className="lg:col-span-3 hidden lg:block">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
                isCollapsed={false}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              {/* Search and Filters */}
              <div className="bg-card border border-border rounded-lg p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex-1 max-w-md">
                    <Input
                      type="search"
                      placeholder="Search menu items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {/* Category Filter - Mobile/Tablet */}
                  <div className="lg:hidden">
                    <CategoryFilter
                      categories={categories}
                      selectedCategory={selectedCategory}
                      onCategorySelect={setSelectedCategory}
                      isCollapsed={true}
                    />
                  </div>
                </div>
              </div>

              {/* Bulk Actions */}
              <BulkActions
                selectedItems={selectedItems}
                onBulkDelete={handleBulkDelete}
                onBulkStatusChange={handleBulkStatusChange}
                onClearSelection={handleClearSelection}
              />

              {/* Menu Items - Desktop Table */}
              {!isMobile && (
                <MenuItemTable
                  items={filteredItems}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                  onStatusToggle={handleStatusToggle}
                  selectedItems={selectedItems}
                  onItemSelect={handleItemSelect}
                  onSelectAll={handleSelectAll}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
              )}

              {/* Menu Items - Mobile Cards */}
              {isMobile && (
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onEdit={handleEditItem}
                      onDelete={handleDeleteItem}
                      onStatusToggle={handleStatusToggle}
                    />
                  ))}
                  
                  {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                      <Icon name="UtensilsCrossed" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No menu items found</h3>
                      <p className="text-muted-foreground">Add your first menu item to get started.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <MenuItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        item={editingItem}
        categories={categories}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingItem(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={deletingItem?.name}
        isMultiple={deletingItem?.isMultiple}
        count={deletingItem?.count}
      />
    </div>
  );
};

export default MenuManagement;