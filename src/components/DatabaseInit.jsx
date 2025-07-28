import React, { useState } from 'react';
import Button from './ui/Button';
import { initializeDatabase, healthCheck } from '../utils/api';

const DatabaseInit = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initComplete, setInitComplete] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend health on component mount
  React.useEffect(() => {
    const checkBackend = async () => {
      try {
        await healthCheck();
        setBackendStatus('connected');
      } catch (error) {
        setBackendStatus('disconnected');
      }
    };
    
    checkBackend();
  }, []);

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
      setError('Failed to initialize database. Please ensure MySQL is running and configured correctly.');
    } finally {
      setIsInitializing(false);
    }
  };

  if (backendStatus === 'checking') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking backend connection...</p>
        </div>
      </div>
    );
  }

  if (backendStatus === 'disconnected') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-card border border-border rounded-lg">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Backend Disconnected</h2>
            <p className="text-muted-foreground text-sm">
              Unable to connect to the backend server. Please ensure the backend is running on port 5000.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium text-foreground mb-1">To start the backend:</p>
              <code className="text-xs text-muted-foreground block">cd backend && npm run dev</code>
            </div>
            
            <Button 
              onClick={() => window.location.reload()} 
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
            Backend connected successfully! Initialize the database to get started with sample data.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
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

          <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <h4 className="font-medium text-foreground mb-1">Default Admin Login:</h4>
            <p className="text-sm text-muted-foreground">Email: john.smith@foodflow.com</p>
            <p className="text-sm text-muted-foreground">Password: admin123</p>
          </div>

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
