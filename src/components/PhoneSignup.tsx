import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiClient, ApiError } from '../services/apiClient';

interface PhoneSignupProps {
  onSwitchToLogin?: () => void;
}

type SignupStep = 'phone' | 'verify' | 'password';

const PhoneSignup: React.FC<PhoneSignupProps> = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState<SignupStep>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const { registerWithSms } = useAuth();
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Validate Chinese phone number
  const isValidPhone = (phone: string): boolean => {
    return /^1[3-9]\d{9}$/.test(phone);
  };

  // Step 1: Send verification code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidPhone(phone)) {
      setError('请输入有效的手机号码');
      return;
    }

    if (!acceptTerms) {
      setError('请先阅读并同意服务条款和隐私政策');
      return;
    }

    setLoading(true);
    try {
      const result = await apiClient.sendSmsCode(phone);

      if (result.code === 200) {
        setStep('verify');
        setCountdown(60);
        setError('');
      } else {
        setError(result.data || result.message || result.msg || '发送验证码失败，请重试');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || '网络错误，请检查您的连接');
      } else {
        setError('发送验证码失败，请重试');
      }
      console.error('Send SMS code error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Resend code
  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setError('');
    setLoading(true);
    
    try {
      const result = await apiClient.sendSmsCode(phone);

      if (result.code === 200) {
        setCountdown(60);
        setError('');
      } else {
        setError(result.data || result.message || result.msg || '发送验证码失败，请重试');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || '网络错误，请检查您的连接');
      } else {
        setError('发送验证码失败，请重试');
      }
      console.error('Resend SMS code error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code (just validate, don't create account yet)
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code || code.length !== 6) {
      setError('请输入6位验证码');
      return;
    }

    setLoading(true);
    try {
      // Verify the code with backend
      const result = await apiClient.verifySmsCode(phone, code);

      if (result.code === 200) {
        // Verification successful, proceed to password setup
        setStep('password');
        setError('');
      } else {
        setError(result.msg || result.message || '验证码错误，请重试');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || '验证失败，请重试');
      } else {
        setError('验证失败，请重试');
      }
      console.error('Verify SMS code error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set password and complete registration
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password
    if (password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      // Register the user with the verified phone and password
      await registerWithSms(phone, code, password);
      // registerWithSms will handle setting the user state and token
      navigate('/');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || '注册失败，请重试');
      } else if (err instanceof Error) {
        setError(err.message || '注册失败，请重试');
      } else {
        setError('注册失败，请重试');
      }
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Navigation helpers
  const handleBack = () => {
    if (step === 'verify') {
      setStep('phone');
      setCode('');
      setError('');
    } else if (step === 'password') {
      setStep('verify');
      setPassword('');
      setConfirmPassword('');
      setError('');
    }
  };

  // Format phone number for display
  const formatPhoneDisplay = (phone: string): string => {
    if (phone.length !== 11) return phone;
    return `${phone.slice(0, 3)}****${phone.slice(7)}`;
  };

  return (
    <div className="w-full">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium ${step === 'phone' ? 'text-teal-600' : 'text-gray-400'}`}>
            1. 验证手机
          </span>
          <span className={`text-xs font-medium ${step === 'verify' ? 'text-teal-600' : 'text-gray-400'}`}>
            2. 验证码
          </span>
          <span className={`text-xs font-medium ${step === 'password' ? 'text-teal-600' : 'text-gray-400'}`}>
            3. 设置密码
          </span>
        </div>
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-teal-600 transition-all duration-300"
            style={{ 
              width: step === 'phone' ? '33%' : step === 'verify' ? '66%' : '100%' 
            }}
          />
        </div>
      </div>

      {/* Step 1: Phone Number */}
      {step === 'phone' && (
        <form onSubmit={handleSendCode} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-2">
              手机号码
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                +86
              </span>
              <input
                id="signup-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="请输入手机号码"
                className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              我已阅读并同意
              <a href="/terms" target="_blank" className="text-teal-600 hover:text-teal-700 mx-1">
                服务条款
              </a>
              和
              <a href="/privacy" target="_blank" className="text-teal-600 hover:text-teal-700 mx-1">
                隐私政策
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || phone.length !== 11 || !acceptTerms}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            {loading ? '发送中...' : '获取验证码'}
          </button>

          <div className="text-center text-sm text-gray-600">
            已有账号？
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-teal-600 hover:text-teal-700 font-medium ml-1"
            >
              立即登录
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Verify Code */}
      {step === 'verify' && (
        <form onSubmit={handleVerifyCode} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="bg-teal-50 border border-teal-200 text-teal-700 px-4 py-3 rounded-lg text-sm">
            验证码已发送至 +86 {formatPhoneDisplay(phone)}
          </div>

          <div>
            <label htmlFor="signup-code" className="block text-sm font-medium text-gray-700 mb-2">
              验证码
            </label>
            <input
              id="signup-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="请输入6位验证码"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-center text-2xl tracking-widest"
              disabled={loading}
              maxLength={6}
              required
              autoFocus
            />
          </div>

          <div className="text-center text-sm">
            {countdown > 0 ? (
              <span className="text-gray-500">
                {countdown}秒后可重新发送
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                className="text-teal-600 hover:text-teal-700 font-medium"
                disabled={loading}
              >
                重新发送验证码
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            {loading ? '验证中...' : '验证并继续'}
          </button>

          <button
            type="button"
            onClick={handleBack}
            className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 transition-colors"
          >
            ← 返回修改手机号
          </button>
        </form>
      )}

      {/* Step 3: Set Password */}
      {step === 'password' && (
        <form onSubmit={handleSetPassword} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="bg-teal-50 border border-teal-200 text-teal-700 px-4 py-3 rounded-lg text-sm">
            手机号验证成功！请设置您的登录密码
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              设置密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码（至少6位）"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              disabled={loading}
              minLength={6}
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
              确认密码
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入密码"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              disabled={loading}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !password || !confirmPassword}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            {loading ? '创建中...' : '创建账号'}
          </button>

          <button
            type="button"
            onClick={handleBack}
            className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 transition-colors"
          >
            ← 返回
          </button>
        </form>
      )}
    </div>
  );
};

export default PhoneSignup;
