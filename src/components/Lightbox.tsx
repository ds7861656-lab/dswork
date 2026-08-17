import React from 'react';
import { useTranslation } from 'react-i18next';

interface LightboxProps {
  image: string | null;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ image, onClose }) => {
  const { t } = useTranslation();

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <img
        src={image}
        alt="Enlarged view"
        className="max-w-full max-h-full"
      />
      <button
        className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
        onClick={onClose}
        aria-label={t('blog.close')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Lightbox;