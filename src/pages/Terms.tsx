import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { TermsOfServiceCN } from '../components/policy/TermsOfServiceCN';
import { TermsOfServiceEU_EN } from '../components/policy/TermsOfServiceEU_EN';
import { TermsOfServiceEU_ZH } from '../components/policy/TermsOfServiceEU_ZH';

type PolicyRegion = 'domestic' | 'eu';
type PolicyLanguage = 'zh' | 'en';

const Terms: React.FC = () => {
  const isChineseBuild = import.meta.env.VITE_IS_CHINESE_VERSION === 'true';
  const [selectedRegion, setSelectedRegion] = useState<PolicyRegion>(isChineseBuild ? 'domestic' : 'eu');
  const [selectedLanguage, setSelectedLanguage] = useState<PolicyLanguage>(isChineseBuild ? 'zh' : 'en');

  const renderTermsContent = () => {
    if (selectedRegion === 'domestic') {
      return <TermsOfServiceCN />;
    } else {
      return selectedLanguage === 'en' ? <TermsOfServiceEU_EN /> : <TermsOfServiceEU_ZH />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-slate-50">
      <Header />

      {/* Page Title Section */}
      {/* <section className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 text-center">Terms of Service</h1>
          <p className="text-slate-600 text-center mt-4 max-w-2xl mx-auto">Please read our terms carefully to understand your rights and responsibilities.</p>
        </div>
      </section> */}

      {/* Terms Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Breadcrumb */}
            <nav className="text-sm text-slate-600">
              <span className="hover:text-blue-600 cursor-pointer">Home</span>
              <span className="mx-2">/</span>
              <span className="text-slate-900 font-medium">Terms of Service</span>
            </nav>

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

      {/* Terms Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
        {renderTermsContent()}
      </main>

      <Footer />
    </div>
  );
};

export default Terms;