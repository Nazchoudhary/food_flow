import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import { navigate, getCurrentPath } from '../../utils/navigation';
import { getNavigation } from '../../utils/api';

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [navigationItems, setNavigationItems] = useState([]);
  const [currentPath, setCurrentPath] = useState(getCurrentPath());

  // Load navigation items from backend
  useEffect(() => {
    const loadNavigation = async () => {
      try {
        const items = await getNavigation();
        setNavigationItems(items);
      } catch (error) {
        console.error('Failed to load navigation:', error);
        // Fallback navigation items
        setNavigationItems([
          { path: '/', label: 'Dashboard', icon: 'BarChart3' },
          { path: '/order-management', label: 'Orders', icon: 'ShoppingBag' },
          { path: '/menu-management', label: 'Menu', icon: 'UtensilsCrossed' },
          { path: '/user-management', label: 'Users', icon: 'Users' },
          { path: '/bill-generation', label: 'Billing', icon: 'Receipt' }
        ]);
      }
    };

    loadNavigation();
  }, []);

  // Update current path when location changes
  useEffect(() => {
    const updateCurrentPath = () => {
      setCurrentPath(getCurrentPath());
    };

    // Listen for navigation changes
    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
      originalPushState.apply(window.history, arguments);
      updateCurrentPath();
    };

    window.addEventListener('popstate', updateCurrentPath);
    
    return () => {
      window.history.pushState = originalPushState;
      window.removeEventListener('popstate', updateCurrentPath);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const isActiveRoute = (path) => {
    if (path === '/') {
      return currentPath === '/' || currentPath === '/dashboard-overview';
    }
    return currentPath === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-16 left-0 z-50 w-60 h-[calc(100vh-4rem)] bg-card border-r border-border transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Navigation Header */}
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActiveRoute(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon 
                  name={item.icon} 
                  size={18} 
                  className={isActiveRoute(item.path) ? 'text-primary-foreground' : ''} 
                />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Admin User
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Super Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-20 left-4 z-60 p-2 bg-card border border-border rounded-lg shadow-lg md:hidden"
        >
          <Icon name={isOpen ? "X" : "Menu"} size={20} className="text-foreground" />
        </button>
      )}
    </>
  );
};

export default Sidebar;
