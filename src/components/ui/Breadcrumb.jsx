import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathMap = {
    '/dashboard-overview': 'Dashboard Overview',
    '/order-management': 'Order Management',
    '/order-details': 'Order Details',
    '/menu-management': 'Menu Management',
    '/user-management': 'User Management',
    '/bill-generation': 'Bill Generation'
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [];

    // Always start with Dashboard as home
    breadcrumbs.push({
      label: 'Dashboard',
      path: '/dashboard-overview',
      isActive: false
    });

    // Add current page if it's not dashboard
    if (location.pathname !== '/dashboard-overview') {
      const currentPageLabel = pathMap[location.pathname] || 'Unknown Page';
      breadcrumbs.push({
        label: currentPageLabel,
        path: location.pathname,
        isActive: true
      });
    } else {
      // If we're on dashboard, mark it as active
      breadcrumbs[0].isActive = true;
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleNavigation = (path) => {
    if (path !== location.pathname) {
      navigate(path);
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && (
            <Icon name="ChevronRight" size={16} className="text-muted-foreground/50" />
          )}
          
          <button
            onClick={() => handleNavigation(crumb.path)}
            className={`
              transition-colors duration-200 hover:text-foreground
              ${crumb.isActive 
                ? 'text-foreground font-medium cursor-default' 
                : 'text-muted-foreground hover:text-foreground cursor-pointer'
              }
            `}
            disabled={crumb.isActive}
          >
            {crumb.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;