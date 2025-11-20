import { useEffect } from "react";

const ScrollToTop = () => {
  useEffect(() => {
    // Scroll to top on component mount and when pathname changes
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Listen for navigation changes and scroll to top
    const handleNavigation = () => {
      window.scrollTo(0, 0);
    };

    // Listen for both pushState and popstate events
    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
      originalPushState.apply(window.history, arguments);
      handleNavigation();
    };

    window.addEventListener('popstate', handleNavigation);

    return () => {
      window.history.pushState = originalPushState;
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  return null;
};

export default ScrollToTop;
