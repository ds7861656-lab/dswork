import React from 'react';
import { useTranslation } from 'react-i18next';

interface BackToTopButtonProps {
  visible: boolean;
  onClick: () => void;
}

const BackToTopButton: React.FC<BackToTopButtonProps> = ({ visible, onClick }) => {
  const { t } = useTranslation();

  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-12 h-12 bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 z-50"
      aria-label={t('blog.backToTop')}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
};

export default BackToTopButton;