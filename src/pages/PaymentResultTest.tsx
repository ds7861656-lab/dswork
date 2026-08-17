// ============================================================================
// 🧪 TEMPORARY TEST PAGE — remove after testing!
// ============================================================================
// This page renders PaymentResult with mock data so you can verify translations
// without actually paying. Access it at: /payment/result/test
//
// ✅ TO ADD: In App.tsx, add this route inside <Routes>:
//   import PaymentResultTest from './pages/PaymentResultTest';
//   <Route path="/payment/result/test" element={<PaymentResultTest />} />
//
// ❌ TO REMOVE AFTER TESTING: Delete this file + remove the route from App.tsx
// ============================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../hooks/useCurrency';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ClockIcon, CreditCardIcon, DocumentTextIcon, CalendarIcon } from '@heroicons/react/24/outline';

const PaymentResultTest: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { symbol, getPrice } = useCurrency();

  // ✅ Mock data — simulates a successful Week plan purchase
  const vipTypeId = 1;
  const orderNumber = 'TEST20260526120000001';
  const amount = getPrice('week');
  const startTime = new Date().toISOString();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);
  const endTime = endDate.toISOString();

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string | undefined) => {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const getPlanName = (vid: number): string => {
    const planNames: Record<number, string> = {
      1: t('trips.week', 'Week'),
      2: t('trips.month', 'Month'),
      3: t('trips.season', 'Season'),
      4: t('trips.year', 'Year'),
    };
    return planNames[vid] || '—';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />

      {/* ⚠️ TEST BANNER */}
      <div className="bg-yellow-400 text-yellow-900 text-center py-2 text-sm font-bold">
        🧪 TEST MODE — This is a mock payment result page for translation testing. Remove after use.
      </div>

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
              <CheckCircleIcon className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              {t('trips.paymentSuccessTitle', 'Payment Successful!')}
            </h1>
            <p className="text-lg text-slate-600">
              {t('trips.paymentSuccessSubtitle', 'Thank you for your purchase! Your subscription is now active.')}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-full shadow-lg">
              <span className="text-2xl">⭐</span>
              <span className="font-bold text-lg">VIP {getPlanName(vipTypeId)}</span>
            </div>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              {t('trips.orderDetails', 'Order Details')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-teal-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-slate-500 mb-1">{t('trips.orderNumber', 'Order Number')}</p>
                  <p className="font-semibold text-slate-900 font-mono">#{orderNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <CreditCardIcon className="w-6 h-6 text-teal-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-slate-500 mb-1">{t('trips.subscriptionPlan', 'Subscription Plan')}</p>
                  <p className="font-semibold text-slate-900">{getPlanName(vipTypeId)}
                    <span className="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">VIP Type {vipTypeId}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <CreditCardIcon className="w-6 h-6 text-teal-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-slate-500 mb-1">{t('trips.paymentMethodLabel', 'Payment Method')}</p>
                  <p className="font-semibold text-slate-900">{t('trips.alipay', 'Alipay')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-teal-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-slate-500 mb-1">{t('trips.subscriptionPeriod', 'Subscription Period')}</p>
                  <p className="font-semibold text-slate-900">{formatDate(startTime)} → {formatDate(endTime)}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <ClockIcon className="w-6 h-6 text-teal-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-slate-500 mb-1">{t('trips.paymentDate', 'Payment Date')}</p>
                  <p className="font-semibold text-slate-900">{formatDateTime(new Date().toISOString())}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-teal-50 border-2 border-teal-200 rounded-lg">
                <p className="text-slate-700 font-medium">{t('trips.totalAmount', 'Total Amount')}</p>
                <p className="text-2xl font-bold text-teal-600">{symbol}{amount}</p>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-3">{t('trips.whatsNext', "What's Next?")}</h3>
            <ul className="space-y-2 text-blue-800">
              {[t('trips.nextStep1', 'Your subscription has been activated automatically'), t('trips.nextStep2', 'All premium features are now unlocked'), t('trips.nextStep3', 'Start exploring your new premium benefits!')].map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button onClick={() => navigate('/subscription')}
              className="w-full py-4 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-lg">
              {t('trips.viewSubscription', 'View My Subscription')}
            </button>
            <button onClick={() => navigate('/trips')}
              className="w-full py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all">
              {t('trips.goToDashboard', 'Go to Dashboard')}
            </button>
            <button onClick={() => navigate('/')}
              className="w-full py-3 text-slate-600 hover:text-slate-900 transition-colors">
              {t('trips.backToHome', 'Back to Home')}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentResultTest;
