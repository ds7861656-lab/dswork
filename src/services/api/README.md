# Refactored API Client Structure

## Overview

The `apiClient.ts` has been refactored from a monolithic 900+ line file into a modular, maintainable architecture using the composition pattern.

## New Structure

```
src/services/api/
├── errors.ts          # Error handling classes and utilities
├── httpClient.ts      # Base HTTP client with auth and request methods
├── authService.ts     # Authentication-related endpoints
├── userService.ts     # User management endpoints
├── blogService.ts     # Blog-related endpoints
├── paymentService.ts  # Payment and VIP endpoints
└── index.ts          # Barrel exports for clean imports

src/types/
└── api.ts            # All API types and interfaces

src/services/
└── apiClient.ts      # Main client that composes all services
```

## Key Improvements

### 1. **Separation of Concerns**
- **Core HTTP Logic**: Isolated in `httpClient.ts`
- **Error Handling**: Dedicated `errors.ts` module
- **Service Modules**: Each domain has its own service
- **Types**: Centralized in `api.ts`

### 2. **Composition Pattern**
The main `ApiClient` now composes individual service modules:
```typescript
export class ApiClient {
  private readonly auth: AuthService;
  private readonly user: UserService;
  private readonly blog: BlogService;
  private readonly payment: PaymentService;

  constructor(baseUrl: string = API_BASE_URL) {
    this.auth = new AuthService(baseUrl);
    this.user = new UserService(baseUrl);
    this.blog = new BlogService(baseUrl);
    this.payment = new PaymentService(baseUrl);
  }
}
```

### 3. **Enhanced Error Handling**
```typescript
export class ApiError extends Error {
  public code: number;
  public data?: unknown;
}

export class AuthenticationError extends ApiError { /* ... */ }
export class NetworkError extends ApiError { /* ... */ }
export class TimeoutError extends ApiError { /* ... */ }
```

### 4. **Backwards Compatibility**
All existing method calls continue to work through delegation:
- `apiClient.getBlogList()` → calls `blog.getBlogs()`
- `apiClient.createBlogPost()` → calls `blog.createBlog()`
- All types re-exported for compatibility

### 5. **Type Safety**
- Proper TypeScript interfaces for all API responses
- Generic HTTP methods with type safety
- Separate type definitions from implementation

## Usage Examples

### Individual Service Usage
```typescript
import { AuthService } from './api/authService';

const authService = new AuthService('http://localhost:8080');
const isAuthenticated = await authService.isAuthenticated();
```

### Main API Client Usage
```typescript
import { apiClient } from './services/apiClient';

// New recommended way
const user = await apiClient.getUserInfo();
const blogs = await apiClient.getBlogs(1, 10);

// Backwards compatibility (deprecated)
const blogs = await apiClient.getBlogList(1, 10);
```

### Import Patterns
```typescript
// Recommended: Import specific services
import { AuthService, UserService } from './api';

// Type imports
import type { User, BlogVo } from './types/api';

// Main client
import { apiClient } from './services/apiClient';
```

## Migration Benefits

1. **Maintainability**: Easy to modify individual services without affecting others
2. **Testability**: Each service can be tested independently
3. **Reusability**: Services can be imported and used individually
4. **Scalability**: Easy to add new services or modify existing ones
5. **Type Safety**: Better TypeScript support with proper interfaces
6. **Error Handling**: Centralized, consistent error management

## Development Guidelines

### Adding New Endpoints
1. Add types to `src/types/api.ts`
2. Create service method in appropriate service module
3. Add delegation method to main `ApiClient` if needed
4. Update backwards compatibility methods if required

### Error Handling
- Use specific error types (`AuthenticationError`, `NetworkError`, etc.)
- Handle API-level errors in HTTP client
- Let errors bubble up with proper context

### Testing Strategy
- Test individual services independently
- Mock HTTP client for service tests
- Integration test main API client composition