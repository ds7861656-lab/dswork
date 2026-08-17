import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Layouts & Components
import AuthLayout from '../components/layouts/AuthLayout';

// Login Forms
import LoginForm from '../components/LoginForm';
import PhoneLogin from '../components/PhoneLogin';
import PhoneSignup from '../components/PhoneSignup';
import { useAuth } from '../contexts/AuthContext';

type ChineseMode = 'login' | 'signup';

const Login: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  // Environment Flag
  const isChineseVersion = import.meta.env.VITE_IS_CHINESE_VERSION === 'true';

  // State for Chinese Login/Signup mode
  const [chineseMode, setChineseMode] = useState<ChineseMode>('login');

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  // --- Chinese Market Layout (Phone Login Only) ---
  if (isChineseVersion) {
    // ✅ Dynamic Header Text based on mode
    const getHeaderText = () => {
      if (chineseMode === 'signup') {
        return { 
          title: '创建账号', 
          subtitle: '开启您的下一段精彩旅程' 
        };
      }
      
      // Login mode
      return { 
        title: '欢迎回来', 
        subtitle: '开启您的下一段精彩旅程' 
      };
    };

    const headerText = getHeaderText();

    return (
      <AuthLayout title={headerText.title} subtitle={headerText.subtitle}>
        {/* ✅ NO TABS - Only Phone Login */}
        <div className="mt-6 min-h-[300px]">
          {/* LOGIN MODE */}
          {chineseMode === 'login' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <PhoneLogin onSwitchToSignup={() => setChineseMode('signup')} />
            </div>
          )}

          {/* SIGNUP MODE */}
          {chineseMode === 'signup' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <PhoneSignup onSwitchToLogin={() => setChineseMode('login')} />
            </div>
          )}
        </div>
      </AuthLayout>
    );
  }

  // --- International / Firebase Layout (Unified Professional Design) ---
  return (
    <AuthLayout 
      title={t('loginForm.welcomeBack', { defaultValue: 'Welcome Back' })}
      subtitle={t('loginForm.loginSubtitle', { defaultValue: 'Start your next journey' })}
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <LoginForm 
          variant="plain" 
          redirectTo="/" 
        />
      </div>
    </AuthLayout>
  );
};

export default Login;
