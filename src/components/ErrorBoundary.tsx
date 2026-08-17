import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  level?: 'page' | 'component' | 'section';
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

class ErrorBoundaryClass extends Component<Props & { t: (key: string) => string }, State> {
  constructor(props: Props & { t: (key: string) => string }) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to external service in production
    if (import.meta.env.PROD) {
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
    }

    this.setState({ errorInfo });
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleGoBack = () => {
    window.history.back();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          retryCount={this.state.retryCount}
          onRetry={this.handleRetry}
          onGoBack={this.handleGoBack}
          onGoHome={this.handleGoHome}
          showDetails={this.props.showDetails}
          level={this.props.level || 'component'}
          t={this.props.t}
        />
      );
    }

    return this.props.children;
  }
}

// Wrapper component to use hooks
const ErrorBoundary: React.FC<Props> = ({ children, fallback, onError, showDetails = false, level = 'component' }) => {
  const { t } = useTranslation();
  return (
    <ErrorBoundaryClass 
      t={t} 
      fallback={fallback} 
      onError={onError} 
      showDetails={showDetails}
      level={level}
    >
      {children}
    </ErrorBoundaryClass>
  );
};

// Error fallback component with different layouts based on level
interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  onRetry: () => void;
  onGoBack: () => void;
  onGoHome: () => void;
  showDetails?: boolean;
  level: 'page' | 'component' | 'section';
  t: (key: string) => string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  retryCount,
  onRetry,
  onGoBack,
  onGoHome,
  showDetails = false,
  level,
  t
}) => {
  const maxRetries = 3;

  const baseClasses = "flex items-center justify-center p-4";
  const containerClasses = level === 'page' 
    ? "min-h-screen bg-gray-50" 
    : level === 'section'
    ? "h-full min-h-[200px] bg-red-50 border border-red-200 rounded-lg"
    : "h-full min-h-[100px] bg-red-50 border border-red-200 rounded";

  return (
    <div className={`${baseClasses} ${containerClasses}`}>
      <div className={`${level === 'page' ? 'max-w-md w-full' : 'w-full'} bg-white rounded-lg shadow-lg p-6 text-center`}>
        <div className="mb-4">
          <svg className={`${level === 'page' ? 'h-16 w-16' : 'h-12 w-12'} text-red-500 mx-auto`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h2 className={`${level === 'page' ? 'text-xl' : 'text-lg'} font-semibold text-gray-900 mb-2`}>
          {t('error.somethingWentWrong')}
        </h2>
        
        <p className={`${level === 'page' ? 'text-gray-600' : 'text-gray-500'} mb-4`}>
          {level === 'page' 
            ? t('error.tryRefreshing') 
            : t('error.componentError')
          }
        </p>

        {showDetails && error && (
          <div className="mb-4 p-3 bg-gray-100 rounded text-left text-sm">
            <p className="font-mono text-red-600">{error.message}</p>
            {import.meta.env.DEV && errorInfo?.componentStack && (
              <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">
                {errorInfo.componentStack}
              </pre>
            )}
          </div>
        )}

        <div className={`${level === 'page' ? 'space-y-2' : 'space-x-2'} flex ${level === 'page' ? 'flex-col' : 'flex-row'} justify-center`}>
          {retryCount < maxRetries && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('error.retry')} ({maxRetries - retryCount} {t('error.retriesLeft')})
            </button>
          )}
          
          {level !== 'section' && (
            <button
              onClick={onGoBack}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              {t('error.goBack')}
            </button>
          )}
          
          {level === 'page' && (
            <button
              onClick={onGoHome}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {t('error.goHome')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;