import React from "react";
import Icon from "./AppIcon";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    error.__ErrorBoundary = true;
    this.setState({
      error,
      errorInfo
    });
    
    // Log error details
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    
    window.__COMPONENT_ERROR__?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const error = this.state.error;
      const isRouterError = error?.message?.includes('useNavigate') || 
                          error?.message?.includes('useLocation') || 
                          error?.message?.includes('Router') ||
                          error?.message?.includes('string did not match the expected pattern');

      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8 max-w-lg bg-card border border-border rounded-lg">
            <div className="flex justify-center items-center mb-6">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={32} className="text-destructive" />
              </div>
            </div>
            
            <div className="flex flex-col gap-2 text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">
                {isRouterError ? 'Navigation Error' : 'Something went wrong'}
              </h1>
              <p className="text-muted-foreground text-base">
                {isRouterError 
                  ? 'There was an issue with page navigation. This might be due to routing configuration.'
                  : 'We encountered an unexpected error while processing your request.'
                }
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && error && (
              <div className="mb-6 p-4 bg-muted rounded-lg text-left">
                <h3 className="font-semibold text-sm text-foreground mb-2">Error Details:</h3>
                <p className="text-xs text-muted-foreground font-mono break-all">
                  {error.message}
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded flex items-center gap-2 transition-colors duration-200"
              >
                <Icon name="RefreshCw" size={18} />
                Reload Page
              </button>
              
              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                className="bg-muted hover:bg-muted/80 text-foreground font-medium py-2 px-4 rounded flex items-center gap-2 transition-colors duration-200"
              >
                <Icon name="Home" size={18} />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
