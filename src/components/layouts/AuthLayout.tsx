import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Visual Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-teal-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Travel Background"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">
          <Link to="/" className="flex items-center gap-3 w-fit hover:opacity-80 transition-opacity">
             {/* Logo */}
             <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <span className="font-bold text-xl font-serif">A</span>
             </div>
             <span className="text-2xl font-bold tracking-tight">Afreshtrip</span>
          </Link>

          <div className="mb-12">
            <blockquote className="text-3xl font-medium leading-tight mb-6 font-serif">
              "{t('loginForm.brandingQuote', { defaultValue: 'Travel is not just about seeing the sights, it is about discovering a new you.' })}"
            </blockquote>
            <p className="text-teal-100 text-lg">— {t('loginForm.brandingAuthor', { defaultValue: 'Your Smart Travel Companion' })}</p>
          </div>

          <div className="flex justify-between items-end text-sm text-teal-200/80">
            <span>© {new Date().getFullYear()} Afreshtrip. All rights reserved.</span>
            <div className="flex gap-4">
               <Link to="/privacy" className="hover:text-white transition-colors">{t('loginForm.privacy')}</Link>
               <Link to="/terms" className="hover:text-white transition-colors">{t('loginForm.terms')}</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-8 md:p-12 bg-white relative">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="absolute top-6 right-6 lg:hidden">
            <Link to="/" className="text-sm font-medium text-teal-600 hover:text-teal-800">
                {t('common.home')} &rarr;
            </Link>
        </div>

        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
             <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <img src="/assets/tubiao.png" alt="Logo" className="w-10 h-10 rounded-full" />
                <span className="text-2xl font-bold text-teal-900">Afreshtrip</span>
             </Link>
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {title || t('loginForm.welcomeBack', { defaultValue: 'Welcome Back' })}
            </h2>
            <p className="mt-2 text-gray-500">
              {subtitle || t('loginForm.loginSubtitle', { defaultValue: 'Start your next journey' })}
            </p>
          </div>

          {/* Main Content (Tabs + Forms) */}
          <div className="mt-8">
            {children}
          </div>

          {/* Mobile Footer */}
          <div className="lg:hidden mt-auto pt-8 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Afreshtrip. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;