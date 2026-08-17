import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/outline';

import type { FeatureId } from '../types/features';
import type { UpgradeSuggestion } from '../types/backend';
import LoadingSpinner from './LoadingSpinner';

interface FeatureAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureId: FeatureId;
  featureName?: string;
}

const FeatureAccessModal: React.FC<FeatureAccessModalProps> = ({
  isOpen,
  onClose,
  featureId,
  featureName
}) => {
  const { t } = useTranslation();

  const [suggestions, setSuggestions] = useState<UpgradeSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);



  if (!isOpen) return null;

  const handleUpgrade = (planId: string) => {
    // Navigate to subscription page with selected plan
    window.location.href = `/subscription?plan=${planId}`;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              {t('featureAccess.upgradeRequired', 'Upgrade Required')}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {featureName || t('featureAccess.premiumFeature', 'Premium Feature')}
              </h4>
              <p className="text-gray-600">
                {t('featureAccess.upgradeDescription', 'Upgrade your plan to unlock this feature and access premium content.')}
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : suggestions ? (
              <div className="space-y-3">
                <button
                  onClick={() => handleUpgrade(suggestions.recommendedPlan)}
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  {t('featureAccess.upgradeTo', 'Upgrade to')} {suggestions.recommendedPlan} - ${suggestions.price}/{suggestions.period}
                </button>
                <button
                  onClick={() => window.location.href = '/subscription'}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  {t('featureAccess.viewAllPlans', 'View All Plans')}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <button
                  onClick={() => window.location.href = '/subscription'}
                  className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  {t('featureAccess.viewPlans', 'View Subscription Plans')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeatureAccessModal;