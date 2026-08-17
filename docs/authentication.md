# Authentication System Documentation

This document describes the authentication system implemented in the AfreshTrip frontend application, which supports different authentication methods for international and Chinese users.

## Overview

The application uses a dual authentication system:

- **International Users**: Firebase Authentication for email/password and Google sign-in
- **Chinese Users**: Custom authentication via SMS and email verification codes through backend APIs

The system is designed to comply with regional regulations and user preferences while maintaining a unified user experience.

## Architecture

### AuthContext

The `AuthContext` provides authentication state management and methods:

- **Firebase Auth**: Used for international users when `VITE_IS_CHINESE_VERSION=false`
- **Custom Auth**: Used for Chinese users when `VITE_IS_CHINESE_VERSION=true`
- **Unified Interface**: Both systems expose the same methods for login, logout, and profile management

### User Types

```typescript
export type AuthUser = User | CustomUser;

interface CustomUser {
  uid: string;
  email?: string;
  phone?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  isCustomAuth: true;
  metadata?: {
    creationTime: string;
  };
}
```

## Authentication Methods

### International Authentication (Firebase)

#### Email/Password Authentication
- **Registration**: `createUserWithEmailAndPassword`
- **Login**: `signInWithEmailAndPassword`
- **Component**: `LoginForm.tsx`

#### Google Sign-In
- **Provider**: Google Auth Provider
- **Method**: `signInWithPopup`
- **Component**: `LoginForm.tsx` (Google button)

### Chinese Authentication (Custom)

#### SMS Phone Verification
- **Send Code**: `apiClient.sendSmsCode(phone)`
- **Verify Code**: `apiClient.verifySmsCode(phone, code)`
- **Component**: `PhoneLogin.tsx`
- **Supported Regions**: Currently +86 (China), extensible to +852, +853, +886

#### Email Code Verification
- **Send Code**: `apiClient.sendEmailCode(email)`
- **Verify Code**: `apiClient.verifyEmailCode(email, code)`
- **Component**: `ChineseLoginForm.tsx`

#### QR Code Login (Mock Implementation)
- **Providers**: WeChat, Alipay
- **Component**: `QRCodeLogin.tsx`
- **Status**: Currently uses mock services, requires backend integration

## Components

### LoginForm.tsx
- Handles email/password and Google authentication
- Supports registration and login modes
- International users only

### PhoneLogin.tsx
- SMS-based authentication for Chinese users
- Region code selection (currently +86)
- Terms agreement checkbox
- Rate limiting with countdown timer

### ChineseLoginForm.tsx
- Email-based authentication for Chinese users
- Two-step process: send code → verify code
- Terms agreement checkbox

### QRCodeLogin.tsx
- QR code display for WeChat/Alipay
- Mock polling implementation
- Visual feedback for scan states

### AuthTabs.tsx
- Tab navigation between phone, email, and QR methods
- Chinese interface only

## API Integration

### Backend Endpoints

#### SMS Authentication
```typescript
// Send SMS code
POST /api/auth/send-sms
{
  "phone": "+861234567890"
}

// Verify SMS code
POST /api/auth/verify-sms
{
  "phone": "+861234567890",
  "code": "123456"
}
```

#### Email Authentication
```typescript
// Send email code
POST /api/auth/send-email
{
  "email": "user@example.com"
}

// Verify email code
POST /api/auth/verify-email
{
  "email": "user@example.com",
  "code": "123456"
}
```

### Firebase Configuration

Environment variables required for Firebase:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## Security Considerations

### International Users
- Firebase handles security best practices
- Email verification available
- Secure token management
- Rate limiting through Firebase

### Chinese Users
- JWT tokens stored in localStorage
- Custom user data persistence
- Backend validation for all auth operations
- SMS/email code expiration (typically 5-10 minutes)

### General Security
- Environment variables for sensitive configuration
- No hardcoded credentials
- Secure logout clears all stored tokens
- HTTPS required for production

## Configuration

### Environment-Based Switching

The authentication method is determined by `VITE_IS_CHINESE_VERSION`:

```typescript
const isChineseVersion = import.meta.env.VITE_IS_CHINESE_VERSION === 'true';

if (!isChineseVersion) {
  // Initialize Firebase Auth
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setFirebaseUser(user);
  });
} else {
  // Use custom auth
  // Load from localStorage
}
```

### Build-Time Configuration

Different `.env` files for different deployments:
- `.env.international`: `VITE_IS_CHINESE_VERSION=false`
- `.env.chinese`: `VITE_IS_CHINESE_VERSION=true`

## User Experience Flow

### International Login
1. User selects email/password or Google
2. Firebase handles authentication
3. User profile fetched from backend
4. Redirect to dashboard

### Chinese SMS Login
1. User enters phone number
2. SMS code sent via backend
3. User enters verification code
4. JWT token stored locally
5. Custom user object created
6. Redirect to dashboard

### Chinese Email Login
1. User enters email address
2. Verification code sent to email
3. User enters code
4. Authentication completed
5. Redirect to dashboard

## Error Handling

### Firebase Errors
- Translated using `i18nErrorHandler`
- User-friendly messages
- Component-specific error logging

### Custom Auth Errors
- Backend error codes mapped to user messages
- Snackbar notifications
- Form validation feedback

## Future Enhancements

### Alipay Integration
- Implement `loginWithAlipay()` method
- Backend API integration
- QR code generation and verification

### WeChat Integration
- Implement `loginWithWeChat()` method
- WeChat OAuth integration
- Mini-program support

### Enhanced Security
- Biometric authentication
- Device fingerprinting
- Advanced rate limiting

### Multi-Region Support
- Expand SMS support to more regions
- Localized authentication flows
- Regional compliance updates

## Testing

### Unit Tests
- AuthContext methods
- Component rendering and interactions
- Form validation

### Integration Tests
- Firebase authentication flow
- Backend API calls
- Token persistence

### E2E Tests
- Complete login flows
- Error scenarios
- Cross-browser compatibility

## Troubleshooting

### Common Issues

#### Firebase Auth Not Working
- Check Firebase configuration
- Verify environment variables
- Ensure VPN for Chinese users if needed

#### SMS Codes Not Received
- Check phone number format
- Verify backend SMS service
- Check rate limiting

#### Token Expiration
- Implement token refresh logic
- Handle 401 responses gracefully
- Clear invalid tokens

#### Environment Switching
- Ensure correct `.env` file is used
- Check build configuration
- Verify VITE_IS_CHINESE_VERSION value

## Dependencies

### Firebase
- `firebase/auth`: Authentication services
- `firebase/app`: Core Firebase functionality

### UI Libraries
- `react-hook-form`: Form handling
- `lucide-react`: Icons

### Utilities
- `react-router-dom`: Navigation
- `@tanstack/react-query`: Data fetching and caching

## Related Documentation

- [Deployment Guide](deployment.md)
- [API Documentation](../api/)
- [Firebase Console](https://console.firebase.google.com/)
- [Backend Authentication APIs](../backend/auth/)
