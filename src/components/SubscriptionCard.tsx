import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, ArrowRightIcon, StarIcon } from '@heroicons/react/24/solid';
import type { SubscriptionPlan } from '../types/subscription';

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isSelected?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  onButtonClick?: () => void;
  className?: string;
  currency?: string;
  showComparison?: boolean;
  onCompareClick?: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  plan,
  isSelected = false,
  isLoading = false,
  onClick,
  onButtonClick,
  className = '',
  currency = '$',
  showComparison = true,
  onCompareClick,
}) => {
  const { t } = useTranslation();

  const getPeriod = (durationDays: number) => {
    switch (durationDays) {
      case 7: return t('subscription.periods.week');
      case 30: return t('subscription.periods.month');
      case 90: return t('subscription.periods.quarter');
      case 365: return t('subscription.periods.year');
      default: return `${durationDays} ${t('subscription.periods.days')}`;
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!plan.isDisabled && !isLoading && onButtonClick) onButtonClick();
  };

  // Skeleton State
  if (isLoading) {
    return (
      <div className="relative flex flex-col h-full p-8 rounded-3xl bg-white border border-gray-100 shadow-xl animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded-full mx-auto mb-6" />
        <div className="h-10 w-32 bg-gray-200 rounded-lg mx-auto mb-4" />
        <div className="h-6 w-20 bg-gray-100 rounded-lg mx-auto mb-8" />
        <div className="space-y-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-gray-100" />
              <div className="h-4 flex-1 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
        <div className="mt-auto h-12 w-full bg-gray-200 rounded-xl" />
      </div>
    );
  }

  const isHighlighted = plan.isPopular || plan.isBestValue;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!plan.isDisabled ? { y: -8, transition: { duration: 0.2 } } : {}}
      onClick={() => !plan.isDisabled && onClick?.()}
      className={`
        relative flex flex-col h-full p-8 rounded-3xl transition-all duration-300
        ${plan.isDisabled ? 'opacity-60 cursor-not-allowed bg-gray-50 border-gray-200' : 'cursor-pointer'}
        ${isSelected 
          ? 'ring-2 ring-teal-500 bg-teal-50/30 shadow-2xl shadow-teal-100' 
          : 'bg-white border border-gray-100 hover:border-teal-200 shadow-xl hover:shadow-2xl hover:shadow-teal-100/50'}
        ${className}
      `}
    >
      {/* Popular/Best Value Badge */}
      <AnimatePresence>
        {isHighlighted && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-xs font-bold tracking-wide shadow-lg z-10
              ${plan.isBestValue ? 'bg-linear-to-r from-purple-600 to-indigo-600' : 'bg-linear-to-r from-orange-500 to-pink-500'}`}
          >
            <StarIcon className="w-3.5 h-3.5" />
            {plan.badgeTextKey ? t(plan.badgeTextKey) : (plan.isBestValue ? t('subscriptionCard.bestValue') : t('subscriptionCard.popular'))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className={`text-xl font-bold mb-4 ${isSelected ? 'text-teal-900' : 'text-gray-900'}`}>
          {plan.planName}
        </h3>
        
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-2xl font-medium text-gray-500">{currency}</span>
          <span className="text-5xl font-extrabold tracking-tight text-gray-900">
            {plan.price}
          </span>
          <span className="text-gray-500 font-medium">/{getPeriod(plan.durationDays)}</span>
        </div>

        {plan.originalPrice && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-gray-400 line-through text-sm">{currency}{plan.originalPrice}</span>
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
              {t('subscriptionCard.save')} {plan.discount}%
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-linear-to-r from-transparent via-gray-100 to-transparent mb-8" />

      {/* Features List */}
      <ul className="space-y-4 mb-10 grow">
        {plan.featureNames.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 group">
            <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors
              ${isSelected ? 'bg-teal-500' : 'bg-teal-100 group-hover:bg-teal-200'}`}>
              <CheckIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-teal-600'}`} />
            </div>
            <span className={`text-sm font-medium leading-tight ${isSelected ? 'text-gray-800' : 'text-gray-600'}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Call to Action */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleButtonClick}
        disabled={plan.isDisabled || isLoading}
        className={`
          relative w-full py-4 px-6 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all duration-300 overflow-hidden
          ${isSelected 
            ? 'bg-gray-900 text-white shadow-xl hover:bg-gray-800' 
            : 'bg-linear-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-200 hover:shadow-teal-300 hover:brightness-110'}
          ${plan.isDisabled ? 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed' : ''}
        `}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {isSelected ? t('subscriptionCard.currentPlan') : t('subscriptionCard.selectPlan')}
              {!isSelected && <ArrowRightIcon className="w-4 h-4" />}
            </>
          )}
        </span>
      </motion.button>

      {/* Comparison Link */}
      {showComparison && !plan.isDisabled && (
        <button
          onClick={(e) => { e.stopPropagation(); onCompareClick?.(); }}
          className="mt-6 text-xs font-bold text-gray-400 hover:text-teal-600 uppercase tracking-widest transition-colors cursor-pointer"
        >
          {t('subscriptionCard.comparePlans')}
        </button>
      )}

      {/* Selection Glow Effect */}
      {isSelected && (
        <motion.div
          layoutId="glow"
          className="absolute inset-0 -z-10 bg-teal-400/5 blur-2xl rounded-3xl"
        />
      )}
    </motion.div>
  );
};

export default SubscriptionCard;