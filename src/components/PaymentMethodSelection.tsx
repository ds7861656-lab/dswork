// src/components/PaymentMethodSelection.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { SubscriptionPlan } from '../types/subscription';

interface PaymentMethodSelectionProps {
  plan: SubscriptionPlan;
  isOpen: boolean;
  onClose: () => void;
  onSelectPaymentMethod: (paymentMethod: 'alipay' | 'stripe') => void;
  isLoading?: boolean;
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  plan,
  isOpen,
  onClose,
  onSelectPaymentMethod,
  isLoading = false
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const getPeriodKey = (durationDays: number): string => {
    switch (durationDays) {
      case 7: return 'week';
      case 30: return 'month';
      case 90: return 'quarter';
      case 365: return 'year';
      default: return 'custom';
    }
  };

  const handlePaymentMethodSelect = (paymentMethod: 'alipay' | 'stripe') => {
    onSelectPaymentMethod(paymentMethod);
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-gray-900/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 pr-8">
            {t('subscription.selectPaymentMethod')}
          </h2>
          <p className="text-gray-600">
            {t('subscription.selectedPlan')}: {plan.planName}
          </p>
          <p className="text-lg font-semibold text-teal-600 mt-2">
            ${plan.price} /{getPeriodKey(plan.durationDays) === 'custom' ? `${plan.durationDays} ${t('subscription.periods.days')}` : t(`subscription.periods.${getPeriodKey(plan.durationDays)}`)}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {/* Alipay Option */}
          <button
            onClick={() => handlePaymentMethodSelect('alipay')}
            disabled={isLoading}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <img 
                    src="/assets/zhifubao.png" 
                    alt="Alipay" 
                    className="w-6 h-6 object-contain filter brightness-0 invert"
                  />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{t('subscription.alipay')}</h3>
                  <p className="text-sm text-gray-600">{t('subscription.alipayDescription')}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {t('subscription.recommended')}
              </div>
            </div>
          </button>

          {/* Stripe Option */}
          <button
            onClick={() => handlePaymentMethodSelect('stripe')}
            disabled={isLoading}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <img 
                    src="/stripe.svg" 
                    alt="Stripe" 
                    className="w-6 h-6 object-contain filter brightness-0 invert"
                  />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{t('subscription.stripe')}</h3>
                  <p className="text-sm text-gray-600">{t('subscription.stripeDescription')}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {t('subscription.international')}
              </div>
            </div>
          </button>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {t('common.cancel')}
          </button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <svg className="animate-spin h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div className="absolute inset-0 rounded-full border-2 border-teal-200"></div>
              </div>
              <span className="text-teal-600 font-medium text-sm">{t('subscription.processingPayment')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSelection;