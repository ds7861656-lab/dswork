import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import { useAuth } from '../contexts/AuthContext';
import type { FeatureId, FeatureAccessResult } from '../types/features';
import FeatureAccessModal from './FeatureAccessModal';
import { FEATURE_REGISTRY } from '../types/features';
import { LockClosedIcon, SparklesIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

interface FeatureGateProps {
  feature: FeatureId;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /**
   * Determines how restricted content is handled.
   * 'hide' - Completely removes content from the DOM (default, secure).
   * 'blur' - Renders content blurred and non-interactive with an overlay (good for UX/Teasers).
   */
  restrictMode?: 'hide' | 'blur';
}

/**
 * Demo Request Form Component
 */
const DemoRequestForm: React.FC<{ onBack: () => void; featureName: string }> = ({ onBack, featureName }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      console.log('Demo request submitted:', { ...formData, feature: featureName });
      
      setIsSuccess(true);
      
      // Reset form after 2 seconds and go back
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', surname: '', email: '', message: '' });
        onBack();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting demo request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSuccess) {
    return (
      <div className="bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 max-w-md w-full mx-auto text-center animate-fade-in">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('featureGate.requestReceived', 'Request Received!')}</h3>
        <p className="text-slate-500">{t('featureGate.willContactSoon', "We'll contact you soon!")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 max-w-md w-full mx-auto animate-fade-in">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors group"
      >
        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">{t('featureGate.back', 'Back')}</span>
      </button>

      {/* Form Header */}
      <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">
        {t('featureGate.askForTryDemo', 'Ask for Try Demo')}
      </h3>
      <p className="text-slate-500 mb-6 text-center text-sm">
        {t('featureGate.demoFormDescription', 'Fill in your details and we\'ll set up a demo for you')}
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            {t('featureGate.name', 'Name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder={t('featureGate.namePlaceholder', 'Enter your name')}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Surname */}
        <div>
          <label htmlFor="surname" className="block text-sm font-medium text-slate-700 mb-1">
            {t('featureGate.surname', 'Surname')}
          </label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
            placeholder={t('featureGate.surnamePlaceholder', 'Enter your surname')}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            {t('featureGate.email', 'Email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder={t('featureGate.emailPlaceholder', 'your@email.com')}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
            {t('featureGate.message', 'Message')}
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            placeholder={t('featureGate.messagePlaceholder', 'Tell us about your requirements...')}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('featureGate.submitting', 'Submitting...')}
            </>
          ) : (
            t('featureGate.submit', 'Submit')
          )}
        </button>
      </form>
    </div>
  );
};

/**
 * FeatureGate component for conditional rendering based on backend-validated access
 * Updated with button functionality and demo form.
 */
const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback = null,
  restrictMode = 'hide'
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { checkFeatureAccess } = useFeatureAccess();
  const [access, setAccess] = useState<FeatureAccessResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDemoForm, setShowDemoForm] = useState(false); // ✅ NEW STATE

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        const result = await checkFeatureAccess(feature);
        setAccess(result);
      } catch (error) {
        console.error('Error checking feature access:', error);
        setAccess({
          hasAccess: false,
          feature: {
            id: feature,
            name: t('featureGate.unknownFeature'),
            description: t('featureGate.featureNotFound'),
            category: 'planning',
          },
          requiredPlans: [],
          upgradeMessage: t('featureGate.unableToCheckAccess'),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccess();
  }, [feature, checkFeatureAccess, t]);

  const featureName = access?.feature?.name || FEATURE_REGISTRY[feature]?.name || t('featureGate.premiumFeature');

  // ✅ Handle "Upgrade Now" button click
  const handleUpgradeClick = () => {
    navigate('/pricing'); // Redirect to pricing page
  };

  // ✅ Handle "Ask for Try Demo" button click
  const handleDemoClick = () => {
    setShowDemoForm(true);
  };

  // ✅ Handle back button from demo form
  const handleBackFromDemo = () => {
    setShowDemoForm(false);
  };

  // --- 1. Loading State ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 w-full h-full min-h-[300px] bg-slate-50/50 rounded-3xl border border-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-500 border-t-transparent mb-4"></div>
        <span className="text-sm font-medium text-slate-400 tracking-wide uppercase">{t('featureGate.verifyingAccess')}</span>
      </div>
    );
  }

  // --- 2. Access Granted State ---
  if (access?.hasAccess) {
    return <>{children}</>;
  }

  // --- 3. Access Denied State (Not Authenticated) ---
  if (!user) {
    if (restrictMode === 'blur') {
       return (
        <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-3xl group">
           {/* Blurred Content Background */}
           <div className="filter blur-md opacity-40 pointer-events-none select-none transition-all duration-700 group-hover:blur-lg" aria-hidden="true">
             {children}
           </div>
           
           {/* Professional Auth Overlay */}
           <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/5 backdrop-blur-[2px] transition-all duration-500">
              <div className="bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] max-w-sm w-full text-center border border-white/60 ring-1 ring-slate-900/5 transform transition-all hover:scale-105 duration-300">
                
                {/* Icon Badge */}
                <div className="w-16 h-16 bg-linear-to-tr from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-900/20 -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                  <LockClosedIcon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('featureGate.travelJournal')}</h3>
                <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                  {t('featureGate.signInDescription')}
                </p>

                <a
                  href="/login"
                  className="group/btn relative flex w-full items-center justify-center gap-2 py-4 px-6 bg-slate-900 text-white font-bold rounded-xl overflow-hidden shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 transition-all active:scale-95"
                >
                  <span className="relative z-10">{t('featureGate.signInToContinue')}</span>
                  <div className="absolute inset-0 bg-linear-to-r from-teal-500 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                </a>

                <p className="mt-4 text-xs text-slate-400">
                  {t('featureGate.noAccount')} <a href="/signup" className="text-slate-900 font-semibold hover:underline">{t('featureGate.joinForFree')}</a>
                </p>
              </div>
           </div>
        </div>
       );
    }

    return fallback || (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
        <h3 className="text-lg font-bold text-slate-900 mb-2">{t('featureGate.authenticationRequired')}</h3>
        <p className="text-slate-500 mb-4">{t('featureGate.pleaseSignIn')}</p>
        <a href="/login" className="text-teal-600 font-semibold hover:underline">{t('featureGate.signIn')}</a>
      </div>
    );
  }

  // --- 4. Access Denied State (Authenticated but Locked) ---
  
  // ✅ High-end Upgrade Trigger OR Demo Form
  const UpgradeTriggerOrDemoForm = showDemoForm ? (
    <DemoRequestForm onBack={handleBackFromDemo} featureName={featureName} />
  ) : (
    <div className="relative group cursor-pointer">
       <div className="absolute inset-0 bg-linear-to-r from-teal-500 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
       <div className="relative bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 ring-1 ring-slate-900/5 max-w-md w-full mx-auto text-center transition-transform duration-300 hover:-translate-y-1">
          
          <div className="w-16 h-16 bg-linear-to-tr from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/30">
            <SparklesIcon className="w-8 h-8 text-white animate-pulse" />
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('featureGate.unlockFeature', { featureName })}</h3>
          <p className="text-slate-500 mb-8 font-medium leading-relaxed">
            {t('featureGate.upgradeDescription')}
          </p>

          {/* ✅ Upgrade Now Button - Redirects to /pricing */}
          <button 
            onClick={handleUpgradeClick}
            className="w-full rounded-lg bg-teal-600 py-3 text-white hover:bg-teal-700 transition-colors font-semibold flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20"
          >
            <span>{t('featureGate.upgradeNow')}</span> 
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-medium text-white/90 hover:bg-white/30 transition-colors">
              {t('featureGate.pro')}
            </span>
          </button>

          {/* ✅ Ask for Try Demo Button - Shows form */}
          <button 
            onClick={handleDemoClick}
            className="w-full mt-4 rounded-lg border-2 border-teal-600 bg-white py-3 text-teal-600 hover:bg-teal-50 transition-colors font-semibold"
          >
            {t('featureGate.askForTryDemo', 'Ask for Try Demo')}
          </button>
       </div>
    </div>
  );

  if (restrictMode === 'blur') {
    return (
      <div className="relative w-full h-full min-h-[500px] group">
        {/* The blurred content - rendered visually but unreachable */}
        <div 
          className="filter blur-md opacity-50 pointer-events-none select-none transition-all duration-700 group-hover:blur-lg" 
          aria-hidden="true"
        >
          {children}
        </div>

        {/* The Overlay Container */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-linear-to-b from-white/10 to-white/60 p-4">
           {/* Show either upgrade card or demo form */}
           <div className="w-full max-w-md">
             {fallback || UpgradeTriggerOrDemoForm}
           </div>
        </div>

        {/* Upgrade Modal */}
        <FeatureAccessModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          featureId={feature}
          featureName={featureName}
        />
      </div>
    );
  }

  // Default 'hide' mode
  return (
    <>
      <div onClick={() => setShowModal(true)}>
        {fallback || (
          <div className="bg-linear-to-r from-slate-50 to-white border border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-teal-200 transition-colors">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
               <LockClosedIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('featureGate.lockedFeature')}</h3>
            <p className="text-slate-500 mt-1 mb-4">{t('featureGate.upgradeToAccess', { featureName })}</p>
            <span className="text-teal-600 font-semibold text-sm">{t('featureGate.viewOptions')}</span>
          </div>
        )}
      </div>
      <FeatureAccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        featureId={feature}
        featureName={featureName}
      />
    </>
  );
};

export default FeatureGate;
