import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../Header';
import Footer from '../Footer';
import ProfileNav from '../ProfileNav';
import Breadcrumb from '../Breadcrumb';

interface ProfileLayoutProps {
  children: React.ReactNode;
  activeTab: 'profile' | 'subscription' | 'trips' | 'notifications';
  breadcrumbItems?: { label: string; href?: string }[];
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ 
  children, 
  activeTab,
  breadcrumbItems
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Handle navigation when tabs are clicked
  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'profile':
        navigate('/profile');
        break;
      case 'subscription':
        navigate('/subscription');
        break;
      case 'trips':
        navigate('/trips');
        break;
      case 'notifications':
        navigate('/notifications');
        break;
      default:
        navigate('/profile');
    }
  };

  // Default breadcrumbs if none provided
  const defaultBreadcrumbs = [
    { label: t('header.home'), href: '/' },
    { label: t('profileNav.profile'), href: '/profile' }
  ];

  const crumbs = breadcrumbItems || defaultBreadcrumbs;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header showNavLinks={false} />

      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Section */}
        <div className="mb-6">
          <Breadcrumb items={crumbs} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation Area */}
          <aside className="lg:w-64 shrink-0">
            {/* 
              Sticky positioning keeps the nav visible while scrolling long content.
              Added styling to match the card aesthetic we will use for trips.
            */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:sticky lg:top-24">
              <ProfileNav 
                activeTab={activeTab} 
                onTabChange={handleTabChange}
                orientation="vertical"
                variant="default"
                className="w-full"
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* We don't force a background here, allowing the children (e.g., Trips.tsx) 
                to decide if they want a white card or a transparent grid layout */}
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfileLayout;