import React from 'react';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from '../ErrorBoundary';
import type { ErrorInfo, ReactNode } from 'react';

interface PageErrorBoundaryProps {
  children: ReactNode;
  pageName: string;
  fallbackComponent?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface BlogPageErrorFallbackProps {
  onRetry: () => void;
  onGoBack: () => void;
  onGoHome: () => void;
  t: (key: string) => string;
}

const BlogPageErrorFallback: React.FC<BlogPageErrorFallbackProps> = ({ 
  onRetry, 
  onGoBack, 
  onGoHome, 
  t 
}) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="mb-6">
        <svg className="h-20 w-20 text-teal-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('error.blogPageError')}</h2>
        <p className="text-gray-600 mb-6">{t('error.blogPageErrorDescription')}</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-medium"
        >
          {t('error.tryAgain')}
        </button>
        
        <div className="flex gap-3">
          <button
            onClick={onGoBack}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            {t('error.goBack')}
          </button>
          
          <button
            onClick={onGoHome}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('error.goHome')}
          </button>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">{t('error.contactSupport')}</p>
        <button
          onClick={() => window.open('mailto:support@afreshtrip.com', '_blank')}
          className="text-teal-600 hover:text-teal-700 text-sm font-medium"
        >
          {t('error.emailSupport')}
        </button>
      </div>
    </div>
  </div>
);

interface LoginPageErrorFallbackProps {
  onRetry: () => void;
  onGoHome: () => void;
  t: (key: string) => string;
}

const LoginPageErrorFallback: React.FC<LoginPageErrorFallbackProps> = ({ 
  onRetry, 
  onGoHome, 
  t 
}) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center px-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="mb-6">
        <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('error.loginPageError')}</h2>
        <p className="text-gray-600 mb-6">{t('error.loginPageErrorDescription')}</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          {t('error.tryLoginAgain')}
        </button>
        
        <button
          onClick={onGoHome}
          className="w-full px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          {t('error.backToHome')}
        </button>
      </div>
    </div>
  </div>
);

interface GenericPageErrorFallbackProps {
  onRetry: () => void;
  onGoBack: () => void;
  onGoHome: () => void;
  pageName: string;
  t: (key: string) => string;
}

const GenericPageErrorFallback: React.FC<GenericPageErrorFallbackProps> = ({ 
  onRetry, 
  onGoBack, 
  onGoHome, 
  pageName, 
  t 
}) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="mb-6">
        <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('error.pageError')} - {pageName}</h2>
        <p className="text-gray-600 mb-6">{t('error.pageErrorDescription')}</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-medium"
        >
          {t('error.tryAgain')}
        </button>
        
        <div className="flex gap-3">
          <button
            onClick={onGoBack}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            {t('error.goBack')}
          </button>
          
          <button
            onClick={onGoHome}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('error.goHome')}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export const PageErrorBoundary: React.FC<PageErrorBoundaryProps> = ({
  children,
  pageName,
  fallbackComponent,
  onError
}) => {
  const { t } = useTranslation();

  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.error(`Error in ${pageName} page:`, error, errorInfo);
    onError?.(error, errorInfo);
    
    // Log to analytics or error tracking service
    if (import.meta.env.PROD) {
      // Example: analytics.track('page_error', { page: pageName, error: error.message });
    }
  };

  const getFallback = () => {
    if (fallbackComponent) return fallbackComponent;

    switch (pageName.toLowerCase()) {
      case 'blog':
        return <BlogPageErrorFallback t={t} onRetry={() => window.location.reload()} onGoBack={() => window.history.back()} onGoHome={() => window.location.href = '/'} />;
      case 'blogdetails':
        return <BlogPageErrorFallback t={t} onRetry={() => window.location.reload()} onGoBack={() => window.history.back()} onGoHome={() => window.location.href = '/'} />;
      case 'login':
        return <LoginPageErrorFallback t={t} onRetry={() => window.location.reload()} onGoHome={() => window.location.href = '/'} />;
      default:
        return <GenericPageErrorFallback t={t} pageName={pageName} onRetry={() => window.location.reload()} onGoBack={() => window.history.back()} onGoHome={() => window.location.href = '/'} />;
    }
  };

  return (
    <ErrorBoundary
      level="page"
      showDetails={import.meta.env.DEV}
      onError={handleError}
      fallback={getFallback()}
    >
      {children}
    </ErrorBoundary>
  );
};

export default PageErrorBoundary;