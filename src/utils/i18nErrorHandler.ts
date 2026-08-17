// src/utils/i18nErrorHandler.ts

// import { useTranslation } from 'react-i18next';
import { ApiError, AuthenticationError, NetworkError, TimeoutError, ValidationError, SubscriptionRequiredError } from '../services/api/errors';
import type { SnackbarAction } from '../components/ui/Snackbar';

export interface ErrorContext {
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

export interface ErrorMessage {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  retryable: boolean;
  actions?: SnackbarAction[];
}

export class I18nErrorHandler {
  private static instance: I18nErrorHandler;
  private snackbarMethods: {
    showError: (message: string, actions?: SnackbarAction[], duration?: number) => void;
    showSuccess: (message: string, actions?: SnackbarAction[], duration?: number) => void;
    showWarning: (message: string, actions?: SnackbarAction[], duration?: number) => void;
    showInfo: (message: string, actions?: SnackbarAction[], duration?: number) => void;
  } | null = null;

  static getInstance(): I18nErrorHandler {
    if (!I18nErrorHandler.instance) {
      I18nErrorHandler.instance = new I18nErrorHandler();
    }
    return I18nErrorHandler.instance;
  }

  initializeSnackbar(methods: I18nErrorHandler['snackbarMethods']) {
    this.snackbarMethods = methods;
  }

  // Main error handling method with internationalization
  handleError(error: unknown, context: ErrorContext = {}, t?: (key: string) => string): ErrorMessage {
    console.error('Error occurred:', error, 'Context:', context);

    if (!this.snackbarMethods) {
      console.warn('Snackbar methods not initialized. Error will be logged but not displayed to user.');
      return this.getGenericErrorMessage(error, t);
    }

    // Handle different error types
    if (error instanceof ApiError) {
      return this.handleApiError(error, context, t);
    } else if (error instanceof AuthenticationError) {
      return this.handleAuthenticationError(error, context, t);
    } else if (error instanceof NetworkError) {
      return this.handleNetworkError(error, context, t);
    } else if (error instanceof TimeoutError) {
      return this.handleTimeoutError(error, context, t);
    } else if (error instanceof ValidationError) {
      return this.handleValidationError(error, context, t);
    } else if (error instanceof SubscriptionRequiredError) {
      return this.handleSubscriptionRequiredError(error, context, t);
    } else if (error instanceof Error) {
      return this.handleGenericError(error, context, t);
    } else {
      return this.handleUnknownError(error, context, t);
    }
  }

  // Show error to user with snackbar
  showErrorToUser(error: unknown, context: ErrorContext = {}, customActions?: SnackbarAction[], t?: (key: string) => string) {
    const errorMessage = this.handleError(error, context, t);
    
    // Create actions for the error
    const actions: SnackbarAction[] = [];
    
    if (errorMessage.retryable) {
      actions.push({
        label: t?.('common.retry') || 'Error: Translation missing',
        onClick: () => {
          // This would need to be implemented based on context
          console.log('Retry action clicked for:', context);
        },
        style: 'primary'
      });
    }

    if (customActions) {
      actions.push(...customActions);
    }

    // Show the error
    this.snackbarMethods?.showError(errorMessage.description, actions, this.getSeverityDuration(errorMessage.severity));

    return errorMessage;
  }

  private handleApiError(error: ApiError, _context: ErrorContext, t?: (key: string) => string): ErrorMessage {
    const { code } = error;

    switch (code) {
      case 400:
        return {
          title: t?.('error.invalidRequest') || 'Error: Translation missing',
          description: t?.('error.badRequest') || 'Error: Translation missing',
          severity: 'medium',
          retryable: true
        };
      case 401:
        return {
          title: t?.('error.authenticationRequired') || 'Error: Translation missing',
          description: t?.('error.loginRequired') || 'Error: Translation missing',
          severity: 'high',
          retryable: false
        };
      case 403:
        return {
          title: t?.('error.accessDenied') || 'Error: Translation missing',
          description: t?.('error.noPermission') || 'Error: Translation missing',
          severity: 'high',
          retryable: false
        };
      case 404:
        return {
          title: t?.('error.notFound') || 'Error: Translation missing',
          description: t?.('error.resourceNotFound') || 'Error: Translation missing',
          severity: 'medium',
          retryable: true
        };
      case 422:
        return {
          title: t?.('error.validationError') || 'Error: Translation missing',
          description: error.message || t?.('error.invalidData') || 'Error: Translation missing',
          severity: 'medium',
          retryable: true
        };
      case 429:
        return {
          title: t?.('error.rateLimited') || 'Error: Translation missing',
          description: t?.('error.tooManyRequests') || 'Error: Translation missing',
          severity: 'medium',
          retryable: true
        };
      case 500:
        return {
          title: t?.('error.serverError') || 'Error: Translation missing',
          description: t?.('error.somethingWentWrong') || 'Error: Translation missing',
          severity: 'high',
          retryable: true
        };
      case 502:
      case 503:
      case 504:
        return {
          title: t?.('error.serviceUnavailable') || 'Error: Translation missing',
          description: t?.('error.tryAgainLater') || 'Error: Translation missing',
          severity: 'high',
          retryable: true
        };
      default:
        return {
          title: t?.('error.requestFailed') || 'Error: Translation missing',
          description: error.message || t?.('error.unexpectedError') || 'Error: Translation missing',
          severity: 'medium',
          retryable: code >= 500
        };
    }
  }

