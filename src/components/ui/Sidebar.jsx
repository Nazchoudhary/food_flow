import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard-overview',
      icon: 'LayoutDashboard',
      badge: null,
      role: 'all'
    },
    {
      label: 'Order Management',
      path: '/order-management',
      icon: 'ClipboardList',
      badge: 5,
      role: 'all'
    },
    {
      label: 'Order Details',
      path: '/order-details',
      icon: 'FileText',
      badge: null,
      role: 'all'
    },
    {
      label: 'Menu Management',
      path: '/menu-management',
      icon: 'Menu',
      badge: null,
      role: 'all'
    },
    {
      label: 'User Management',
      path: '/user-management',
      icon: 'Users',
      badge: null,
      role: 'superadmin'
    },
    {
      label: 'Bill Generation',
      path: '/bill-generation',
      icon: 'Receipt',
      badge: null,
      role: 'all'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Filter navigation items based on user role (for demo, showing all items)
  const filteredNavItems = navigationItems.filter(item => 
    item.role === 'all' || item.role === 'superadmin'
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-[1300] md:hidden"
      >
        <Icon name="Menu" size={20} />
      </Button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[1200] md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] bg-card border-r border-border z-[1000]
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-60'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <h2 className="text-sm font-medium text-muted-foreground">Navigation</h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden md:flex"
            >
              <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredNavItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 ease-out group
                  ${isActive(item.path)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                  ${isCollapsed ? 'justify-center' : 'justify-start'}
                `}
              >
                <div className="relative flex items-center">
                  <Icon
                    name={item.icon}
                    size={20}
                    className={`
                      ${isActive(item.path) ? 'text-primary-foreground' : ''}
                    `}
                  />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-xs text-accent-foreground font-medium">
                        {item.badge}
                      </span>
                    </span>
                  )}
                </div>
                
                {!isCollapsed && (
                  <span className="flex-1 text-left">{item.label}</span>
                )}
                
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover border border-border rounded-md shadow-modal opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[1100]">
                    <span className="text-xs text-popover-foreground">{item.label}</span>
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground">System Status</span>
                  <span className="text-xs text-success">All Systems Online</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;