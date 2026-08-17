# Subscription System Documentation

This document describes the subscription system implementation in the AfreshTrip frontend application, including feature access control, payment processing, and user management.

## Overview

The AfreshTrip subscription system provides tiered access to premium features, allowing users to unlock advanced trip planning capabilities, exclusive destinations, and VIP support services. The system supports multiple payment methods (Alipay and Stripe) and provides a seamless upgrade experience.

## Architecture

### Core Components

- **UnifiedSubscriptionService**: Single source of truth for all subscription operations
- **Feature Access System**: Controls access to premium features based on subscription level
- **Payment Processing**: Handles Alipay and Stripe payment flows
- **Subscription Management**: User subscription lifecycle management

### Key Files

- `src/services/subscription/UnifiedSubscriptionService.ts` - Main subscription service
- `src/types/subscription.ts` - TypeScript interfaces for subscription data
- `src/config/features.ts` - Feature configuration and access control
- `src/types/features.ts` - Feature type definitions and mappings
- `src/hooks/useFeatureAccess.ts` - React hook for feature access checking
- `src/components/FeatureGate.tsx` - High-level component for conditional feature rendering
- `src/components/FeatureAccessModal.tsx` - UI component for feature protection

## Subscription Plans

The system offers four subscription tiers:

| Plan ID | Name | Duration | Price | Key Features |
|---------|------|----------|-------|--------------|
| `VIP_WEEK` | Week | 7 days | $9.99 | Basic trip planning, limited destinations, email support |
| `VIP_MONTH` | Month | 30 days | $29.99 | Advanced trip planning, unlimited destinations, blog publishing, priority support |
| `VIP_QUARTER` | Quarter | 90 days | $79.99 | Premium trip planning, VIP destinations, premium content |
| `VIP_YEAR` | Year | 365 days | $299.99 | Ultimate trip planning, exclusive destinations, phone support, dedicated concierge |

## Feature Access Control

### Feature Categories

The system organizes features into five main categories:

#### Planning Features
- `basic_trip_planning`: Create and manage basic trip itineraries
- `advanced_trip_planning`: Advanced trip planning with detailed customization
- `premium_trip_planning`: Premium trip planning with expert recommendations
- `ultimate_trip_planning`: Ultimate trip planning with concierge service

#### Destination Access
- `limited_destinations`: Access to popular destinations
- `unlimited_destinations`: Access to all destinations worldwide
- `vip_destinations`: Access to VIP and exclusive locations
- `exclusive_destinations`: Access to ultra-exclusive and private locations

#### Support Features
- `email_support`: Standard email support
- `priority_email_support`: Priority email support with faster response times
- `phone_support`: Round-the-clock phone support
- `dedicated_concierge`: Personal concierge service

#### Platform Access
- `mobile_app_access`: Access to mobile applications

#### Content Features
- `blog_publishing`: Publish and manage blog posts
- `premium_content`: Access to premium content and guides
- `exclusive_tours`: Access to exclusive and private tours

### Feature-to-Plan Mapping

Each feature is mapped to the subscription plans that provide access:

```typescript
const FEATURE_PLAN_MAPPING: Record<FeatureId, string[]> = {
  [FeatureId.BASIC_TRIP_PLANNING]: ['week', 'month', 'quarter', 'year'],
  [FeatureId.ADVANCED_TRIP_PLANNING]: ['month', 'quarter', 'year'],
  [FeatureId.PREMIUM_TRIP_PLANNING]: ['quarter', 'year'],
  [FeatureId.ULTIMATE_TRIP_PLANNING]: ['year'],
  // ... additional mappings
};
```

## Implementation Details

### Unified Subscription Service

The `UnifiedSubscriptionService` provides a unified interface for all subscription operations:

