import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CreditCardIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

interface LocationState {
  planId: string;
  planName?: string;
  planPrice?: number;
  currency?: string;
  currencySymbol?: string;
  vipTypeId?: number;
}

const PaymentMethod: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [selectedMethod, setSelectedMethod] = useState<'visa' | 'alipay' | null>(null);

  // If no plan selected, redirect back to pricing
  React.useEffect(() => {
    if (!state?.planId) {
      navigate('/pricing');
    }
  }, [state, navigate]);

  const handleContinue = () => {
    if (!selectedMethod) return;
    
    if (selectedMethod === 'visa') {
      navigate('/payment/card', { 
        state: { 
          ...state,
          paymentMethod: 'visa' 
        } 
      });
    } else {
      navigate('/payment/alipay', { 
        state: { 
          ...state,
          paymentMethod: 'alipay' 
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              {t('trips.paymentTitle', 'Payment')}
            </h1>
            <p className="text-lg text-slate-600">
              {t('trips.paymentChooseMethod', 'Choose your payment method')}
            </p>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="space-y-4">
              {/* Visa Card Option */}
              <button
                onClick={() => setSelectedMethod('visa')}
                className={`w-full p-6 border-2 rounded-xl transition-all flex items-center justify-between ${
                  selectedMethod === 'visa'
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedMethod === 'visa' ? 'bg-teal-600' : 'bg-slate-100'
                  }`}>
                    <CreditCardIcon className={`w-6 h-6 ${
                      selectedMethod === 'visa' ? 'text-white' : 'text-slate-600'
                    }`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {t('trips.creditCard', 'Credit / Debit Card')}
                    </h3>
                    <p className="text-sm text-slate-500">
                {t('trips.creditCardBrands', 'Visa, Mastercard, American Express')}
                    </p>
                  </div>
                </div>
                {selectedMethod === 'visa' && (
                  <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Alipay Option */}
              <button
                onClick={() => setSelectedMethod('alipay')}
                className={`w-full p-6 border-2 rounded-xl transition-all flex items-center justify-between ${
                  selectedMethod === 'alipay'
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedMethod === 'alipay' ? 'bg-teal-600' : 'bg-slate-100'
                  }`}>
                    <DevicePhoneMobileIcon className={`w-6 h-6 ${
                      selectedMethod === 'alipay' ? 'text-white' : 'text-slate-600'
                    }`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {t('trips.alipay', 'Alipay')}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {t('trips.scanQR', 'Scan QR code with Alipay app')}
                    </p>
                  </div>
                </div>
                {selectedMethod === 'alipay' && (
                  <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!selectedMethod}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              selectedMethod
                ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {t('trips.continue', 'Continue')}
          </button>

          {/* Back Link */}
          <button
            onClick={() => navigate('/pricing')}
            className="w-full mt-4 py-3 text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← {t('trips.backToPricing', 'Back to pricing')}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentMethod;
