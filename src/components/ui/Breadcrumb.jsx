import React from 'react';
import Icon from '../AppIcon';
import { navigate } from '../../utils/navigation';

const Breadcrumb = ({ breadcrumb = [] }) => {
  if (!breadcrumb || breadcrumb.length === 0) {
    return null;
  }

  const handleNavigate = (href) => {
    if (href) {
      navigate(href);
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      <Icon name="Home" size={16} className="text-muted-foreground" />
      
      {breadcrumb.map((item, index) => (
        <React.Fragment key={index}>
          <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
          
          {item.active ? (
            <span className="text-foreground font-medium">
              {item.label}
            </span>
          ) : (
            <button
              onClick={() => handleNavigate(item.href)}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
