// src/services/api/errors.ts

/**
 * API Error handling module
 */

export class ApiError extends Error {
  public code: number;
  public data?: unknown;

  constructor(message: string, code: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.data = data;
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication required') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network error occurred') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ApiError {
  constructor(message = 'Request timeout') {
    super(message, 408);
    this.name = 'TimeoutError';
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation failed', data?: unknown) {
    super(message, 422, data);
    this.name = 'ValidationError';
  }
}

export class SubscriptionRequiredError extends ApiError {
  constructor(message = 'Subscription required for this feature') {
    super(message, 403);
    this.name = 'SubscriptionRequiredError';
  }
}

/**
 * Error type guards
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isAuthenticationError(error: unknown): error is AuthenticationError {
  return error instanceof AuthenticationError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

export function isTimeoutError(error: unknown): error is TimeoutError {
  return error instanceof TimeoutError;
}

export function isSubscriptionRequiredError(error: unknown): error is SubscriptionRequiredError {
  return error instanceof SubscriptionRequiredError;
}

/**
 * Create error from HTTP response
 */
export function createErrorFromResponse(
  response: Response,
  errorData?: unknown
): ApiError {
  const message = (errorData as { message?: string })?.message || `HTTP ${response.status}`;
  return new ApiError(message, response.status, errorData);
}

/**
 * Create error from API response data
 */
export function createErrorFromApiResponse(data: { code: number; message: string }): ApiError {
  return new ApiError(data.message || 'API Error', data.code, data);
}