import React, { useState, useEffect } from 'react';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import DatabaseInit from './components/DatabaseInit';
import { healthCheck, getPageData } from './utils/api';
import { API_CONFIG } from './utils/config';

// Import all page components
import DashboardOverview from './pages/dashboard-overview';
import OrderManagement from './pages/order-management';
import OrderDetails from './pages/order-details';
import MenuManagement from './pages/menu-management';
import UserManagement from './pages/user-management';
import BillGeneration from './pages/bill-generation';
import NotFound from './pages/NotFound';

function App() {
  const [appReady, setAppReady] = useState(false);
  const [needsInit, setNeedsInit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [error, setError] = useState(null);
  const [backendHealth, setBackendHealth] = useState(null);

  // Component mapping
  const componentMap = {
    'DashboardOverview': DashboardOverview,
    'OrderManagement': OrderManagement,
    'OrderDetails': OrderDetails,
    'MenuManagement': MenuManagement,
    'UserManagement': UserManagement,
    'BillGeneration': BillGeneration,
    'NotFound': NotFound
  };

  // Load page data from backend route
  const loadPageData = async (path) => {
    try {
      setError(null);
      const data = await getPageData(path, window.location.search);
      
      setPageData(data);
      setAppReady(true);
      setNeedsInit(false);
      
      // Update document title
      if (data.title) {
        document.title = `${data.title} - FoodFlow Admin`;
      }
    } catch (error) {
      console.error('Failed to load page data:', error);
      setError('Unable to load page data');
      setPageData({ 
        component: 'NotFound', 
        title: 'Page Not Found',
        page: '404'
      });
      setAppReady(true);
    }
  };

  // Check app status and load initial page
  useEffect(() => {
    const checkAppStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Checking backend health at:', API_CONFIG.BASE_URL);
        
        // Check if backend is running
        const health = await healthCheck();
        setBackendHealth(health);
        
        console.log('Backend health response:', health);
        
        // Load page data for current path
        await loadPageData(currentPath);
      } catch (error) {
        console.error('Backend connection failed:', error);
        setError(`Unable to connect to backend: ${error.message}`);
        setBackendHealth(null);
        
        // Check if we should show init screen or error
        if (error.message.includes('503') || error.message.includes('database')) {
          setNeedsInit(true);
          setAppReady(false);
        } else {
          // For other errors, try to load page data anyway (might work with cached data)
          try {
            await loadPageData(currentPath);
          } catch (pageError) {
            setAppReady(false);
            setNeedsInit(true);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    checkAppStatus();
  }, [currentPath]);

  // Handle navigation
  const navigateToPage = async (path) => {
    if (path !== currentPath) {
      setCurrentPath(path);
      window.history.pushState({}, '', path);
      await loadPageData(path);
    }
  };

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const newPath = window.location.pathname;
      if (newPath !== currentPath) {
        setCurrentPath(newPath);
        loadPageData(newPath);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentPath]);

  // Provide navigation context to child components
  useEffect(() => {
    window.navigateToPage = navigateToPage;
    
    // Override link clicks to use backend routing
    const handleLinkClick = (e) => {
      const target = e.target.closest('a');
      if (target && target.href && target.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const path = target.getAttribute('href');
        navigateToPage(path);
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing FoodFlow Admin...</p>
          <p className="text-xs text-muted-foreground mt-2">
            Backend URL: {API_CONFIG.BACKEND_URL}
          </p>
        </div>
      </div>
    );
  }

  if (needsInit) {
    return <DatabaseInit error={error} backendHealth={backendHealth} />;
  }

  if (!pageData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading page...</p>
          {error && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg max-w-md">
              <p className="text-destructive text-sm">{error}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Backend: {API_CONFIG.BACKEND_URL}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Get the component to render
  const ComponentToRender = componentMap[pageData.component] || NotFound;

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <ComponentToRender 
        pageData={pageData} 
        navigate={navigateToPage}
        currentPath={currentPath}
        backendHealth={backendHealth}
      />
    </ErrorBoundary>
  );
}

export default App;
