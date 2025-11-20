import React, { useState, useEffect } from 'react';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import DatabaseInit from './components/DatabaseInit';
import { healthCheck, getPageData, isDemoMode } from './utils/api';
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
  const [demoMode, setDemoMode] = useState(false);

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
      
      // Get page data (will fallback to mock data if backend unavailable)
      const data = await getPageData(path, window.location.search);
      
      setPageData(data);
      setAppReady(true);
      
      // Update document title
      if (data.title) {
        document.title = `${data.title} - FoodFlow Admin${isDemoMode() ? ' (Demo)' : ''}`;
      }
      
      // Update demo mode state
      setDemoMode(isDemoMode());
      
    } catch (error) {
      console.error('Failed to load page data:', error);
      setError('Unable to load page data');
      
      // Ultimate fallback
      setPageData({
        component: 'DashboardOverview',
        title: 'Dashboard Overview',
        page: 'dashboard-overview',
        breadcrumb: [
          { label: 'Dashboard', href: '/', active: true }
        ]
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
        
        // Try to check if backend is running
        try {
          const health = await healthCheck();
          setBackendHealth(health);
          console.log('Backend health response:', health);
          
          // Check if we're in demo mode
          if (health.status === 'DEMO') {
            setDemoMode(true);
            setNeedsInit(false);
          } else {
            setDemoMode(false);
            // Only show init screen if backend is healthy but database might need setup
            if (health.database === 'disconnected') {
              setNeedsInit(true);
            }
          }
        } catch (healthError) {
          console.warn('Backend health check failed, entering demo mode:', healthError);
          setBackendHealth(null);
          setDemoMode(true);
          setNeedsInit(false);
        }
        
        // Always try to load page data (with fallback to mock data)
        await loadPageData(currentPath);
        
      } catch (error) {
        console.error('App initialization failed:', error);
        setError(`Application initialization failed: ${error.message}`);
        
        // Set fallback state
        setPageData({
          component: 'DashboardOverview',
          title: 'Dashboard Overview (Demo)',
          page: 'dashboard-overview'
        });
        setAppReady(true);
        setNeedsInit(false);
        setDemoMode(true);
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

  // Show database init screen only if backend is healthy but database needs setup
  if (needsInit && backendHealth && !demoMode) {
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
      
      {/* Demo Mode Banner */}
      {demoMode && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 text-center">
          <p className="text-amber-800 text-sm">
            ⚡ <strong>Demo Mode:</strong> Backend is not available. Using mock data for demonstration.
          </p>
        </div>
      )}
      
      <ComponentToRender 
        pageData={pageData} 
        navigate={navigateToPage}
        currentPath={currentPath}
        backendHealth={backendHealth}
        demoMode={demoMode}
      />
    </ErrorBoundary>
  );
}

export default App;
