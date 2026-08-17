# International Setup & i18n Documentation

This document describes the internationalization (i18n) setup for the AfreshTrip frontend application, including multi-language support, RTL layouts, and localization best practices.

## Overview

The AfreshTrip application supports multiple languages to provide a localized experience for users worldwide. The internationalization system is built using `react-i18next` and supports both LTR (Left-to-Right) and RTL (Right-to-Left) languages.

## Supported Languages

The application currently supports 5 languages:

| Language | Code | Flag | Direction | Status |
|----------|------|------|-----------|--------|
| English | `en` | 🇬🇧 | LTR | Complete |
| French | `fr` | 🇫🇷 | LTR | Complete |
| Spanish | `es` | 🇪🇸 | LTR | Complete |
| Chinese | `zh` | 🇨🇳 | LTR | Complete |
| Arabic | `ar` | 🇸🇦 | RTL | Complete |

## Architecture

### Core Dependencies

```json
{
  "react-i18next": "^16.3.0",
  "i18next": "^23.7.6"
}
```

### File Structure

```
src/i18n/
├── index.ts                    # Main i18n configuration
└── locales/
    ├── en/                     # English translations
    │   ├── index.ts           # Export aggregator
    │   ├── common.json        # Common UI strings
    │   ├── header.json        # Header/navigation
    │   ├── footer.json        # Footer
    │   ├── home.json          # Home page
    │   ├── loginForm.json     # Login/authentication
    │   ├── subscription.json  # Subscription related
    │   ├── blog.json          # Blog content
    │   ├── trips.json         # Trip management
    │   ├── profile.json       # User profile
    │   ├── notifications.json # Notifications
    │   ├── featureGate.json   # Feature access
    │   ├── tourCard.json      # Tour cards
    │   ├── countryCard.json   # Country cards
    │   ├── galleryCard.json   # Gallery components
    │   ├── subscriptionCard.json # Subscription cards
    │   └── profileNav.json    # Profile navigation
    ├── fr/                    # French translations (same structure)
    ├── es/                    # Spanish translations (same structure)
    ├── zh/                    # Chinese translations (same structure)
    └── ar/                    # Arabic translations (same structure)
```

## Configuration

### Main i18n Configuration

```typescript
// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import fr from './locales/fr';
import es from './locales/es';
import en from './locales/en';
import zh from './locales/zh';
import ar from './locales/ar';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  es: { translation: es },
  zh: { translation: zh },
  ar: { translation: ar },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // default language (can be overridden)
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
```

### App Integration

```typescript
// src/main.tsx
import './i18n/index'; // Must be imported before App
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

## Usage in Components

### Basic Translation Hook

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('home.welcomeTitle')}</h1>
      <p>{t('home.welcomeSubtitle')}</p>
      <button>{t('common.submit')}</button>
    </div>
  );
};
```

### Translation with Interpolation

```typescript
// Translation key: "user.greeting": "Hello {{name}}!"
const greeting = t('user.greeting', { name: user.name });

// Translation key: "items.count": "You have {{count}} item(s)"
const itemCount = t('items.count', { count: items.length });
```

### Plurals

```typescript
// Translation keys:
// "item": "item"
// "item_plural": "items"
// "itemWithCount": "You have {{count}} item"
// "itemWithCount_plural": "You have {{count}} items"

const itemText = t('item', { count: 5 }); // "You have 5 items"
```

### Nested Translations

```typescript
// JSON structure:
{
  "user": {
    "profile": {
      "name": "Full Name",
      "email": "Email Address"
    }
  }
}

const nameLabel = t('user.profile.name');
const emailLabel = t('user.profile.email');
```

### Arrays and Complex Objects

```typescript
// JSON structure:
{
  "navigation": {
    "items": ["Home", "About", "Contact"]
  }
}

const navItems = t('navigation.items', { returnObjects: true });
// Returns: ["Home", "About", "Contact"]
```

## Language Switching

### Header Language Selector

The application includes a built-in language selector in the header component:

```typescript
// src/components/Header.tsx
const languages = [
  { code: 'en', label: t('header.english'), flag: '🇬🇧' },
  { code: 'fr', label: t('header.french'), flag: '🇫🇷' },
  { code: 'es', label: t('header.spanish'), flag: '🇪🇸' },
  { code: 'zh', label: t('header.chinese'), flag: '🇨🇳' },
  { code: 'ar', label: t('header.arabic'), flag: '🇸🇦' },
];

const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
};
```

### Programmatic Language Switching

```typescript
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const switchToFrench = () => {
    i18n.changeLanguage('fr');
  };

  const switchToArabic = () => {
    i18n.changeLanguage('ar');
  };

  return (
    <div>
      <button onClick={switchToFrench}>Français</button>
      <button onClick={switchToArabic}>العربية</button>
    </div>
  );
};
```

### Detecting Current Language

```typescript
const { i18n } = useTranslation();
const currentLanguage = i18n.language; // e.g., 'en', 'fr', 'ar'
const isRTL = i18n.dir() === 'rtl'; // Check text direction
```

## RTL Support for Arabic

### CSS Direction Handling

The application automatically handles RTL layouts for Arabic:

```typescript
// The i18n instance automatically sets document direction
// When Arabic is selected, document.documentElement.dir = 'rtl'

// Check direction in components
const { i18n } = useTranslation();
const isRTL = i18n.dir() === 'rtl';

// Apply RTL-specific styles
<div className={`text-${isRTL ? 'right' : 'left'}`}>
  Content
</div>
```

### Tailwind CSS RTL Support

The application uses Tailwind's RTL support:

```css
/* In tailwind.config.js */
module.exports = {
  // ... other config
  future: {
    hoverOnlyWhenSupported: true,
  },
}
```

```jsx
// RTL-aware classes
<div className="text-left rtl:text-right"> {/* Left in LTR, right in RTL */}</div>
<div className="ml-4 rtl:mr-4 rtl:ml-0"> {/* Margin left in LTR, margin right in RTL */}</div>
<div className="float-left rtl:float-right"> {/* Float left in LTR, float right in RTL */}</div>
```

## Translation File Structure

### Translation Key Organization

Translations are organized by feature/page for maintainability:

```json
// common.json - Shared across the app
{
  "submit": "Submit",
  "cancel": "Cancel",
  "loading": "Loading...",
  "error": "Error"
}

// home.json - Home page specific
{
  "heroTitle": "Discover Your Next Adventure",
  "heroSubtitle": "Explore amazing destinations worldwide",
  "featuredDestinations": "Featured Destinations"
}
```

### Naming Conventions

- Use camelCase for key names: `welcomeMessage`
- Use dot notation for nesting: `user.profile.name`
- Use descriptive names: `subscription.upgrade.button` instead of `btnUpgrade`
- Group related keys: `error.`, `success.`, `validation.`

## Adding New Languages

### Step 1: Create Locale Directory

```bash
mkdir -p src/i18n/locales/de
```

### Step 2: Create Translation Files

Copy the structure from an existing language:

```bash
cp -r src/i18n/locales/en/* src/i18n/locales/de/
```

### Step 3: Translate Content

Update all JSON files with German translations:

```json
// src/i18n/locales/de/common.json
{
  "submit": "Einreichen",
  "cancel": "Abbrechen",
  "home": "Startseite"
}
```

### Step 4: Create Index File

```typescript
// src/i18n/locales/de/index.ts
import header from './header.json';
// ... other imports

export default {
  header,
  // ... other exports
};
```

### Step 5: Update Main Configuration

```typescript
// src/i18n/index.ts
import de from './locales/de';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  es: { translation: es },
  zh: { translation: zh },
  ar: { translation: ar },
  de: { translation: de }, // Add German
};
```

### Step 6: Add Language to Header

```typescript
// src/components/Header.tsx
const languages = [
  // ... existing languages
  { code: 'de', label: t('header.german'), flag: '🇩🇪' },
];
```

## Adding New Translation Keys

### Step 1: Add to English Base

```json
// src/i18n/locales/en/common.json
{
  "newFeature": "New Feature",
  "comingSoon": "Coming Soon"
}
```

### Step 2: Update Other Languages