```typescript
export class UnifiedSubscriptionService {
  // Get user's current subscription
  async getUserSubscription(userId: string): Promise<UserSubscription | null>

  // Get available subscription plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]>

  // Initiate VIP subscription purchase
  async purchaseVip(userId: string, planId: string, paymentMethod: 'alipay' | 'stripe'): Promise<PaymentInitiationResult>

  // Check payment status
  async checkPaymentStatus(orderNo: string): Promise<PaymentStatusResult>

  // Handle payment completion
  async handlePaymentReturn(userId: string, orderNo: string): Promise<{success: boolean, subscription?: UserSubscription | null, error?: string}>

  // Cancel subscription
  async cancelSubscription(userId: string, reason?: string): Promise<void>

  // Get VIP orders history
  async getVipOrders(params?: { current?: number; size?: number })

  // Cancel VIP order
  async cancelVipOrder(orderNo: string): Promise<boolean>

  // Activate free trial
  async activateFreeTrial(): Promise<{success: boolean, message?: string, error?: string}>
}
```

### Using the Subscription System

#### Checking Feature Access

Use the `useFeatureAccess` hook to check if a user has access to specific features:

```typescript
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import { FeatureId } from '../types/features';

const MyComponent = () => {
  const { checkFeatureAccess, hasFeatureAccess } = useFeatureAccess();

  const handleAdvancedPlanning = async () => {
    const hasAccess = await hasFeatureAccess(FeatureId.ADVANCED_TRIP_PLANNING);
    if (!hasAccess) {
      // Show upgrade modal or redirect to subscription page
      return;
    }
    // Proceed with advanced planning
  };

  return (
    <button onClick={handleAdvancedPlanning}>
      Create Advanced Trip Plan
    </button>
  );
};
```

#### Protecting Features with UI Components

Use the `FeatureGate` component for declarative feature protection:

```typescript
import { FeatureGate } from '../components/FeatureGate';
import { FeatureId } from '../types/features';

const TripPlanner = () => {
  return (
    <FeatureGate feature={FeatureId.ADVANCED_TRIP_PLANNING}>
      <AdvancedTripPlanner />
    </FeatureGate>
  );
};
```

The `FeatureGate` component supports two restriction modes:
- `'hide'` (default): Completely removes content from the DOM for security
- `'blur'`: Shows blurred content with an upgrade overlay for better UX

For manual control, use the `FeatureAccessModal` component:

```typescript
import { FeatureAccessModal } from '../components/FeatureAccessModal';

const TripPlanner = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { hasFeatureAccess } = useFeatureAccess();

  const handleCreateTrip = async () => {
    const hasAccess = await hasFeatureAccess(FeatureId.ADVANCED_TRIP_PLANNING);
    if (!hasAccess) {
      setShowUpgradeModal(true);
      return;
    }
    // Create trip
  };

  return (
    <>
      <button onClick={handleCreateTrip}>
        Create Trip
      </button>
      <FeatureAccessModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureId={FeatureId.ADVANCED_TRIP_PLANNING}
      />
    </>
  );
};
```

#### Subscription Management

Use the `useSubscription` hook for subscription operations:

```typescript
import { useSubscription } from '../hooks/useSubscription';

const SubscriptionManager = () => {
  const {
    userSubscription,
    plans,
    handlePlanSelect,
    handlePlanUpdate
  } = useSubscription();

  const handleUpgrade = (planId: string) => {
    handlePlanSelect(planId);
    // This will initiate the payment flow
  };

  return (
    <div>
      {plans.map(plan => (
        <button key={plan.planId} onClick={() => handleUpgrade(plan.planId)}>
          Upgrade to {plan.planName}
        </button>
      ))}
    </div>
  );
};
```

## Payment Processing

### Supported Payment Methods

The system supports two payment methods:

1. **Alipay**: Popular in China, used for Chinese users
2. **Stripe**: International payment processor for global users

### Payment Flow

1. **Initiation**: User selects plan and payment method
2. **Redirect/Embed**: User is redirected to payment provider or payment form is embedded
3. **Completion**: Payment status is verified and subscription is activated
4. **Confirmation**: User receives confirmation and gains access to features

