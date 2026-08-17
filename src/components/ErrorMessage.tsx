import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';

const ErrorMessage: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-white">
      <Header showToolbar showNavLinks={false} />
      <main className="px-8 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              {t('blog.goBack')}
            </button>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
              >
                {t('common.retry')}
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ErrorMessage;