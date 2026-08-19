import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import EmptyState from '../components/ui/EmptyState';
import { mockActivities } from '../data/mockActivities';
import {
  type ActivityBookingFormData,
  calculateActivityTotal,
  parsePriceToNumber
} from '../types/activity';

interface ActivityBookingConfirmLocationState {
  formData: ActivityBookingFormData;
}

function formatISODate(iso?: string): string {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return format(d, 'yyyy-MM-dd');
  } catch {
    return '-';
  }
}

function formatTotalPriceToRMB(n: number): string {
  const rounded = Math.round(n);
  return `${rounded} rmb`;
}

const ActivityBookingConfirm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const state = location.state as ActivityBookingConfirmLocationState | null;
  const formData = state?.formData;

  const activity = id ? mockActivities.find((a) => a.id === id) : undefined;

  const breadcrumbItems = [
    { label: t('activity.title') || 'Activity reservation', href: '/activity' },
    { label: t('activity.bookingDetail') || 'Booking details', href: id ? `/activity/${id}` : '/activity' },
    { label: t('activity.booking.confirm') || 'Order Confirmation' }
  ];

  if (!activity || !formData) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={breadcrumbItems} className="mb-8" />
          <EmptyState
            title={t('activity.booking.notFound') || 'Booking information not found'}
            description={
              t('activity.booking.notFoundDesc') ||
              'Please return to the activity page and resubmit the booking form.'
            }
          />
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={() => navigate(id ? `/activity/${id}` : '/activity')}
              className="px-6 py-2.5 bg-[#2d4b5a] text-white rounded-xl font-medium hover:bg-[#1f3642] transition-colors"
            >
              {t('activity.booking.backToActivity') || 'Back to Activity'}
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totals = calculateActivityTotal(
    activity,
    formData.placeCount,
    formData.goproCount
  );

  void parsePriceToNumber;

  const dateLabel =
    formData.bookingType === 'dateRange'
      ? `${formatISODate(formData.startDateObjISO)} ~ ${formatISODate(formData.endDateObjISO)}`
      : formatISODate(formData.singleDateObjISO);

  const placeLabel = `${formData.placeCount} ${t('activity.person') || 'person'}`;
  const goproLabel = activity.hasGoPro
    ? `${formData.goproCount} ${t('activity.person') || 'person'}`
    : undefined;

  const guideLanguagesLabel = activity.guideLanguages?.length
    ? activity.guideLanguages.join(', ')
    : undefined;

  const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(' ') || '-';
  const emailText = formData.email || '-';
  const phoneText = formData.phone ? `${formData.countryCode || ''} ${formData.phone}` : '-';

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm px-8 py-10 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2d4b5a] tracking-wide mb-5">
              {t('activity.booking.confirmed')}
            </h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#2d4b5a] mb-10">
              {activity.title}
            </h2>

            <div className="space-y-3 text-[#6b7280] text-sm sm:text-base mb-8">
              <div>
                <span className="font-semibold text-[#2d4b5a] mr-2">
                  {t('activity.booking.date')}:
                </span>
                {dateLabel}
              </div>
              <div>
                <span className="font-semibold text-[#2d4b5a] mr-2">
                  {t('activity.booking.place')}:
                </span>
                {placeLabel}
              </div>
              {goproLabel !== undefined && (
                <div>
                  <span className="font-semibold text-[#2d4b5a] mr-2">
                    {t('activity.goproFilm.title')}:
                  </span>
                  {goproLabel}
                </div>
              )}
              {guideLanguagesLabel && (
                <div>
                  <span className="font-semibold text-[#2d4b5a] mr-2">
                    {t('activity.booking.liveGuide')}:
                  </span>
                  {guideLanguagesLabel}
                </div>
              )}
              <div className="pt-2 space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-[#2d4b5a] mr-2">
                    {t('activity.firstName')} / {t('activity.lastName')}:
                  </span>
                  {fullName}
                </div>
                <div>
                  <span className="font-semibold text-[#2d4b5a] mr-2">
                    {t('activity.email')}:
                  </span>
                  {emailText}
                </div>
                <div>
                  <span className="font-semibold text-[#2d4b5a] mr-2">
                    {t('activity.mobilePhone')}:
                  </span>
                  {phoneText}
                </div>
              </div>
              <div className="pt-2 text-xs sm:text-sm">
                {t('activity.booking.refund')}
              </div>
            </div>

            <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-10">
              <span className="mr-2">{t('activity.booking.totalPrice')}:</span>
              <span>{formatTotalPriceToRMB(totals.totalAmount)}</span>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {}}
                className="px-8 py-3 bg-[#2d4b5a] text-white rounded-2xl font-bold text-lg hover:bg-[#1f3642] transition-colors shadow-sm"
              >
                {t('activity.booking.pay')}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ActivityBookingConfirm;
