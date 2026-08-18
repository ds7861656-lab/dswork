import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import ActivityCard from '../components/activity/ActivityCard';
import { mockActivities } from '../data/mockActivities';
import EmptyState from '../components/ui/EmptyState';

const Activity: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  // 根据路由 id (对应的就是 galleryId) 筛选出属于这个画廊的活动
  const currentActivities = mockActivities.filter(activity => activity.galleryId === id);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: t('header.home') || 'Home', href: '/' },
            { label: 'Activity reservation', href: `/activity/${id}` }
          ]}
          className="mb-8"
        />

        <div className="bg-white rounded-[2.5rem] shadow-sm p-6 sm:p-10">
          <h1 className="text-xl font-bold text-gray-900 mb-10">
            Activity reservation
          </h1>
          
          {currentActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {currentActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No activities found"
              description="There are currently no activities available for this destination."
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Activity;