### Payment Initiation

```typescript
const result = await unifiedSubscriptionService.purchaseVip(
  userId,
  'month',
  'alipay' // or 'stripe'
);

if (result.success) {
  if (result.paymentHtml) {
    // For Alipay: render HTML in popup/modal
  } else if (result.clientSecret) {
    // For Stripe: use client secret with Stripe Elements
  }
}
```

### Payment Verification

```typescript
const statusResult = await unifiedSubscriptionService.checkPaymentStatus(orderNo);
if (statusResult.success && statusResult.isPaid) {
  // Payment successful, activate subscription
  const subscription = await unifiedSubscriptionService.getUserSubscription(userId);
}
```

## API Integration

### Backend Endpoints

#### Subscription Management
- `GET /api/v1/payments/subscription` - Get user's current subscription
- `GET /api/v1/features/subscription-plans` - Get available plans

#### Payment Processing
- `POST /api/v1/payments/initiate` - Initiate payment
- `GET /api/v1/payments/status/{orderNo}` - Check payment status
- `DELETE /api/v1/payments/subscription` - Cancel subscription

#### Orders
- `GET /api/v1/payments/orders` - Get order history
- `DELETE /api/v1/payments/orders/{orderNo}` - Cancel order

#### Free Trial
- `POST /api/v1/payments/free-trial` - Activate free trial

### Feature Access API

The backend provides feature access validation:

```typescript
// Check feature access
POST /api/v1/features/check-access
{
  "userId": "user123",
  "featureId": "advanced_trip_planning"
}

// Response
{
  "hasAccess": true,
  "feature": {...},
  "userPlan": "month",
  "requiredPlans": ["month", "quarter", "year"]
}
```

## Security Considerations

### Client-Side Access Control

⚠️ **Important**: Client-side feature access checking provides UX enhancement only. All access control are and should ALWAYS be enforced on the backend.

The `useFeatureAccess` hook should be used for:
- Hiding/showing UI elements
- Displaying upgrade prompts
- User experience optimization

Never rely on client-side checks for security.

### Backend Validation

All protected endpoints must validate feature access server-side:

```typescript
// Backend middleware example
const validateFeatureAccess = (featureId: string) => {
  return (req, res, next) => {
    const userPlan = getUserSubscription(req.user.id);
    const hasAccess = checkFeatureAccess(userPlan, featureId);

    if (!hasAccess) {
      return res.status(403).json({
        error: 'Feature not available in current plan'
      });
    }

    next();
  };
};
```

## User Experience Flow

### Subscription Upgrade Flow

1. **Feature Discovery**: User attempts to access premium feature
2. **Access Check**: System checks current subscription level
3. **Upgrade Prompt**: If access denied, show upgrade modal with plan comparison
4. **Plan Selection**: User selects desired plan
5. **Payment Method**: User chooses payment method (Alipay/Stripe)
6. **Payment Processing**: User completes payment
7. **Activation**: Subscription is activated immediately
8. **Access Granted**: User can now access the feature

### Subscription Management

Users can manage their subscriptions through the profile section:
- View current plan and benefits
- Upgrade to higher tiers
- Cancel subscriptions
- View payment history
- Download invoices

## Configuration

### Environment Variables

```bash
# API Base URLs
VITE_API_BASE_URL=http://localhost:8080
VITE_GCP_BACKEND_URL=https://afreshtrip-backend-550030138351.europe-west1.run.app
VITE_ALIYUN_BACKEND_URL=no_backend_deployed_yet

# Payment Configuration
# (Configured in backend)
```

### Feature Configuration

Features are configured in `src/config/features.ts`:

