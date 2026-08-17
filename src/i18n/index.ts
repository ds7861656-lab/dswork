import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import fr from './locales/fr';
import es from './locales/es';
import en from './locales/en';
import zh from './locales/zh';
import ar from './locales/ar';

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
  es: {
    translation: es,
  },
  zh: {
    translation: zh,
  },
  ar: {
    translation: ar,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;