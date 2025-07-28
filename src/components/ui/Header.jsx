import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
    setIsProfileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-[1000]">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="ChefHat" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-foreground">FoodFlow</h1>
              <span className="text-xs text-muted-foreground -mt-1">Admin</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Icon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center">
              <span className="text-xs text-accent-foreground font-medium">3</span>
            </span>
          </Button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={toggleProfile}
              className="flex items-center space-x-2 px-3"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-foreground">Admin User</span>
                <span className="text-xs text-muted-foreground">Restaurant Admin</span>
              </div>
              <Icon name="ChevronDown" size={16} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-modal z-[1100]">
                <div className="p-3 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} color="white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-popover-foreground">Admin User</p>
                      <p className="text-xs text-muted-foreground">admin@foodflow.com</p>
                      <p className="text-xs text-accent font-medium">Restaurant Admin</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    <Icon name="Settings" size={16} />
                    <span>Profile Settings</span>
                  </button>
                  
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                  
                  <div className="border-t border-border my-2"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-md transition-colors"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop for mobile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[1050] md:hidden"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;