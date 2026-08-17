import React from 'react';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from '../ErrorBoundary';
import type { ErrorInfo, ReactNode } from 'react';

interface ComponentErrorBoundaryProps {
  children: ReactNode;
  componentName: string;
  fallbackComponent?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface HeaderErrorFallbackProps {
  onRetry: () => void;
  t: (key: string) => string;
}

const HeaderErrorFallback: React.FC<HeaderErrorFallbackProps> = ({ onRetry, t }) => (
  <div className="bg-white shadow-sm border-b border-gray-200">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-teal-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">FT</span>
          </div>
          <span className="text-gray-600 text-sm">FreshTrip</span>
        </div>
        <button
          onClick={onRetry}
          className="px-3 py-1 text-xs bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
        >
          {t('error.retry')}
        </button>
      </div>
    </div>
  </div>
);

interface FooterErrorFallbackProps {
  onRetry: () => void;
  t: (key: string) => string;
}

const FooterErrorFallback: React.FC<FooterErrorFallbackProps> = ({ onRetry, t }) => (
  <footer className="bg-gray-900 text-white py-8">
    <div className="container mx-auto px-4">
      <div className="text-center">
        <div className="h-8 w-8 bg-teal-600 rounded mx-auto mb-4 flex items-center justify-center">
          <span className="text-white font-bold text-sm">FT</span>
        </div>
        <p className="text-gray-400 mb-4">FreshTrip - Your Travel Companion</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 text-xs bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
        >
          {t('error.retry')}
        </button>
      </div>
    </div>
  </footer>
);

interface ImageCarouselErrorFallbackProps {
  onRetry: () => void;
  t: (key: string) => string;
}

const ImageCarouselErrorFallback: React.FC<ImageCarouselErrorFallbackProps> = ({ onRetry, t }) => (
  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
    <div className="text-center">
      <svg className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p className="text-gray-500 text-sm mb-2">{t('error.imageLoadError')}</p>
      <button
        onClick={onRetry}
        className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
      >
        {t('error.retry')}
      </button>
    </div>
  </div>
);

interface CommentSectionErrorFallbackProps {
  onRetry: () => void;
  t: (key: string) => string;
}

const CommentSectionErrorFallback: React.FC<CommentSectionErrorFallbackProps> = ({ onRetry, t }) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <div className="flex items-center mb-2">
      <svg className="h-5 w-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <h3 className="text-sm font-medium text-yellow-800">{t('error.commentsError')}</h3>
    </div>
    <p className="text-yellow-700 text-sm mb-3">{t('error.commentsErrorDescription')}</p>
    <button
      onClick={onRetry}
      className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
    >
      {t('error.tryAgain')}
    </button>
  </div>
);

interface GenericComponentErrorFallbackProps {
  componentName: string;
  onRetry: () => void;
  onDismiss?: () => void;
  t: (key: string) => string;
}

const GenericComponentErrorFallback: React.FC<GenericComponentErrorFallbackProps> = ({ 
  componentName, 
  onRetry, 
  onDismiss, 
  t 
}) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <svg className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <h3 className="text-sm font-medium text-red-800">{t('error.componentError')} - {componentName}</h3>
          <p className="text-red-700 text-xs">{t('error.componentErrorDescription')}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onRetry}
          className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          {t('error.retry')}
        </button>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            {t('error.dismiss')}
          </button>
        )}
      </div>
    </div>
  </div>
);

export const ComponentErrorBoundary: React.FC<ComponentErrorBoundaryProps> = ({
  children,
  componentName,
  fallbackComponent,
  onError
}) => {
  const { t } = useTranslation();

  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.error(`Error in ${componentName} component:`, error, errorInfo);
    onError?.(error, errorInfo);
    
    // Log to analytics
    if (import.meta.env.PROD) {
      // Example: analytics.track('component_error', { component: componentName, error: error.message });
    }
  };

  const getFallback = () => {
    if (fallbackComponent) return fallbackComponent;

    switch (componentName.toLowerCase()) {
      case 'header':
        return <HeaderErrorFallback t={t} onRetry={() => window.location.reload()} />;
      case 'footer':
        return <FooterErrorFallback t={t} onRetry={() => window.location.reload()} />;
      case 'imagecarousel':
        return <ImageCarouselErrorFallback t={t} onRetry={() => window.location.reload()} />;
      case 'commentsection':
        return <CommentSectionErrorFallback t={t} onRetry={() => window.location.reload()} />;
      default:
        return <GenericComponentErrorFallback t={t} componentName={componentName} onRetry={() => window.location.reload()} />;
    }
  };

  return (
    <ErrorBoundary
      level="component"
      showDetails={import.meta.env.DEV}
      onError={handleError}
      fallback={getFallback()}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ComponentErrorBoundary;