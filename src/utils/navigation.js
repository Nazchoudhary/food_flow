// Navigation utility for backend-controlled routing

export const navigate = (path) => {
  try {
    if (window.navigateToPage && typeof window.navigateToPage === 'function') {
      window.navigateToPage(path);
    } else {
      // Fallback for cases where navigation function isn't available
      console.warn('Navigate function not available, using fallback');
      window.location.href = path;
    }
  } catch (error) {
    console.error('Navigation error:', error);
    // Ultimate fallback
    window.location.href = path;
  }
};

export const getCurrentPath = () => {
  try {
    return window.location.pathname;
  } catch (error) {
    console.error('Error getting current path:', error);
    return '/';
  }
};

export const getCurrentSearch = () => {
  try {
    return window.location.search;
  } catch (error) {
    console.error('Error getting current search:', error);
    return '';
  }
};

export const buildPath = (path, params = {}) => {
  try {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value);
      }
    });
    
    const searchString = searchParams.toString();
    return searchString ? `${path}?${searchString}` : path;
  } catch (error) {
    console.error('Error building path:', error);
    return path;
  }
};

// React hook for navigation (fallback compatible)
export const useNavigation = () => {
  return {
    navigate,
    getCurrentPath,
    getCurrentSearch,
    buildPath
  };
};

// Helper function to check if we can use advanced navigation
export const isNavigationAvailable = () => {
  return typeof window !== 'undefined' && 
         typeof window.navigateToPage === 'function';
};

export default {
  navigate,
  getCurrentPath,
  getCurrentSearch,
  buildPath,
  useNavigation,
  isNavigationAvailable
};
