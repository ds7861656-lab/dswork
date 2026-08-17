// src/types/backend.ts

/**
 * BACKEND INTERFACES - These define what MUST be implemented on the server
 *
 * 🚨 SECURITY CRITICAL: These interfaces represent server-side operations that
 * enforce access control. Frontend should NEVER implement these directly.
 *
 * See BACKEND_FRONTEND_SEPARATION.md for detailed migration guide.
 */

import type { FeatureId } from './features';
import type { UserSubscription } from './subscription';

// ============================================================================
// BACKEND: Core Subscription Management
// ============================================================================

export interface BackendSubscriptionService {
  /**
   * Get user's current subscription with full validation
   * BACKEND ONLY: Validates user authentication and subscription status
   */
  getUserSubscription(userId: string): Promise<UserSubscription | null>;

  /**
   * Update user subscription with payment processing
   * BACKEND ONLY: Handles payment, validation, and atomic updates
   */
  updateSubscription(
    userId: string,
    planId: string,
    paymentMethodId?: string
  ): Promise<SubscriptionUpdateResult>;

  /**
   * Cancel user subscription
   * BACKEND ONLY: Handles cancellation logic and notifications
   */
  cancelSubscription(userId: string, reason?: string): Promise<void>;
}

// ============================================================================
// BACKEND: Feature Access Control
// ============================================================================

export interface BackendFeatureService {
  /**
   * Check if user has access to a specific feature
   * BACKEND ONLY: This is the authoritative access check
   */
  checkFeatureAccess(userId: string, featureId: FeatureId): Promise<FeatureAccessResult>;

  /**
   * Get all features accessible to a user
   * BACKEND ONLY: Returns validated feature list
   */
  getUserAccessibleFeatures(userId: string): Promise<FeatureId[]>;

  /**
   * Get upgrade suggestions for inaccessible features
   * BACKEND ONLY: Provides secure upgrade recommendations
   */
  getUpgradeSuggestions(
    userId: string,
    featureIds: FeatureId[]
  ): Promise<Partial<Record<FeatureId, UpgradeSuggestion>>>;
}

// ============================================================================
// BACKEND: API Response Types
// ============================================================================

export interface SubscriptionUpdateResult {
  success: boolean;
  subscription: UserSubscription;
  error?: string;
  requiresPayment?: boolean;
  paymentUrl?: string;
}

export interface FeatureAccessResult {
  hasAccess: boolean;
  featureId: FeatureId;
  userPlan?: string;
  requiredPlans: string[];
  expiresAt?: Date;
  isBeta?: boolean;
  upgradeMessage?: string;
  upgradeSuggestion?: UpgradeSuggestion;
}

export interface UpgradeSuggestion {
  recommendedPlan: string;
  savings?: number;
  features: FeatureId[];
  price: number;
  period: string;
}

// ============================================================================
// BACKEND: API Request/Response Contracts
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

// POST /api/subscriptions/update
export interface UpdateSubscriptionRequest {
  planId: string;
  paymentMethodId?: string;
  promoCode?: string;
}

// ============================================================================
// BACKEND: Middleware Types
// ============================================================================

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role?: string;
  };
}

export interface SubscriptionMiddleware {
  /**
   * Express middleware to check feature access
   * Usage: app.get('/api/premium-feature', checkFeatureAccess('premium_feature'), handler)
   */
  checkFeatureAccess(featureId: FeatureId): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;

  /**
   * Express middleware to check subscription status
   * Usage: app.get('/api/subscribed-only', requireSubscription, handler)
   */
  requireSubscription(req: AuthenticatedRequest, res: Response, next: NextFunction): void;

  /**
   * Express middleware to check active subscription
   * Usage: app.get('/api/active-only', requireActiveSubscription, handler)
   */
  requireActiveSubscription(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
}

type NextFunction = (error?: Error) => void;

// ============================================================================
// BACKEND: Database Models (for reference)
// ============================================================================

export interface DatabaseUserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled' | 'past_due';
  startDate: Date;
  endDate?: Date;
  cancelAtPeriodEnd: boolean;
  paymentMethodId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseFeatureAccessLog {
  id: string;
  userId: string;
  featureId: FeatureId;
  granted: boolean;
  userAgent?: string;
  ipAddress?: string;
  timestamp: Date;
  sessionId?: string;
}

// ============================================================================
// BACKEND: Service Dependencies
// ============================================================================

export interface BackendServices {
  subscriptionService: BackendSubscriptionService;
  featureService: BackendFeatureService;
  paymentService: PaymentService;
  auditService: AuditService;
  notificationService: NotificationService;
}

export interface PaymentService {
  createSubscription(userId: string, planId: string): Promise<PaymentResult>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  processWebhook(data: Record<string, unknown>): Promise<void>;
}

export interface AuditService {
  logFeatureAccess(userId: string, featureId: FeatureId, granted: boolean, metadata?: Record<string, unknown>): Promise<void>;
  logSubscriptionChange(userId: string, oldPlan: string, newPlan: string): Promise<void>;
}

export interface NotificationService {
  sendUpgradeNotification(userId: string, newPlan: string): Promise<void>;
  sendExpirationWarning(userId: string, daysUntilExpiry: number): Promise<void>;
}

export interface PaymentResult {
  success: boolean;
  subscriptionId?: string;
  paymentIntentId?: string;
  clientSecret?: string;
  error?: string;
}

// ============================================================================
// MIGRATION NOTES
// ============================================================================

/**
 * When implementing the backend, follow this migration order:
 *
 * 1. Set up database tables for subscriptions and audit logs
 * 2. Implement authentication middleware
 * 3. Create BackendSubscriptionService with full validation
 * 4. Create BackendFeatureService with access control
 * 5. Add feature access middleware to protected routes
 * 6. Implement payment processing integration
 * 7. Add audit logging for security monitoring
 * 8. Create admin endpoints for subscription management
 * 9. Add comprehensive testing and monitoring
 *
 * Remember: Frontend checks are UX only. Backend enforces security.
 */