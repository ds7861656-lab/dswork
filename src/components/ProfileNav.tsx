import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProfileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  notificationCount?: number;
  showNotificationBadge?: boolean;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'pills' | 'underline';
  mobileBreakpoint?: 'sm' | 'md' | 'lg';
  tabs?: string[];
}

const ProfileNav: React.FC<ProfileNavProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  notificationCount = 0,
  showNotificationBadge = true,
  className = '',
  orientation = 'horizontal',
  size = 'md',
  variant = 'default',
  mobileBreakpoint = 'md',
  tabs,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useAuth();

  // Default tabs if not provided
  const defaultTabs = ['profile', 'subscription', 'trips', 'notifications'];
  const navigationTabs = tabs || defaultTabs;

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      setIsLogoutModalOpen(true);
    }
  };

  const confirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
    navigate('/login');
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'profile':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'subscription':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'trips':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'notifications':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'profile':
        return t('profileNav.profile');
      case 'subscription':
        return t('profileNav.subscription');
      case 'trips':
        return t('profileNav.trips');
      case 'notifications':
        return t('profileNav.notifications');
      default:
        return tab;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const getVariantClasses = (isActive: boolean) => {
    switch (variant) {
      case 'pills':
        return isActive
          ? 'bg-teal-800 text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800';
      case 'underline':
        return isActive
          ? 'text-teal-800 border-b-2 border-teal-800'
          : 'text-gray-600 hover:text-teal-800';
      default:
        return isActive
          ? 'text-teal-800 font-semibold'
          : 'text-gray-600 hover:text-teal-800';
    }
  };

  const renderTab = (tab: string) => {
    const isActive = activeTab === tab;
    const hasNotification = tab === 'notifications' && notificationCount > 0;
    
    return (
      <button
        key={tab}
        className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 rounded-md ${getSizeClasses()} ${getVariantClasses(isActive)}`}
        onClick={() => handleTabChange(tab)}
        aria-current={isActive ? 'page' : undefined}
      >
        {getTabIcon(tab)}
        <span>{getTabLabel(tab)}</span>
        {hasNotification && showNotificationBadge && (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
            {notificationCount > 99 ? '99+' : notificationCount}
          </span>
        )}
      </button>
    );
  };

  const renderLogoutButton = () => (
    <button
      className={`flex items-center gap-2 px-4 py-2 font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-md ${getSizeClasses()}`}
      onClick={handleLogout}
      aria-label={t('profileNav.logout')}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span>{t('profileNav.logout')}</span>
    </button>
  );

  // Desktop Navigation
  const renderDesktopNav = () => (
    <nav className={`${orientation === 'vertical' ? 'flex-col' : 'flex'} gap-2 ${className}`}>
      {navigationTabs.map(renderTab)}
      {renderLogoutButton()}
    </nav>
  );

  // Mobile Navigation
  const renderMobileNav = () => (
    <div className={`md:hidden ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-800">{t('profileNav.title')}</h2>
        <button
          className="p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? t('profileNav.closeMenu') : t('profileNav.openMenu')}
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="mt-4 bg-white rounded-lg shadow-lg p-4">
          <nav className="flex flex-col gap-2">
            {navigationTabs.map(renderTab)}
            {renderLogoutButton()}
          </nav>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className={`hidden ${mobileBreakpoint}:block`}>
        {renderDesktopNav()}
      </div>
      {renderMobileNav()}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('profileNav.logoutConfirmation')}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {t('profileNav.logoutMessage')}
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                onClick={() => setIsLogoutModalOpen(false)}
              >
                {t('profileNav.cancel')}
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                onClick={confirmLogout}
              >
                {t('profileNav.logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileNav;