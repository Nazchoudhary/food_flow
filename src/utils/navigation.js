// Navigation utility for backend-controlled routing

export const navigate = (path) => {
  if (window.navigateToPage) {
    window.navigateToPage(path);
  } else {
    // Fallback for cases where navigation function isn't available
    window.location.href = path;
  }
};

export const getCurrentPath = () => {
  return window.location.pathname;
};

export const getCurrentSearch = () => {
  return window.location.search;
};

export const buildPath = (path, params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value);
    }
  });
  
  const searchString = searchParams.toString();
  return searchString ? `${path}?${searchString}` : path;
};

// React hook for navigation
export const useNavigation = () => {
  return {
    navigate,
    getCurrentPath,
    getCurrentSearch,
    buildPath
  };
};

export default {
  navigate,
  getCurrentPath,
  getCurrentSearch,
  buildPath,
  useNavigation
};
