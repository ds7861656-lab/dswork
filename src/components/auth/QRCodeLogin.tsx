import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, RefreshCw, CheckCircle2, ScanLine } from 'lucide-react';
import { useSnackbar } from '../../contexts/SnackbarContext';
// Mock auth service - to be implemented with real backend
const mockAuthService = {
  getQrCode: async (type: 'wechat' | 'alipay') => {
    const id = Math.random().toString(36).substring(7);
    return {
      qrId: id,
      qrUrl: `https://mock-qr.com/${type}/${id}`
    };
  },
  checkQrStatus: async (_qrId: string, elapsedSeconds: number) => {
    if (elapsedSeconds < 3) return { status: 'PENDING' };
    if (elapsedSeconds < 6) return { status: 'SCANNED' };
    return { status: 'CONFIRMED' };
  }
};

export type ProviderType = 'wechat' | 'alipay';

interface QRCodeLoginProps {
  provider: ProviderType;
}

const QRCodeLogin: React.FC<QRCodeLoginProps> = ({ provider }) => {
  const navigate = useNavigate();
  const { showSuccess } = useSnackbar();

  // State
  const [qrState, setQrState] = useState<'loading' | 'pending' | 'scanned' | 'confirmed' | 'expired'>('loading');
  const [qrUrl, setQrUrl] = useState<string>('');

  // Refs for cleanup
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef<number>(Date.now());

  // Config based on provider
  const config = {
    wechat: {
      color: 'text-green-600',
      bgColor: 'bg-green-600',
      lightBg: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: '/assets/wechat-icon.png', // Ensure you have these or use a Lucide icon as fallback
      name: '微信 (WeChat)',
    },
    alipay: {
      color: 'text-blue-600',
      bgColor: 'bg-blue-600',
      lightBg: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: '/assets/alipay-icon.png',
      name: '支付宝 (Alipay)',
    }
  }[provider];

  // 1. Initialize QR Session
  const initSession = async () => {
    setQrState('loading');
    try {
      const { qrUrl } = await mockAuthService.getQrCode(provider);
      setQrUrl(qrUrl);
      setQrState('pending');
      startTime.current = Date.now();
      startPolling(qrUrl); // In real app, you'd poll using a session ID
    } catch (error) {
      console.error('Failed to load QR', error);
    }
  };

  // 2. Poll for Status
  const startPolling = (currentQrId: string) => {
    if (pollTimer.current) clearInterval(pollTimer.current);

    pollTimer.current = setInterval(async () => {
      // Calculate elapsed time for mock simulation
      const elapsed = (Date.now() - startTime.current) / 1000;

      // Mock Service Call
      const result = await mockAuthService.checkQrStatus(currentQrId, elapsed);

      if (result.status === 'SCANNED' && qrState !== 'scanned') {
        setQrState('scanned');
      } else if (result.status === 'CONFIRMED') {
        handleSuccess();
      }
    }, 1000);
  };

  const handleSuccess = () => {
    if (pollTimer.current) clearInterval(pollTimer.current);
    setQrState('confirmed');
    showSuccess(`${config.name} 登录成功`);
    setTimeout(() => navigate('/'), 1000);
  };

  // Cleanup on unmount
  useEffect(() => {
    initSession();
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  return (
    <div className="flex flex-col items-center justify-center py-4 fade-in">
      {/* QR Container */}
      <div className="relative group">
        <div className={`w-48 h-48 rounded-xl border-2 ${config.borderColor} p-3 bg-white shadow-sm flex items-center justify-center relative overflow-hidden transition-all`}>

          {/* State: Loading */}
          {qrState === 'loading' && (
            <Loader2 className={`animate-spin ${config.color}`} size={32} />
          )}

          {/* State: Display QR (Active) */}
          {(qrState === 'pending' || qrState === 'scanned') && (
            <>
              {/* This is a placeholder QR generator image */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrUrl)}&color=${provider === 'alipay' ? '1677FF' : '07C160'}`}
                alt="Scan Code"
                className={`w-full h-full object-contain transition-all duration-300 ${qrState === 'scanned' ? 'blur-sm opacity-40' : ''}`}
              />

              {/* Scan Overlay Animation */}
              {qrState === 'pending' && (
                <div className={`absolute inset-0 border-b-2 ${config.borderColor} bg-gradient-to-b from-transparent to-white/10 animate-[scan_2s_infinite] pointer-events-none opacity-50`}></div>
              )}
            </>
          )}

          {/* State: Scanned (Waiting Confirmation) */}
          {qrState === 'scanned' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 z-10 animate-in fade-in zoom-in">
              <CheckCircle2 className={`${config.color} mb-2`} size={32} />
              <p className="text-sm font-bold text-gray-800">扫描成功</p>
              <p className="text-xs text-gray-500">请在手机上确认登录</p>
            </div>
          )}

          {/* State: Confirmed (Success) */}
          {qrState === 'confirmed' && (
             <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-20">
               <Loader2 className={`animate-spin ${config.color}`} size={32} />
               <p className="text-xs text-gray-500 mt-2">跳转中...</p>
             </div>
          )}

          {/* State: Expired (Timeout) - Optional implementation for realism */}
          {qrState === 'expired' && (
            <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10">
              <RefreshCw className="text-gray-400 mb-2 cursor-pointer hover:rotate-180 transition-transform" onClick={initSession} />
              <p className="text-xs text-gray-500">二维码已失效</p>
              <button onClick={initSession} className={`text-xs font-bold ${config.color} mt-1`}>刷新</button>
            </div>
          )}
        </div>
      </div>

      {/* Instructions Footer */}
      <div className="mt-6 text-center space-y-1">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${config.lightBg} ${config.color} text-sm font-medium`}>
          <ScanLine size={16} />
          <span>打开 {config.name} 扫一扫</span>
        </div>
      </div>
    </div>
  );
};

export default QRCodeLogin;