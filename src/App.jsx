import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import DatabaseInit from './components/DatabaseInit';
import { healthCheck, dashboardAPI } from './utils/api';

function App() {
  const [appReady, setAppReady] = useState(false);
  const [needsInit, setNeedsInit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAppStatus = async () => {
      try {
        // Check if backend is running
        await healthCheck();
        
        // Try to fetch some data to see if database is initialized
        try {
          await dashboardAPI.getMetrics();
          setAppReady(true);
          setNeedsInit(false);
        } catch (error) {
          // If metrics fail, database probably needs initialization
          setAppReady(false);
          setNeedsInit(true);
        }
      } catch (error) {
        // Backend is not running
        setAppReady(false);
        setNeedsInit(true);
      } finally {
        setLoading(false);
      }
    };

    checkAppStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing FoodFlow Admin...</p>
        </div>
      </div>
    );
  }

  if (needsInit) {
    return <DatabaseInit />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <Routes />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
