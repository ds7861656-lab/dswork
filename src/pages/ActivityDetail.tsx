import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import ActivityDetailInfo from '../components/activity/ActivityDetailInfo';
import ActivityBookingForm from '../components/activity/ActivityBookingForm';
import { mockActivities } from '../data/mockActivities';
import EmptyState from '../components/ui/EmptyState';

const ActivityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const activity = mockActivities.find(a => a.id === id);

  const breadcrumbItems = [
    { label: t('activity.title') || 'Activity reservation', href: '/activity' },
    { label: t('activity.bookingDetail') || 'Booking details' }
  ];

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb
            items={breadcrumbItems}
            className="mb-8"
          />
          <EmptyState
            title={t('activity.notFound') || 'Activity not found'}
            description={t('activity.notFoundDesc') || 'The requested activity does not exist or has been removed.'}
          />
          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate('/activity')}
              className="px-6 py-2.5 bg-[#2d4b5a] text-white rounded-xl font-medium hover:bg-[#1f3642] transition-colors"
            >
              {t('activity.backToList') || 'Back to Activities'}
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={breadcrumbItems}
          className="mb-8"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: Info card */}
          <div className="lg:col-span-2">
            <ActivityDetailInfo activity={activity} />
          </div>

          {/* Right: Booking form */}
          <div className="lg:col-span-3">
            <ActivityBookingForm activity={activity} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ActivityDetail;
