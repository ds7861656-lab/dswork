import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon, 
  MapIcon, 
  SparklesIcon, 
  CurrencyDollarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

import Header from '../components/Header';
import Footer from '../components/Footer';
import SubscriptionSummary from '../components/profile/SubscriptionSummary';
import PaymentMethodSelection from '../components/PaymentMethodSelection';
import { useSubscription } from '../hooks/useSubscription';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../hooks/useCurrency';

// FAQ Data Structure
interface FaqItem {
  question: string;
  answer: string;
}

// Plan definition matching Pricing.tsx
interface EnrichedPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  billingCycle: 'week' | 'month' | 'season' | 'year';
  vipTypeId: number;
  popular?: boolean;
  features: string[];
  savings?: string;
}

const Subscription: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { payType } = useAuth();
  const { symbol, getPrice, code } = useCurrency();

  const {
    selectedPlanId,
    userSubscription,
    plans: rawPlans,
    isLoading,
    isUpdating,
    showPaymentMethodSelection,
    pendingPlanId,
    handlePlanSelect,
    handlePlanUpdate,
    handlePaymentMethodSelect,
    closePaymentMethodSelection,
  } = useSubscription();

  // Local state for FAQ accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // ============================================================================
  // ENRICHED PLANS — same features & descriptions as Pricing.tsx
  // with multi-currency prices from useCurrency hook
  // ============================================================================
  const plans: EnrichedPlan[] = [
    {
      id: 'week',
      name: t('trips.week', 'Week'),
      price: getPrice('week'),
      period: t('trips.perWeek', 'Per week'),
      billingCycle: 'week',
      vipTypeId: 1,
      features: [
        t('trips.feature_unlimitedTrips', 'Unlimited trip planning'),
        t('trips.feature_aiRecommendations', 'AI-powered recommendations'),
        t('trips.feature_offlineAccess', 'Offline access'),
        t('trips.feature_prioritySupport', 'Priority support'),
      ]
    },
    {
      id: 'month',
      name: t('trips.month', 'Month'),
      price: getPrice('month'),
      period: t('trips.perMonth', 'Per month'),
      billingCycle: 'month',
      vipTypeId: 2,
      popular: true,
      savings: t('trips.save30', 'Save 30%'),
      features: [
        t('trips.feature_allWeekFeatures', 'All Week features'),
        t('trips.feature_advancedAnalytics', 'Advanced analytics'),
        t('trips.feature_teamCollaboration', 'Team collaboration'),
        t('trips.feature_customBranding', 'Custom branding'),
      ]
    },
    {
      id: 'season',
      name: t('trips.season', 'Season'),
      price: getPrice('season'),
      period: t('trips.perSeason', 'Per quarter'),
      billingCycle: 'season',
      vipTypeId: 3,
      savings: t('trips.save40', 'Save 40%'),
      features: [
        t('trips.feature_allMonthFeatures', 'All Month features'),
        t('trips.feature_dedicatedManager', 'Dedicated account manager'),
        t('trips.feature_apiAccess', 'API access'),
        t('trips.feature_whiteLabel', 'White-label options'),
      ]
    },
    {
      id: 'year',
      name: t('trips.year', 'Year'),
      price: getPrice('year'),
      period: t('trips.perYear', 'Per year'),
      billingCycle: 'year',
      vipTypeId: 4,
      savings: t('trips.save50', 'Save 50%'),
      features: [
        t('trips.feature_allSeasonFeatures', 'All Season features'),
        t('trips.feature_lifetimeUpdates', 'Lifetime updates'),
        t('trips.feature_vipSupport', 'VIP support'),
        t('trips.feature_earlyAccess', 'Early access to new features'),
      ]
    }
  ];

  // ============================================================================
  // BUTTON LOGIC — Upgrade / Downgrade / Current
  // ============================================================================
  const getButtonState = (plan: EnrichedPlan) => {
    const isCurrentPlan = plan.vipTypeId === payType;
    const isUpgrade = plan.vipTypeId > payType;
    const isDowngrade = plan.vipTypeId < payType && payType > 0;

    if (isCurrentPlan) {
      return {
        label: `✓ ${t('trips.currentPlan', 'Current Plan')}`,
        disabled: true,
        className: 'bg-gray-300 text-gray-600 cursor-not-allowed',
      };
    }
    if (isUpgrade) {
      return {
        label: t('trips.upgrade', 'Upgrade'),
        disabled: false,
        className: 'bg-teal-600 text-white hover:bg-teal-700',
      };
    }
    if (isDowngrade) {
      return {
        label: t('trips.downgrade', 'Downgrade'),
        disabled: false,
        className: 'bg-slate-600 text-white hover:bg-slate-700',
      };
    }
    // No active subscription
    return {
      label: t('trips.select', 'Select Plan'),
      disabled: false,
      className: 'bg-teal-600 text-white hover:bg-teal-700',
    };
  };

  const handleSelectAndPay = (planId: string) => {
    const selectedPlanData = plans.find(p => p.id === planId);
    if (!selectedPlanData) return;

    console.log('✅ Plan selected:', {
      planId,
      vipTypeId: selectedPlanData.vipTypeId,
      name: selectedPlanData.name,
      price: selectedPlanData.price,
      currency: code,
    });

    // Navigate to payment method selection with all plan details
    navigate('/payment/method', {
      state: {
        planId: planId,
        planName: selectedPlanData.name,
        planPrice: selectedPlanData.price,
        currency: code,
        currencySymbol: symbol,
        vipTypeId: selectedPlanData.vipTypeId,
      }
    });
  };

  // ============================================================================
  // FAQ
  // ============================================================================
  const faqs: FaqItem[] = [
    {
      question: t('subscription.faq.cancel.question', 'Can I cancel my subscription anytime?'),
      answer: t('subscription.faq.cancel.answer', 'Yes, you can cancel your subscription at any time. Your benefits will continue until the end of your current billing period.')
    },
    {
      question: t('subscription.faq.trial.question', 'How does the plan upgrade work?'),
      answer: t('subscription.faq.trial.answer', 'When you upgrade to a higher tier, the change happens immediately. We will pro-rate any remaining time on your current plan.')
    },
    {
      question: t('subscription.faq.payment.question', 'Is my payment information secure?'),
      answer: t('subscription.faq.payment.answer', 'Absolutely. We use industry-standard encryption (SSL) and process payments through secure providers like Stripe and Alipay. We never store your card details.')
    },
    {
      question: t('subscription.faq.support.question', 'What does VIP Support include?'),
      answer: t('subscription.faq.support.answer', 'VIP Support grants you priority access to our travel concierge team, ensuring faster response times and personalized trip assistance.')
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header showNavLinks={true} />
      
      <main className="pb-20">
        {/* 1. HERO SECTION */}
        <div className="relative bg-slate-900 h-[500px] overflow-hidden">
          <div className="absolute inset-0">
             <div className="absolute inset-0 bg-linear-to-r from-teal-900/90 to-slate-900/90 z-10" />
             <img
               src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80"
               alt={t('subscription.travelBackground', 'Travel Background')}
               className="w-full h-full object-cover opacity-40"
             />
          </div>

          <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
                {t('subscription.heroTitle', 'Unlock the World')}
              </h1>
              <p className="text-lg md:text-xl text-teal-100 max-w-2xl mx-auto leading-relaxed">
                {t('subscription.heroSubtitle', 'Experience travel without limits. Access exclusive guides, offline maps, and VIP concierge support.')}
              </p>

              {/* Current subscription badge in hero */}
              {payType > 0 && (
                <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full">
                  <span className="text-teal-200 font-medium">
                    {t('trips.currentPlan', 'Current Plan')}:
                  </span>
                  <span className="font-bold text-white">
                    {plans.find(p => p.vipTypeId === payType)?.name || 'VIP'}
                  </span>
                </div>
              )}
            </motion.div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 120L1440 120L1440 0C1440 0 1082.5 97.5 720 97.5C357.5 97.5 0 0 0 0L0 120Z" fill="#F8FAFC"/>
            </svg>
          </div>
        </div>

        {/* 2. CURRENT STATUS */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-30">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-4xl mx-auto rounded-2xl overflow-hidden"
          >
            <SubscriptionSummary hideButton={true} />
          </motion.div>
        </div>

        {/* 3. PLANS GRID — Synced with Pricing.tsx */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 font-serif">
              {t('subscription.choosePlan', 'Choose Your Journey')}
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              {t('subscription.choosePlanDesc', 'Flexible plans designed for every type of traveler. Upgrade, downgrade, or cancel anytime.')}
            </p>
          </div>

          <div className="relative">
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {isLoading && rawPlans.length === 0 ? (
                [...Array(4)].map((_, index) => (
                  <div key={`skeleton-${index}`} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-96 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-8 mx-auto" />
                    <div className="h-10 bg-slate-200 rounded w-1/2 mb-6 mx-auto" />
                    <div className="space-y-4">
                      <div className="h-2 bg-slate-100 rounded w-full" />
                      <div className="h-2 bg-slate-100 rounded w-5/6" />
                      <div className="h-2 bg-slate-100 rounded w-4/6" />
                    </div>
                  </div>
                ))
              ) : (
                plans.map((plan, index) => {
                  const isCurrentPlan = plan.vipTypeId === payType;
                  const btnState = getButtonState(plan);

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="h-full"
                    >
                      <div
                        className={`relative bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl h-full flex flex-col ${
                          isCurrentPlan
                            ? 'ring-2 ring-purple-600 scale-[1.02]'
                            : plan.popular
                            ? 'ring-2 ring-teal-600'
                            : 'border border-slate-200 hover:scale-[1.02]'
                        }`}
                      >
                        {/* Current Plan Badge */}
                        {isCurrentPlan && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                            <span className="bg-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg border-2 border-white uppercase tracking-wider">
                              {t('trips.yourCurrentPlan', 'Current Plan')}
                            </span>
                          </div>
                        )}

                        {/* Popular Badge */}
                        {!isCurrentPlan && plan.popular && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                            <span className="bg-teal-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg border-2 border-white">
                              {t('trips.popular', 'Most Popular')}
                            </span>
                          </div>
                        )}

                        {/* Savings Badge */}
                        {plan.savings && (
                          <div className="absolute top-4 right-4 z-10">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                              {plan.savings}
                            </span>
                          </div>
                        )}

                        <div className="p-8 flex flex-col flex-1">
                          {/* Plan Name */}
                          <h3 className="text-2xl font-bold text-slate-900 mb-2">
                            {plan.name}
                          </h3>

                          {/* Price with currency symbol */}
                          <div className="mb-6">
                            <span className="text-5xl font-bold text-slate-900">
                              {symbol}{plan.price}
                            </span>
                            <span className="text-slate-600 ml-2">
                              {plan.period}
                            </span>
                          </div>

                          {/* Features */}
                          <ul className="space-y-3 mb-8 flex-1">
                            {plan.features.map((feature, fIndex) => (
                              <li key={fIndex} className="flex items-start gap-3">
                                <CheckIcon className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-600 text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          {/* CTA Button — Upgrade / Downgrade / Current */}
                          <button
                            onClick={() => handleSelectAndPay(plan.id)}
                            disabled={btnState.disabled}
                            className={`w-full py-3 rounded-lg font-semibold transition-all ${btnState.className}`}
                          >
                            {isUpdating && selectedPlanId === plan.id ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {t('common.processing', 'Processing...')}
                              </div>
                            ) : (
                              btnState.label
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* 4. VALUE PROPOSITION */}
        <div className="bg-white py-20 mt-24 border-t border-slate-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-6 font-serif">
                  {t('subscription.featuresTitle', 'Premium Benefits')}
                </h3>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                      <MapIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{t('subscription.features.unlimitedOfflineMaps', 'Unlimited Offline Maps')}</h4>
                      <p className="text-slate-600 mt-1">{t('subscription.features.unlimitedOfflineMapsDesc', 'Download entire cities to your phone. Never get lost, even without a signal.')}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <SparklesIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{t('subscription.features.exclusiveHiddenGems', 'Exclusive Hidden Gems')}</h4>
                      <p className="text-slate-600 mt-1">{t('subscription.features.exclusiveHiddenGemsDesc', 'Access our curated database of secret spots, away from the tourist crowds.')}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <ChatBubbleLeftRightIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{t('subscription.features.conciergeChat', '24/7 Concierge Chat')}</h4>
                      <p className="text-slate-600 mt-1">{t('subscription.features.conciergeChatDesc', 'Real-time support from local experts to help with reservations and emergencies.')}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <CurrencyDollarIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{t('subscription.features.exclusivePartnerDeals', 'Exclusive Partner Deals')}</h4>
                      <p className="text-slate-600 mt-1">{t('subscription.features.exclusivePartnerDealsDesc', 'Save up to 20% on hotels and experiences with our global partners.')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                 <div className="absolute inset-0 bg-linear-to-tr from-teal-500 to-emerald-500 rounded-3xl transform rotate-3 opacity-20 blur-xl"></div>
                 <img
                   src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                   alt={t('subscription.appExperience', 'App Experience')}
                   className="relative rounded-3xl shadow-2xl z-10 border-4 border-white"
                 />
              </div>
            </div>
          </div>
        </div>

        {/* 5. FAQ SECTION */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-3xl">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-10 font-serif">
            {t('subscription.faqTitle', 'Frequently Asked Questions')}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-teal-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-semibold text-slate-800">{faq.question}</span>
                  {openFaqIndex === index ? (
                    <ChevronUpIcon className="w-5 h-5 text-teal-600" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-4 text-slate-600 leading-relaxed text-sm">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => navigate('/support')}
          className="group flex items-center justify-center w-14 h-14 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-500 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-teal-500/30"
          aria-label="Contact Support"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6 group-hover:animate-pulse" />
          <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {t('common.needHelp', 'Need Help?')}
          </span>
        </button>
      </div>

      {/* Payment Method Selection Modal */}
      {showPaymentMethodSelection && pendingPlanId && (
        <PaymentMethodSelection
          plan={rawPlans.find(p => p.planId === pendingPlanId)!}
          isOpen={showPaymentMethodSelection}
          onClose={closePaymentMethodSelection}
          onSelectPaymentMethod={(paymentMethod) => handlePaymentMethodSelect(pendingPlanId, paymentMethod)}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
};

export default Subscription;
