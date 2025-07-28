import React, { useState } from 'react';
import Button from './ui/Button';
import { initializeDatabase, healthCheck } from '../utils/api';
import { API_CONFIG } from '../utils/config';

const DatabaseInit = ({ error: initialError, backendHealth }) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initComplete, setInitComplete] = useState(false);
  const [error, setError] = useState(initialError);
  const [backendStatus, setBackendStatus] = useState(backendHealth ? 'connected' : 'checking');

  // Check backend health on component mount
  React.useEffect(() => {
    if (backendHealth) {
      setBackendStatus('connected');
      setError(null);
      return;
    }

    const checkBackend = async () => {
      try {
        const health = await healthCheck();
        setBackendStatus('connected');
        setError(null);
        console.log('Backend health check successful:', health);
      } catch (error) {
        console.error('Backend health check failed:', error);
        setBackendStatus('disconnected');
        setError(`Unable to connect to backend server: ${error.message}`);
      }
    };
    
    checkBackend();
  }, [backendHealth]);

  const handleInitializeDatabase = async () => {
    setIsInitializing(true);
    setError(null);
    
    try {
      await initializeDatabase();
      setInitComplete(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Database initialization failed:', error);
      setError(`Failed to initialize database: ${error.message}`);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleRetryConnection = async () => {
    setBackendStatus('checking');
    setError(null);
    
    try {
      const health = await healthCheck();
      setBackendStatus('connected');
      console.log('Backend retry successful:', health);
    } catch (error) {
      setBackendStatus('disconnected');
      setError(`Backend server is still not responding: ${error.message}`);
    }
  };

  if (backendStatus === 'checking') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking backend connection...</p>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Backend URL:</strong> {API_CONFIG.BACKEND_URL}
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Environment:</strong> {API_CONFIG.IS_DEPLOYED ? 'Deployed' : 'Development'}
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Host:</strong> {API_CONFIG.HOSTNAME}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (backendStatus === 'disconnected') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-lg w-full p-6 bg-card border border-border rounded-lg">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Backend Connection Failed</h2>
            <p className="text-muted-foreground text-sm mb-2">
              Unable to connect to the backend server.
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Connection Details:</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Backend URL:</strong> {API_CONFIG.BACKEND_URL}</p>
                <p><strong>API Base:</strong> {API_CONFIG.BASE_URL}</p>
                <p><strong>Environment:</strong> {API_CONFIG.IS_DEPLOYED ? 'Deployed' : 'Development'}</p>
                <p><strong>Hostname:</strong> {API_CONFIG.HOSTNAME}</p>
              </div>
            </div>

            {!API_CONFIG.IS_DEPLOYED && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Development Setup:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Ensure backend server is running: <code>cd backend && npm run dev</code></li>
                  <li>• Check if port 5000 is accessible</li>
                  <li>• Verify MySQL database is running</li>
                </ul>
              </div>
            )}
            
            <Button 
              onClick={handleRetryConnection} 
              className="w-full"
              iconName="RefreshCw"
              iconPosition="left"
            >
              Retry Connection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (initComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Database Initialized!</h2>
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-lg w-full p-8 bg-card border border-border rounded-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to FoodFlow Admin</h1>
          <p className="text-muted-foreground">
            Backend connected successfully! {API_CONFIG.IS_DEPLOYED ? 'Initialize the database to get started.' : 'Setup your database to continue.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">Backend Status</h3>
            {backendHealth && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Status:</strong> {backendHealth.status}</p>
                <p><strong>Environment:</strong> {backendHealth.environment}</p>
                <p><strong>Database:</strong> {backendHealth.database}</p>
                <p><strong>Port:</strong> {backendHealth.port}</p>
              </div>
            )}
          </div>

          {!API_CONFIG.IS_DEPLOYED && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Database Setup</h3>
              <p className="text-sm text-muted-foreground mb-3">
                This will create the necessary tables and insert sample data including:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>8 Menu categories and 12 menu items</li>
                <li>8 Sample customers and orders</li>
                <li>5 Admin users with different roles</li>
                <li>Payment and order tracking data</li>
              </ul>
            </div>
          )}

          <Button
            onClick={handleInitializeDatabase}
            disabled={isInitializing}
            className="w-full"
            iconName={isInitializing ? "Loader2" : "Database"}
            iconPosition="left"
          >
            {isInitializing ? 'Initializing Database...' : 'Initialize Database'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseInit;