  private handleAuthenticationError(_error: AuthenticationError, _context: ErrorContext, t?: (key: string) => string): ErrorMessage {
    return {
      title: t?.('error.authenticationRequired') || 'Error: Translation missing',
      description: t?.('error.pleaseLogin') || 'Error: Translation missing',
      severity: 'high',
      retryable: false
    };
  }

  private handleNetworkError(_error: NetworkError, _context: ErrorContext, t?: (key: string) => string): ErrorMessage {
    return {
      title: t?.('error.networkError') || 'Error: Translation missing',
      description: t?.('error.checkConnection') || 'Error: Translation missing',
      severity: 'medium',
      retryable: true
    };
  }

  private handleTimeoutError(_error: TimeoutError, _context: ErrorContext, t?: (key: string) => string): ErrorMessage {
    return {
      title: t?.('error.requestTimeout') || 'Error: Translation missing',
      description: t?.('error.timeoutDescription') || 'Error: Translation missing',
      severity: 'medium',
      retryable: true
    };
  }

  private handleValidationError(error: ValidationError, _context: ErrorContext, t?: (key: string) => string): ErrorMessage {
    return {
      title: t?.('error.invalidData') || 'Error: Translation missing',
      description: error.message || t?.('error.checkInput') || 'Error: Translation missing',
      severity: 'low',
      retryable: true
    };
  }

  private handleSubscriptionRequiredError(error: SubscriptionRequiredError, _context: ErrorContext, t?: (key: string) => string): ErrorMessage {
    return {
      title: t?.('error.subscriptionRequired') || 'Error: Translation missing',
      description: error.message || t?.('error.upgradeRequired') || 'Error: Translation missing',
      severity: 'medium',
      retryable: false
    };
  }

  private handleGenericError(error: Error, context: ErrorContext, t?: (key: string) => string): ErrorMessage {
    // Check for specific error patterns
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return this.handleNetworkError(new NetworkError(error.message), context, t);
    }
    
    if (message.includes('timeout')) {
      return this.handleTimeoutError(new TimeoutError(error.message), context, t);
    }

    if (message.includes('auth') || message.includes('login')) {
      return this.handleAuthenticationError(new AuthenticationError(error.message), context, t);
    }

    return {
      title: t?.('error.error') || 'Error',
      description: error.message || t?.('error.unexpectedError') || 'Error: Translation missing',
      severity: 'medium',
      retryable: true
    };
  }

  private handleUnknownError(_error: unknown, _context: ErrorContext, t?: (key: string) => string): ErrorMessage {
    return {
      title: t?.('error.unexpectedError') || 'Error: Translation missing',
      description: t?.('error.somethingWentWrong') || 'Error: Translation missing',
      severity: 'medium',
      retryable: true
    };
  }

  private getGenericErrorMessage(_error: unknown, t?: (key: string) => string): ErrorMessage {
    return {
      title: t?.('error.error') || 'Error',
      description: t?.('error.unexpectedError') || 'Error: Translation missing',
      severity: 'medium',
      retryable: true
    };
  }

  private getSeverityDuration(severity: ErrorMessage['severity']): number {
    switch (severity) {
      case 'low':
        return 3000;
      case 'medium':
        return 5000;
      case 'high':
        return 8000;
      case 'critical':
        return 0; // No auto-close
      default:
        return 5000;
    }
  }

  // Utility methods for common error scenarios
  static createRetryAction(onRetry: () => void, t?: (key: string) => string): SnackbarAction {
    return {
      label: t?.('common.retry') || 'Error: Translation missing',
      onClick: onRetry,
      style: 'primary'
    };
  }

  static createDismissAction(t?: (key: string) => string): SnackbarAction {
    return {
      label: t?.('common.dismiss') || 'Error: Translation missing',
      onClick: () => console.log('Error dismissed'),
      style: 'default'
    };
  }

  static createContactSupportAction(t?: (key: string) => string): SnackbarAction {
    return {
      label: t?.('common.contactSupport') || 'Error: Translation missing',
      onClick: () => {
        // This would typically open a support contact form or email
        window.open('mailto:support@example.com', '_blank');
      },
      style: 'default'
    };
  }
}

// Export singleton instance
export const i18nErrorHandler = I18nErrorHandler.getInstance();