```typescript
export const FEATURE_CONFIG: Record<FeatureId, FeatureConfig> = {
  [FeatureId.ADVANCED_TRIP_PLANNING]: {
    id: FeatureId.ADVANCED_TRIP_PLANNING,
    enabled: true,
    beta: false,
    requiresAuth: true,
    premiumOnly: true,
    description: 'Advanced trip planning with detailed customization',
    upgradePrompt: 'Upgrade to Month plan for advanced trip planning',
  },
  // ... additional features
};
```

## Testing

### Unit Tests

Test subscription service methods:

```typescript
describe('UnifiedSubscriptionService', () => {
  it('should get user subscription', async () => {
    const service = new UnifiedSubscriptionService();
    const subscription = await service.getUserSubscription('user123');
    expect(subscription).toBeDefined();
  });

  it('should initiate payment', async () => {
    const result = await service.purchaseVip('user123', 'month', 'alipay');
    expect(result.success).toBe(true);
  });
});
```

### Feature Access Tests

Test feature access logic:

```typescript
describe('useFeatureAccess', () => {
  it('should grant access to basic features', async () => {
    const { hasFeatureAccess } = renderHook(() => useFeatureAccess());
    const hasAccess = await hasFeatureAccess(FeatureId.BASIC_TRIP_PLANNING);
    expect(hasAccess).toBe(true);
  });
});
```

### Integration Tests

Test complete subscription flows:

```typescript
describe('Subscription Flow', () => {
  it('should complete subscription purchase', async () => {
    // Mock payment initiation
    // Mock payment completion
    // Verify subscription activation
    // Verify feature access
  });
});
```

## Monitoring and Analytics

### Key Metrics

- Subscription conversion rates
- Feature usage by plan tier
- Payment success/failure rates
- Churn rates by plan
- Upgrade/downgrade patterns

### Error Tracking

Monitor for:
- Payment failures
- Feature access errors
- Subscription activation issues
- API timeout errors

## Troubleshooting

### Common Issues

#### Payment Failures
- Check payment method configuration
- Verify API keys for payment providers
- Check network connectivity
- Validate user region restrictions

#### Feature Access Denied
- Verify user subscription status
- Check FEATURE_PLAN_MAPPING configuration
- Validate backend feature access API
- Check for authentication issues

#### Subscription Not Activating
- Verify payment completion
- Check webhook configurations
- Validate backend subscription creation
- Check for duplicate subscription handling

### Debug Mode

Enable debug logging for subscription operations:

```typescript
// In development
console.log('Subscription debug:', {
  userId,
  planId,
  paymentMethod,
  orderNo
});
```

## Future Enhancements

### Planned Features

- **Prorated Upgrades**: Allow mid-cycle plan changes with proration
- **Subscription Gifting**: Allow users to gift subscriptions
- **Team Plans**: Multi-user subscription plans
- **Usage Analytics**: Detailed feature usage tracking
- **Custom Plans**: Tailored subscription plans for enterprise users

### Payment Method Expansion

- **WeChat Pay**: Additional payment option for Chinese users
- **Apple Pay/Google Pay**: Mobile payment integration
- **Cryptocurrency**: Digital currency payment options

### Advanced Features

- **Subscription Analytics**: Detailed usage and engagement metrics
- **A/B Testing**: Test different pricing and feature combinations
- **Dynamic Pricing**: Region-based or demand-based pricing
- **Loyalty Program**: Rewards for long-term subscribers

## Dependencies

### Frontend Dependencies

```json
{
  "@stripe/stripe-js": "^1.54.0",
  "react-hook-form": "^7.45.0",
  "@tanstack/react-query": "^4.29.0"
}
```

### Backend Dependencies

- Payment processing libraries (Stripe SDK, Alipay SDK)
- Database for subscription storage
- Webhook handlers for payment confirmation
- Feature access validation middleware

## Related Documentation

- [Authentication Guide](authentication.md) - User authentication system
- [Deployment Guide](deployment.md) - Application deployment process
- [API Documentation](../src/services/api/README.md) - Backend API reference
- [Component Library](../src/components/) - UI components reference