```json
// src/i18n/locales/fr/common.json
{
  "newFeature": "Nouvelle Fonctionnalité",
  "comingSoon": "Bientôt Disponible"
}

// src/i18n/locales/ar/common.json
{
  "newFeature": "ميزة جديدة",
  "comingSoon": "قريباً"
}
```

### Step 3: Update TypeScript Types (Optional)

If using TypeScript with strict typing:

```typescript
// Create a types file for better IntelliSense
declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      common: {
        newFeature: string;
        comingSoon: string;
      };
    };
  }
}
```

## Best Practices

### Translation Key Management

1. **Use Descriptive Keys**: Prefer `user.profile.edit.button` over `editBtn`
2. **Avoid Hardcoded Text**: Never put user-facing text directly in components
3. **Consistent Naming**: Follow established patterns across the codebase
4. **Group Related Keys**: Keep related translations together

### Component Patterns

```typescript
// ✅ Good: Use translation hook
const MyComponent = () => {
  const { t } = useTranslation();
  return <h1>{t('page.title')}</h1>;
};

// ❌ Bad: Hardcoded text
const MyComponent = () => {
  return <h1>Welcome to AfreshTrip</h1>;
};
```

### Performance Considerations

1. **Lazy Loading**: For large translation files, consider code splitting
2. **Namespace Usage**: Use namespaces for large applications
3. **Memoization**: Memoize expensive translation operations

### RTL-Specific Considerations

1. **Test All Languages**: Ensure proper layout in both LTR and RTL
2. **Icon Positioning**: Icons may need different positioning in RTL
3. **Number Formatting**: Use appropriate number formatting for locales
4. **Date Formatting**: Use locale-aware date formatting

## Testing Internationalization

### Unit Tests for Translations

```typescript
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

const TestWrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    {children}
  </I18nextProvider>
);

describe('Translation Tests', () => {
  it('renders translated text', () => {
    const { getByText } = render(
      <TestWrapper>
        <TranslatedComponent />
      </TestWrapper>
    );

    expect(getByText('Welcome')).toBeInTheDocument();
  });
});
```

### Language Switching Tests

```typescript
describe('Language Switching', () => {
  it('changes language correctly', async () => {
    const { i18n } = useTranslation();

    await i18n.changeLanguage('fr');
    expect(i18n.language).toBe('fr');
  });
});
```

## Troubleshooting

### Common Issues

#### Translations Not Loading

1. Check import order in `main.tsx`
2. Verify JSON syntax in translation files
3. Check browser console for i18n errors

#### Language Not Changing

1. Ensure `changeLanguage()` is called correctly
2. Check if language code matches resource keys
3. Verify component re-renders after language change

#### RTL Not Working

1. Check if `i18n.dir()` returns correct direction
2. Verify CSS classes are RTL-aware
3. Test with Arabic content specifically

#### Missing Translations

1. Check if key exists in all language files
2. Verify namespace usage
3. Use fallbackLng configuration

### Debug Mode

Enable i18n debugging:

```typescript
i18n.init({
  // ... other config
  debug: true, // Enable debug logging
});
```

## Deployment Considerations

### Build Optimization

1. **Translation Bundling**: Translations are bundled with the app
2. **Code Splitting**: Consider lazy loading for large translation sets
3. **CDN**: Serve translation files from CDN for better performance

### SEO and Meta Tags

```typescript
// Update meta tags based on language
useEffect(() => {
  document.title = t('page.title');
  document.documentElement.lang = i18n.language;
}, [i18n.language]);
```

## Future Enhancements

### Planned Features

- **Language Detection**: Automatic language detection from browser/user preferences
- **Dynamic Loading**: Load translations on-demand for better performance
- **Translation Management**: Web-based translation editor for non-technical users
- **Pluralization Rules**: Advanced pluralization for complex languages
- **Contextual Translations**: Different translations based on context
- **Machine Translation**: Integration with translation services for rapid localization

### Additional Languages

- German (de)
- Italian (it)
- Portuguese (pt)
- Japanese (ja)
- Korean (ko)
- Hindi (hi)

## Related Documentation

- [React i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
- [Tailwind RTL Support](https://tailwindcss.com/docs/hover-focus-and-other-states#rtl-support)
- [Unicode Bidirectional Algorithm](https://unicode.org/reports/tr9/)