# Documentation

This folder contains documentation for the AfreshTrip frontend application.

## Guides

- [International Setup Guide](international-setup.md) - Internationalization and multi-language support
- [Subscription Guide](subscription.md) - Subscription system implementation and feature access control
- [Deployment Guide](deployment.md) - How to deploy the application to Firebase and Aliyun OSS
- [Authentication Guide](authentication.md) - Authentication system and user login flows

## Development

- [API Reference](../src/types/api.ts) - TypeScript interfaces for API responses
- [Component Library](../src/components/) - Reusable UI components
- [Internationalization](../src/i18n/) - Multi-language support and translations
- [Subscription System](../src/services/subscription/) - Subscription and feature access implementation

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see deployment guide)
4. Start development server: `npm run dev`

For deployment instructions, see [deployment.md](deployment.md).

For authentication setup, see [authentication.md](authentication.md).

For internationalization setup, see [international-setup.md](international-setup.md).

## Project Structure

- `src/` - Source code
- `public/` - Static assets
- `docs/` - Documentation
- `legacy/` - Legacy code (HTML/CSS/JS)

## Contributing

When adding new features, please update the relevant documentation and ensure all authentication flows are tested for both international and Chinese users. For subscription-related features, verify that feature access controls are properly implemented and tested across all subscription tiers. For new UI text, add translation keys to all supported languages following the established patterns in the i18n system.