import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CreditCardIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface LocationState {
  planId: string;
  planName?: string;
  planPrice?: number;
  paymentMethod: string;
}

const CardPayment: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if no plan selected
  React.useEffect(() => {
    if (!state?.planId) {
      navigate('/pricing');
    }
  }, [state, navigate]);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substr(0, 19); // 4 groups of 4 digits
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substr(0, 2) + '/' + cleaned.substr(2, 2);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardData({ ...cardData, cardNumber: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setCardData({ ...cardData, expiryDate: formatted });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substr(0, 4);
    setCardData({ ...cardData, cvv: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardData.cardNumber || !cardData.cardHolder || !cardData.expiryDate || !cardData.cvv) {
      alert(t('payment.fillAllFields', 'Please fill in all fields'));
      return;
    }

    setIsProcessing(true);

    // TODO: Integrate with actual payment gateway (Stripe, etc.)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/payment/success', {
        state: {
          ...state,
          orderNumber: `ORD-${Date.now()}`,
          paymentMethod: 'Card ending in ' + cardData.cardNumber.slice(-4)
        }
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              {t('payment.cardDetails', 'Card Details')}
            </h1>
            <p className="text-lg text-slate-600">
              {t('payment.enterCardInfo', 'Enter your card information')}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Card Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              {/* Visual Card */}
              <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-xl p-6 mb-8 text-white">
                <div className="flex justify-between items-start mb-8">
                  <CreditCardIcon className="w-12 h-12" />
                  <div className="text-sm font-medium">VISA</div>
                </div>
                <div className="mb-6">
                  <div className="text-2xl font-mono tracking-wider">
                    {cardData.cardNumber || '•••• •••• •••• ••••'}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <div className="text-xs opacity-75 mb-1">Card Holder</div>
                    <div className="font-medium">
                      {cardData.cardHolder || 'FULL NAME'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75 mb-1">Expires</div>
                    <div className="font-medium">
                      {cardData.expiryDate || 'MM/YY'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('payment.cardNumber', 'Card Number')}
                  </label>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Card Holder */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('payment.cardHolder', 'Card Holder Name')}
                  </label>
                  <input
                    type="text"
                    value={cardData.cardHolder}
                    onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value.toUpperCase() })}
                    placeholder="JOHN DOE"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t('payment.expiryDate', 'Expiry Date')}
                    </label>
                    <input
                      type="text"
                      value={cardData.expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t('payment.cvv', 'CVV')}
                    </label>
                    <input
                      type="text"
                      value={cardData.cvv}
                      onChange={handleCvvChange}
                      placeholder="123"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Security Note */}
              <div className="mt-6 flex items-center gap-2 text-sm text-slate-600">
                <LockClosedIcon className="w-4 h-4" />
                <span>{t('payment.securePayment', 'Your payment is secure and encrypted')}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                isProcessing
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('payment.processing', 'Processing...')}
                </span>
              ) : (
                t('payment.payNow', 'Pay Now')
              )}
            </button>

            {/* Back Link */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full mt-4 py-3 text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← {t('payment.back', 'Back')}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CardPayment;
