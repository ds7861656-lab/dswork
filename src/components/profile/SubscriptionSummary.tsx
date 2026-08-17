import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSubscription } from '../../hooks/useSubscription';

interface SubscriptionSummaryProps {
  hideButton?: boolean;
}

const SubscriptionSummary: React.FC<SubscriptionSummaryProps> = ({ hideButton = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userSubscription, isLoading } = useSubscription();

  const isPremium = userSubscription && userSubscription.status === 'active';
  
  // Calculate days remaining in billing cycle
  const calculateDaysRemaining = () => {
    if (!userSubscription?.endDate) return 0;
    const end = new Date(userSubscription.endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysRemaining = calculateDaysRemaining();
  
  // Calculate progress percentage for billing cycle bar
  const calculateProgress = () => {
    if (!userSubscription?.startDate || !userSubscription?.endDate) return 0;
    const start = new Date(userSubscription.startDate).getTime();
    const end = new Date(userSubscription.endDate).getTime();
    const now = new Date().getTime();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const progress = calculateProgress();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-gray-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-white  shadow-2xl shadow-teal-900/20 rounded-xl border border-gray-100 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">{t('profile.manageSubscription')}</h2>
        {isPremium && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {t('profile.planStatus')}: Active
          </span>
        )}
      </div>

      <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-slate-900 to-slate-800 text-white p-6 shadow-lg">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-teal-500 opacity-10 rounded-full blur-3xl"></div>

        <div className={`relative z-10 flex flex-col ${hideButton ? '' : 'md:flex-row'} justify-between gap-6`}>
          <div className="flex-1">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
              {t('profile.currentPlan')}
            </p>
            <h3 className="text-2xl font-bold mb-4">
              {isPremium
                ? (userSubscription?.planId === 'year' ? 'VIP Annual Pass' : 'VIP Membership')
                : t('profile.freePlan')}
            </h3>

            {isPremium ? (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>{t('profile.billingCycle')}</span>
                    <span>{daysRemaining} {t('profile.daysRemaining')}</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-teal-400 h-full rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  {t('profile.expiresOn')}: <span className="text-white">{userSubscription?.endDate?.toLocaleDateString()}</span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-300 mb-4">
                Unlock exclusive travel guides, unlimited trip planning, and VIP support.
              </p>
            )}
          </div>

          {!hideButton && (
            <div className="flex items-end">
              {isPremium ? (
                <button
                  onClick={() => navigate('/subscription')}
                  className="w-full md:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
                >
                  {t('profile.changePlan')}
                </button>
              ) : (
                <button
                  onClick={() => navigate('/subscription')}
                  className="w-full md:w-auto px-5 py-2.5 bg-linear-to-br from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 rounded-lg text-sm font-bold shadow-lg shadow-teal-900/20 transition-all transform hover:-translate-y-0.5"
                >
                  {t('profile.upgradePlan')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSummary;