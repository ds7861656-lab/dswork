import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PrivacyPolicyCN } from '../components/policy/PrivacyPolicyCN';
import { PrivacyPolicyEU_EN } from '../components/policy/PrivacyPolicyEU_EN';
import { PrivacyPolicyEU_ZH } from '../components/policy/PrivacyPolicyEU_ZH';
import { ChildrenPrivacyCN } from '../components/policy/ChildrenPrivacyCN';

type PolicyRegion = 'domestic' | 'eu';
type PolicyLanguage = 'zh' | 'en';
type PolicyType = 'privacy' | 'children';

const Privacy: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isChineseBuild = import.meta.env.VITE_IS_CHINESE_VERSION === 'true';
  const [selectedRegion, setSelectedRegion] = useState<PolicyRegion>(isChineseBuild ? 'domestic' : 'eu');
  const [selectedLanguage, setSelectedLanguage] = useState<PolicyLanguage>(isChineseBuild ? 'zh' : 'en');
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyType>('privacy');

  // Update state based on URL parameters
  useEffect(() => {
    const policy = searchParams.get('policy');
    if (policy === 'children') {
      setSelectedPolicy('children');
    }
  }, [searchParams]);

  // Function to navigate to children policy
  const navigateToChildrenPolicy = () => {
    setSelectedPolicy('children');
    window.history.pushState({}, '', '/privacy?policy=children');
  };

  const renderPolicyContent = () => {
    switch (selectedPolicy) {
      case 'children':
        if (selectedRegion === 'domestic') {
          return <ChildrenPrivacyCN />;
        }
        // For EU, show a note that children's policy is included in main privacy policy
        return (
          <div>
            <h1 className="text-2xl font-bold mb-2 text-slate-900">Children's Privacy Protection</h1>
            <p className="text-slate-600 mb-4">
              For EU users, minor protection information is included in the main privacy policy.
            </p>
            <div className="text-center py-8">
              <p className="text-slate-600">Please refer to the main privacy policy for children's protection details.</p>
              <button
                onClick={() => setSelectedPolicy('privacy')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Main Privacy Policy
              </button>
            </div>
          </div>
        );
      case 'privacy':
      default:
        if (selectedRegion === 'domestic') {
          return <PrivacyPolicyCN onNavigateToChildrenPolicy={navigateToChildrenPolicy} />;
        } else {
          return selectedLanguage === 'en' ? <PrivacyPolicyEU_EN /> : <PrivacyPolicyEU_ZH />;
        }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-slate-50">
      <Header />

      {/* Page Title Section */}
      {/* <section className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 text-center">Privacy Policy</h1>
          <p className="text-slate-600 text-center mt-4 max-w-2xl mx-auto">Please read our privacy policy carefully to understand how we collect, use, and protect your information.</p>
        </div>
      </section> */}

      {/* Policy Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Breadcrumb */}
            <nav className="text-sm text-slate-600">
              <span className="hover:text-blue-600 cursor-pointer">Home</span>
              <span className="mx-2">/</span>
              <span className="text-slate-900 font-medium">Privacy Policy</span>
            </nav>

            {/* Policy Type Selection */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-700">Policy Type:</span>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedPolicy('privacy')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedPolicy === 'privacy'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Main Privacy Policy
                </button>
                <button
                  onClick={() => setSelectedPolicy('children')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedPolicy === 'children'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Children's Policy
                </button>
              </div>
            </div>

            {/* Region and Language Selection */}
            <div className="flex items-center space-x-4">
              {/* Region Selection */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-700">Region:</span>
                <div className="flex bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setSelectedRegion('domestic')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedRegion === 'domestic'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    China
                  </button>
                  <button
                    onClick={() => setSelectedRegion('eu')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedRegion === 'eu'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    EU
                  </button>
                </div>
              </div>

              {/* Language Selection (only for EU) */}
              {selectedRegion === 'eu' && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-700">Language:</span>
                  <div className="flex bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => setSelectedLanguage('zh')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedLanguage === 'zh'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      中文
                    </button>
                    <button
                      onClick={() => setSelectedLanguage('en')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedLanguage === 'en'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Policy Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
        {renderPolicyContent()}
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;