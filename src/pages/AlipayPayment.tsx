import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QRCodeCanvas } from 'qrcode.react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { createAlipayOrder, checkOrderStatus, getPlanDetails } from '../services/paymentApi';

interface LocationState {
  planId: string;
  planName?: string;
  planPrice?: number;
  paymentMethod: string;
}

type PaymentStatus = 'loading' | 'ready' | 'polling' | 'success' | 'error';

// Detect if payQrCode is a URL or an HTML form
const isQrUrl = (payQrCode: string): boolean => {
  return payQrCode.startsWith('http');
};

const AlipayPayment: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [payQrCode, setPayQrCode] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [orderData, setOrderData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [pollingAttempt, setPollingAttempt] = useState<number>(0);
  const [lastStatus, setLastStatus] = useState<number | null>(null);
  const [isManualChecking, setIsManualChecking] = useState(false);
  const [payWindowOpened, setPayWindowOpened] = useState(false);

  const initRef = useRef(false);
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptRef = useRef(0);
  const orderNoRef = useRef('');
  const orderObjRef = useRef<any>(null);
  const statusRef = useRef<PaymentStatus>('loading');
  const isCheckingRef = useRef(false);
  const payWindowRef = useRef<Window | null>(null);

  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { if (!state?.planId) navigate('/pricing'); }, [state, navigate]);

  // ============================================================================
  // NAVIGATE TO RESULT
  // ============================================================================
  const goToResultPage = useCallback((orderNo: string, order: any) => {
    if (pollingRef.current) { clearTimeout(pollingRef.current); pollingRef.current = null; }
    setStatus('success');
    setTimeout(() => {
      navigate('/payment/result', {
        state: {
          planId: state?.planId,
          planName: getPlanDetails(state?.planId || 'month').name,
          planPrice: order?.amount,
          currency: 'CNY',
          currencySymbol: '¥',
          paymentMethod: t('trips.alipay', 'Alipay'),
          orderNumber: orderNo,
          orderData: order,
          vipTypeId: order?.vipTypeId || order?.levelId,
          startTime: order?.startTime,
          endTime: order?.endTime,
        },
      });
    }, 1500);
  }, [navigate, state, t]);

  // ============================================================================
  // OPEN HTML FORM IN NEW TAB (fallback for old backend format)
  // ============================================================================
  const openAlipayWindow = useCallback((formHtml: string) => {
    const payWindow = window.open('', '_blank');
    if (!payWindow) {
      alert(t('trips.alipayAllowPopups', 'Please allow popups for this site, then click the button again.'));
      return false;
    }
    payWindowRef.current = payWindow;
    payWindow.document.open();
    payWindow.document.write(`
<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Alipay - 支付宝支付</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f5f5f5}.loading{text-align:center;color:#666}.spinner{width:40px;height:40px;border:3px solid #e0e0e0;border-top-color:#1677FF;border-radius:50%;animation:s .8s linear infinite;margin:0 auto 16px}@keyframes s{to{transform:rotate(360deg)}}</style>
</head><body><div class="loading"><div class="spinner"></div><p>正在跳转到支付宝...</p></div>${formHtml}</body></html>`);
    payWindow.document.close();
    return true;
  }, [t]);

  // ============================================================================
  // STATUS CHECK
  // ============================================================================
  const doStatusCheck = useCallback(async (orderNo: string, order: any, source: string): Promise<number> => {
    if (isCheckingRef.current) return -1;
    if (statusRef.current === 'success') return 1;
    isCheckingRef.current = true;
    try {
      const statusValue = await checkOrderStatus(orderNo);
      console.log(`📡 [${source}] Status: ${statusValue}`);
      setLastStatus(statusValue);
      if (statusValue === 1) goToResultPage(orderNo, order);
      if (statusValue === 2) {
        if (pollingRef.current) { clearTimeout(pollingRef.current); pollingRef.current = null; }
        setErrorMessage(t('trips.alipayPaymentCancelled', 'Payment was cancelled'));
        setStatus('error');
      }
      return statusValue;
    } catch (error: any) {
      console.error(`⚠️ [${source}]`, error.message);
      return -1;
    } finally {
      isCheckingRef.current = false;
    }
  }, [goToResultPage, t]);

  // ============================================================================
  // POLLING
  // ============================================================================
  const pollStatus = useCallback((orderNo: string, order: any, attempt: number) => {
    if (attempt >= 120) {
      setErrorMessage(t('trips.alipayTimeout', 'Payment verification timed out.'));
      setStatus('error');
      return;
    }
    attemptRef.current = attempt;
    setPollingAttempt(attempt);

    const runCheck = async () => {
      if (statusRef.current === 'success' || statusRef.current === 'error') return;
      const result = await doStatusCheck(orderNo, order, `poll-${attempt + 1}`);
      const stillPolling = ['loading', 'ready', 'polling'].includes(statusRef.current);
      if (result !== 1 && result !== 2 && stillPolling) {
        const next = attempt + 1;
        attemptRef.current = next;
        setPollingAttempt(next);
        pollingRef.current = setTimeout(() => pollStatus(orderNo, order, next), 3000);
      }
    };
    runCheck();
  }, [doStatusCheck, t]);

  const startPolling = useCallback((orderNo: string, order: any) => {
    setStatus('polling');
    attemptRef.current = 0;
    setPollingAttempt(0);
    pollStatus(orderNo, order, 0);
  }, [pollStatus]);

  // ============================================================================
  // TAB FOCUS — instant check
  // ============================================================================
  useEffect(() => {
    const check = () => {
      const active = ['loading', 'ready', 'polling'].includes(statusRef.current);
      if (orderNoRef.current && active) {
        doStatusCheck(orderNoRef.current, orderObjRef.current, 'tab-focus');
      }
    };
    const onVis = () => { if (document.visibilityState === 'visible') check(); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', check);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', check);
    };
  }, [doStatusCheck]);

  // ============================================================================
  // MONITOR NEW TAB (for HTML form fallback)
  // ============================================================================
  useEffect(() => {
    if (!payWindowOpened || !payWindowRef.current) return;
    const iv = setInterval(() => {
      const pw = payWindowRef.current;
      if (!pw) { clearInterval(iv); return; }
      if (pw.closed) {
        clearInterval(iv);
        const active = ['loading', 'ready', 'polling'].includes(statusRef.current);
        if (orderNoRef.current && active) doStatusCheck(orderNoRef.current, orderObjRef.current, 'tab-closed');
        return;
      }
      try {
        const url = pw.location.href;
        if (url?.includes('/alipay/return')) {
          clearInterval(iv);
          try { pw.close(); } catch {}
          const active = ['loading', 'ready', 'polling'].includes(statusRef.current);
          if (active) goToResultPage(orderNoRef.current, orderObjRef.current);
        }
      } catch {}
    }, 1000);
    return () => clearInterval(iv);
  }, [payWindowOpened, doStatusCheck, goToResultPage]);

  // ============================================================================
  // CREATE ORDER
  // ============================================================================
  useEffect(() => {
    const init = async () => {
      if (!state?.planId || initRef.current) return;
      initRef.current = true;
      try {
        setStatus('loading');
        const order = await createAlipayOrder(state.planId);
        console.log('✅ Order:', order.orderNo, '| payQrCode type:', isQrUrl(order.payQrCode) ? 'URL' : 'HTML form');

        orderNoRef.current = order.orderNo;
        orderObjRef.current = order;
        setPayQrCode(order.payQrCode);
        setOrderNumber(order.orderNo);
        setOrderData(order);
        setStatus('ready');

        // If HTML form, auto-open in new tab
        if (!isQrUrl(order.payQrCode)) {
          const opened = openAlipayWindow(order.payQrCode);
          if (opened) setPayWindowOpened(true);
        }

        // Start polling
        setTimeout(() => startPolling(order.orderNo, order), 3000);
      } catch (error: any) {
        setErrorMessage(error.message || t('trips.alipayOrderFailed', 'Failed to create order'));
        setStatus('error');
      }
    };
    init();
    return () => { if (pollingRef.current) clearTimeout(pollingRef.current); };
  }, [state?.planId]);

  // ============================================================================
  // HANDLERS
  // ============================================================================
  const handleManualCheck = async () => {
    if (!orderNumber) return;
    setIsManualChecking(true);
    try {
      const result = await doStatusCheck(orderNumber, orderData, 'manual');
      if (result === 0) {
        alert(t('trips.alipayStillPending', 'Payment is still pending.\n\nMake sure you scanned and confirmed in Alipay, then try again.'));
      }
    } finally { setIsManualChecking(false); }
  };

  const handleProceedAnyway = () => {
    if (pollingRef.current) { clearTimeout(pollingRef.current); pollingRef.current = null; }
    goToResultPage(orderNumber, orderData);
  };

  const handleOpenAlipay = () => {
    if (!payQrCode) return;
    if (!isQrUrl(payQrCode)) {
      const opened = openAlipayWindow(payQrCode);
      if (opened) {
        setPayWindowOpened(true);
        if (status === 'ready') setTimeout(() => startPolling(orderNumber, orderData), 2000);
      }
    }
  };

  const handleRetry = () => navigate(-1);
  const planDetails = getPlanDetails(state?.planId || 'month');
  const qrIsUrl = payQrCode ? isQrUrl(payQrCode) : false;

  // ✅ Subtitle text based on status
  const getSubtitle = (): string => {
    if (status === 'loading') return t('trips.alipayPreparing', 'Preparing your payment...');
    if (status === 'success') return t('trips.alipayConfirmed', 'Payment Confirmed!');
    if (qrIsUrl) return t('trips.scanQR', 'Scan QR code with Alipay app');
    return t('trips.alipayWaitingConfirmation', 'Waiting for payment confirmation...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              {t('trips.alipay', 'Alipay')} {t('trips.paymentTitle', 'Payment')}
            </h1>
            <p className="text-lg text-slate-600">
              {getSubtitle()}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

            {/* LOADING */}
            {status === 'loading' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-[#1677FF] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">{t('trips.alipayCreatingOrder', 'Creating your order...')}</p>
              </div>
            )}

            {/* READY / POLLING */}
            {(status === 'ready' || status === 'polling') && (
              <div className="text-center">
                {/* ========== ALIPAY BRANDED FRAME ========== */}
                <div className="mb-8 flex justify-center">
                  <div className="w-full max-w-[400px]">
                    <div className="rounded-2xl overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #1677FF 0%, #0958d9 100%)', padding: '3px' }}>
                      <div className="bg-white rounded-[13px] overflow-hidden">

                        {/* Top bar — Alipay branding */}
                        <div className="flex items-center justify-center gap-2 py-3"
                          style={{ background: 'linear-gradient(135deg, #1677FF 0%, #0958d9 100%)' }}>
                          <svg viewBox="0 0 200 60" width="120" height="36" xmlns="http://www.w3.org/2000/svg">
                            <rect x="4" y="8" width="44" height="44" rx="10" fill="rgba(255,255,255,0.15)" />
                            <text x="26" y="38" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="bold" fontFamily="Arial">支</text>
                            <text x="60" y="28" fill="#fff" fontSize="20" fontWeight="700" fontFamily="Arial" letterSpacing="0.5">Alipay</text>
                            <text x="60" y="46" fill="rgba(255,255,255,0.75)" fontSize="11" fontFamily="Arial">支付宝安全支付</text>
                          </svg>
                        </div>

                        {/* QR Code area */}
                        <div className="px-6 pt-6 pb-4 bg-white flex justify-center">
                          {qrIsUrl ? (
                            <div className="relative">
                              <QRCodeCanvas
                                value={payQrCode}
                                size={260}
                                level="H"
                                includeMargin={true}
                                bgColor="#ffffff"
                                fgColor="#222222"
                                imageSettings={{
                                  src: 'data:image/svg+xml,' + encodeURIComponent(
                                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#1677FF"/><text x="20" y="28" text-anchor="middle" fill="white" font-size="20" font-weight="bold" font-family="Arial">支</text></svg>'
                                  ),
                                  height: 40,
                                  width: 40,
                                  excavate: true,
                                }}
                              />
                            </div>
                          ) : (
                            <div className="py-8 w-full">
                              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0f6ff' }}>
                                <svg className="w-8 h-8" style={{ color: '#1677FF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                              </div>
                              <p className="text-sm text-slate-700 font-medium mb-1">
                                {payWindowOpened ? t('trips.alipayPageOpened', 'Alipay page opened in new tab') : t('trips.alipayClickToOpen', 'Click below to open payment')}
                              </p>
                              <button onClick={handleOpenAlipay}
                                className="mt-3 w-full py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90"
                                style={{ background: 'linear-gradient(135deg, #1677FF 0%, #0958d9 100%)' }}>
                                {payWindowOpened ? `🔄 ${t('trips.alipayReopenPage', 'Re-open Alipay Page')}` : `💳 ${t('trips.alipayOpenPage', 'Open Alipay Payment Page')}`}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Order number */}
                        <div className="px-6 py-3 border-t" style={{ borderColor: '#e8f0fe' }}>
                          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{t('trips.orderNumber', 'Order Number')}</span>
                          </div>
                          <p className="font-mono text-xs text-slate-600 tracking-wide text-center select-all">{orderNumber}</p>
                        </div>

                        {/* Scan instruction */}
                        <div className="py-2.5 text-center border-t" style={{ borderColor: '#e8f0fe', backgroundColor: '#f0f6ff' }}>
                          <p className="text-sm font-medium" style={{ color: '#1677FF' }}>
                            {qrIsUrl ? t('trips.alipayScanInstruction', '打开支付宝 扫一扫付款') : t('trips.alipayCompleteInTab', 'Complete payment in the new tab')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Polling Status */}
                {status === 'polling' && (
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2" style={{ color: '#1677FF' }}>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#1677FF', animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#1677FF', animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#1677FF', animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-sm font-medium">{t('trips.alipayVerifying', 'Verifying payment...')}</span>
                    </div>
                    <p className="text-xs text-slate-500">{t('trips.alipayAttempt', { current: pollingAttempt, max: 120, defaultValue: `Attempt ${pollingAttempt}/120` })}</p>
                    {lastStatus !== null && (
                      <p className="text-xs text-slate-500 mt-1">
                        {t('trips.status', 'Status')}: {lastStatus === 0 ? `⏳ ${t('trips.alipayStatusWaiting', 'Waiting')}` : lastStatus === 1 ? `✅ ${t('trips.alipayStatusPaid', 'Paid')}` : lastStatus === 2 ? `❌ ${t('trips.alipayStatusCancelled', 'Cancelled')}` : `❓ ${t('trips.alipayStatusUnknown', 'Unknown')}`}
                      </p>
                    )}
                  </div>
                )}

                {/* Order Info — Alipay always uses ¥ (CNY) */}
                <div className="bg-slate-50 rounded-xl p-6 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-600">{t('trips.subscriptionPlan', 'Subscription Plan')}:</span>
                    <span className="font-semibold text-slate-900">{planDetails.name}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                    <span className="text-slate-600">{t('trips.totalAmount', 'Total Amount')}:</span>
                    <span className="text-2xl font-bold" style={{ color: '#1677FF' }}>
                      ¥{orderData?.amount || planDetails.price}
                    </span>
                  </div>
                </div>

                {/* Manual Check */}
                <button onClick={handleManualCheck} disabled={isManualChecking}
                  className="mb-4 w-full max-w-sm mx-auto block px-6 py-3.5 text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #1677FF 0%, #0958d9 100%)' }}>
                  {isManualChecking ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t('trips.alipayCheckingStatus', 'Checking...')}
                    </span>
                  ) : `🔍 ${t('trips.alipayCheckNow', "I've Paid — Check Status Now")}`}
                </button>

                {/* Proceed anyway after 15+ failed polls */}
                {pollingAttempt >= 15 && (
                  <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#fff8e6', border: '1px solid #ffe7a3' }}>
                    <p className="text-sm text-amber-800 mb-3">
                      {t('trips.alipayProceedHint', 'Already completed payment? If status isn\'t updating automatically, proceed directly:')}
                    </p>
                    <button onClick={handleProceedAnyway}
                      className="w-full max-w-sm mx-auto block px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all">
                      ✅ {t('trips.alipayProceedConfirm', "I've Paid — Proceed to Confirmation")}
                    </button>
                  </div>
                )}

                {/* Instructions */}
                <div className="text-left space-y-3 rounded-xl p-6" style={{ backgroundColor: '#f0f6ff', border: '1px solid #bbd6ff' }}>
                  <h3 className="font-semibold mb-3" style={{ color: '#0958d9' }}>{t('trips.alipayHowToPay', 'How to pay')}:</h3>
                  {(qrIsUrl ? [
                    t('trips.alipayStep1_qr', 'Open Alipay app on your phone'),
                    t('trips.alipayStep2_qr', 'Tap "Scan" and scan the QR code above'),
                    t('trips.alipayStep3_qr', 'Confirm payment in Alipay'),
                    t('trips.alipayStep4_qr', 'This page detects payment automatically'),
                  ] : [
                    t('trips.alipayStep1_form', 'Click "Open Alipay Payment Page" above'),
                    t('trips.alipayStep2_form', 'Scan the QR code in the new tab'),
                    t('trips.alipayStep3_form', 'Confirm payment in Alipay app'),
                    t('trips.alipayStep4_form', 'Return to this tab — status updates automatically'),
                  ]).map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full text-white flex items-center justify-center flex-shrink-0 text-sm font-semibold"
                        style={{ backgroundColor: '#1677FF' }}>{i + 1}</div>
                      <p className="text-slate-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUCCESS */}
            {status === 'success' && (
              <div className="text-center py-12">
                <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('trips.alipayConfirmed', 'Payment Confirmed!')}</h2>
                <p className="text-slate-500 text-sm mb-2">{t('trips.orderNumber', 'Order Number')}: {orderNumber}</p>
                <p className="text-slate-600 mb-6">{t('trips.alipayRedirecting', 'Redirecting...')}</p>
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                </div>
              </div>
            )}

            {/* ERROR */}
            {status === 'error' && (
              <div className="text-center py-12">
                <XCircleIcon className="w-20 h-20 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('trips.alipayError', 'Payment Error')}</h2>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">{errorMessage}</p>
                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                  <button onClick={handleRetry}
                    className="px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #1677FF 0%, #0958d9 100%)' }}>
                    {t('trips.alipayRetry', 'Try Again')}
                  </button>
                  {orderNumber && (
                    <button onClick={handleManualCheck}
                      className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold">
                      {t('trips.alipayCheckOrderStatus', 'Check Order Status')}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {status === 'polling' && (
            <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#fff8e6', border: '1px solid #ffe7a3' }}>
              <p className="text-sm text-center font-medium" style={{ color: '#ad6800' }}>
                ⚠️ {t('trips.alipayKeepOpen', 'Keep this page open — payment is detected automatically')}
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AlipayPayment;
