import React from 'react';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from '../ErrorBoundary';
import type { ErrorInfo, ReactNode } from 'react';

interface SectionErrorBoundaryProps {
  children: ReactNode;
  sectionName: string;
  fallbackComponent?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ContentSectionErrorFallbackProps {
  onRetry: () => void;
  t: (key: string) => string;
}

const ContentSectionErrorFallback: React.FC<ContentSectionErrorFallbackProps> = ({ onRetry, t }) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
    <svg className="h-12 w-12 text-yellow-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <h3 className="text-lg font-medium text-yellow-800 mb-2">{t('error.contentError')}</h3>
    <p className="text-yellow-700 mb-4">{t('error.contentErrorDescription')}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
    >
      {t('error.reloadContent')}
    </button>
  </div>
);

interface NavigationSectionErrorFallbackProps {
  onRetry: () => void;
  t: (key: string) => string;
}

const NavigationSectionErrorFallback: React.FC<NavigationSectionErrorFallbackProps> = ({ onRetry, t }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="text-blue-800 font-medium">{t('error.navigationError')}</span>
      </div>
      <button
        onClick={onRetry}
        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        {t('error.retry')}
      </button>
    </div>
  </div>
);

interface SidebarSectionErrorFallbackProps {
  onRetry: () => void;
  t: (key: string) => string;
}

const SidebarSectionErrorFallback: React.FC<SidebarSectionErrorFallbackProps> = ({ onRetry, t }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
    <div className="text-center">
      <svg className="h-10 w-10 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
      <p className="text-gray-600 text-sm mb-3">{t('error.sidebarError')}</p>
      <button
        onClick={onRetry}
        className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
      >
        {t('error.retry')}
      </button>
    </div>
  </div>
);

interface GenericSectionErrorFallbackProps {
  sectionName: string;
  onRetry: () => void;
  t: (key: string) => string;
}

const GenericSectionErrorFallback: React.FC<GenericSectionErrorFallbackProps> = ({ 
  sectionName, 
  onRetry, 
  t 
}) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <svg className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <h4 className="text-sm font-medium text-red-800">{t('error.sectionError')} - {sectionName}</h4>
          <p className="text-red-700 text-xs">{t('error.sectionErrorDescription')}</p>
        </div>
      </div>
      <button
        onClick={onRetry}
        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        {t('error.retry')}
      </button>
    </div>
  </div>
);

export const SectionErrorBoundary: React.FC<SectionErrorBoundaryProps> = ({
  children,
  sectionName,
  fallbackComponent,
  onError
}) => {
  const { t } = useTranslation();

  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.error(`Error in ${sectionName} section:`, error, errorInfo);
    onError?.(error, errorInfo);
    
    // Log to analytics
    if (import.meta.env.PROD) {
      // Example: analytics.track('section_error', { section: sectionName, error: error.message });
    }
  };

  const getFallback = () => {
    if (fallbackComponent) return fallbackComponent;

    switch (sectionName.toLowerCase()) {
      case 'content':
      case 'maincontent':
        return <ContentSectionErrorFallback t={t} onRetry={() => window.location.reload()} />;
      case 'navigation':
      case 'nav':
        return <NavigationSectionErrorFallback t={t} onRetry={() => window.location.reload()} />;
      case 'sidebar':
        return <SidebarSectionErrorFallback t={t} onRetry={() => window.location.reload()} />;
      default:
        return <GenericSectionErrorFallback t={t} sectionName={sectionName} onRetry={() => window.location.reload()} />;
    }
  };

  return (
    <ErrorBoundary
      level="section"
      showDetails={import.meta.env.DEV}
      onError={handleError}
      fallback={getFallback()}
    >
      {children}
    </ErrorBoundary>
  );
};

export default SectionErrorBoundary;