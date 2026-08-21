import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import ActivityCard from '../components/activity/ActivityCard';
import EmptyState from '../components/ui/EmptyState';
import { activityService } from '../services/api/activityService';
import { type Activity as ActivityType } from '../types/activity';

const Activity: React.FC = () => {
  const { t } = useTranslation();

  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activityService
      .getActivities()
      .then(setActivities)
      .catch((err) => console.error('获取活动列表失败', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: t('activity.activityreservation') || 'Activity reservation', href: '/activity' }
          ]}
          className="mb-8"
        />

        <div className="bg-white rounded-[2.5rem] shadow-sm p-6 sm:p-10">
          <h1 className="text-xl font-bold text-gray-900 mb-10">
            {t('activity.title') || 'Activity reservation'}
          </h1>

          {loading ? (
            <p className="text-center text-gray-500 py-10">Loading...</p>
          ) : activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t('activity.noActivitiesTitle') || 'No activities found'}
              description={t('activity.noActivitiesDesc') || 'There are currently no activities available for this destination.'}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Activity;
