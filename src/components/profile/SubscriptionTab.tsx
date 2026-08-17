// src/components/profile/SubscriptionTab.tsx
// ✅ UPDATED: Navigate to /pricing on upgrade

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../hooks/useCurrency';

const SubscriptionTab: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { payType, isPremium } = useAuth();
const { format } = useCurrency();
  // Map payType to plan ID
  const getCurrentPlanId = (payType: number): string => {
    switch (payType) {
      case 1: return 'week';
      case 2: return 'month';
      case 3: return 'season';
      case 4: return 'year';
      default: return 'free';
    }
  };

  // Get plan name from payType
  const getPlanName = (payType: number): string => {
    switch (payType) {
      case 1: return 'VIP Week';
      case 2: return 'VIP Month';
      case 3: return 'VIP Quarter';
      case 4: return 'VIP Year';
      default: return 'Free';
    }
  };

  const currentPlanId = getCurrentPlanId(payType);

  const subscriptionPlans = [
  {
    id: 'week',
    name: t('trips.week') || 'Week',
    price: format('week'),
    duration: t('trips.perWeek') || 'per week',
    isCurrent: currentPlanId === 'week',
    payType: 1
  },
  {
    id: 'month',
    name: t('trips.month') || 'Month',
    price: format('month'),
    duration: t('trips.perMonth') || 'per month',
    isCurrent: currentPlanId === 'month',
    payType: 2
  },
  {
    id: 'season',
    name: t('trips.season') || 'Season (3 months)',
    price: format('season'),
    duration: t('trips.perSeason') || 'per quarter',
    isCurrent: currentPlanId === 'season',
    payType: 3
  },
  {
    id: 'year',
    name: t('trips.year') || 'Year',
    price: format('year'),
    duration: t('trips.perYear') || 'per year',
    isCurrent: currentPlanId === 'year',
    payType: 4
  }
];

  // ✅ Navigate to pricing page for upgrades
  const handleSelectPlan = (planId: string, planPayType: number) => {
    console.log('Navigating to pricing for plan:', planId, 'PayType:', planPayType);
    navigate('/pricing');
  };

  return (
    <div>
      {/* Current Subscription Status Banner */}
      {!isPremium ? (
        <div className="mb-8 p-6 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl text-white">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">
                {t('trips.freeTitle') || '🆓 Free Plan - Limited Access'}
              </h3>
              <p className="text-white/90 text-sm mb-4">
                {t('trips.freeDescription') || 'You are currently on the free plan with limited features. Upgrade to VIP to unlock premium benefits!'}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                <span></span>
                <span>{t('trips.currentPlan') || 'Current Plan'}: <strong>Free</strong></span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-6 bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl text-white">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <CheckIcon className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">
                {t('trips.premiumTitle') || ' VIP Member - Premium Access'}
              </h3>
              <p className="text-white/90 text-sm mb-4">
                {t('trips.premiumDescription') || 'You have full access to all premium features. Thank you for being a valued VIP member!'}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                <span></span>
                <span>{t('trips.currentPlan') || 'Current Plan'}: <strong>{getPlanName(payType)}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        {t('trips.choosePlan') || 'Choose Your Subscription Plan'}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border-2 p-6 transition-all ${
              plan.isCurrent
                ? 'border-teal-600 bg-teal-50 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-teal-300 hover:shadow-md'
            }`}
          >
            {/* Current Plan Badge */}
            {plan.isCurrent && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-teal-600 text-white text-xs font-bold rounded-full shadow-md">
                 {t('trips.youAreHere') || 'Active Plan'}
              </div>
            )}

            {/* Plan Name */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
              {plan.name}
            </h3>

            {/* Price */}
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {plan.price}
              </div>
              <div className="text-sm text-gray-500">
                {plan.duration}
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckIcon className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>{t('trips.subFeature1', 'Unlimited trip planning')}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckIcon className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>{t('trips.subFeature2', 'AI-powered recommendations')}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckIcon className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>{t('trips.subFeature3', 'Priority customer support')}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckIcon className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>{t('trips.subFeature4', 'Exclusive travel deals')}</span>
              </li>
            </ul>

            {/* Action Button */}
            <button
              onClick={() => handleSelectPlan(plan.id, plan.payType)}
              disabled={plan.isCurrent}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                plan.isCurrent
                  ? 'bg-gray-800 text-white cursor-default opacity-75'
                  : 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-lg active:scale-95'
              }`}
            >
              {plan.isCurrent
                ? `✓ ${t('trips.currentPlan') || 'Current Plan'}`
                : t('trips.upgrade') || 'Upgrade Now'}
            </button>
          </div>
        ))}
      </div>

      {/* Benefits Comparison */}
      <div className="mt-12 p-8 bg-gray-50 rounded-2xl max-w-4xl mx-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
  {t('trips.whyUpgrade', 'Why Upgrade to VIP?')}
</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
         <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
  <span>{t('trips.freePlanLabel', 'Free Plan')}</span>
</h4>
<ul className="space-y-2 text-sm text-gray-600">
  <li className="flex items-start gap-2">
    <span className="text-red-500 mt-0.5">✗</span>
    <span>{t('trips.freeLimit1', 'Limited to 3 trips per month')}</span>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-red-500 mt-0.5">✗</span>
    <span>{t('trips.freeLimit2', 'Basic route planning only')}</span>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-red-500 mt-0.5">✗</span>
    <span>{t('trips.freeLimit3', 'No AI recommendations')}</span>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-red-500 mt-0.5">✗</span>
    <span>{t('trips.freeLimit4', 'Standard support')}</span>
  </li>
</ul>
          </div>

          {/* VIP Plan */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl border-2 border-teal-500">
           <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
  <span>{t('trips.vipPlansLabel', 'VIP Plans')}</span>
</h4>
<ul className="space-y-2 text-sm text-gray-700">
  <li className="flex items-start gap-2">
    <span className="text-teal-600 mt-0.5">✓</span>
    <span>{t('trips.vipBenefit1', 'Unlimited trip planning')}</span>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-teal-600 mt-0.5">✓</span>
    <span>{t('trips.vipBenefit2', 'Advanced route optimization')}</span>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-teal-600 mt-0.5">✓</span>
    <span>{t('trips.vipBenefit3', 'AI-powered personalized recommendations')}</span>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-teal-600 mt-0.5">✓</span>
    <span>{t('trips.vipBenefit4', '24/7 priority customer support')}</span>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-teal-600 mt-0.5">✓</span>
    <span>{t('trips.vipBenefit5', 'Exclusive travel discounts & deals')}</span>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-teal-600 mt-0.5">✓</span>
    <span>{t('trips.vipBenefit6', 'Offline maps & navigation')}</span>
  </li>
</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTab;