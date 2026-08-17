import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  notificationCount?: number;
  showNotificationBadge?: boolean;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
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
  orientation = 'vertical', // Default changed to vertical for dashboard look
  mobileBreakpoint = 'md',
  tabs,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useAuth();

  const defaultTabs = ['profile', 'subscription', 'trips', 'notifications'];
  const navigationTabs = tabs || defaultTabs;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      setIsLogoutModalOpen(true);
    }
  };

  const confirmLogout = async () => {
    setIsLogoutModalOpen(false);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        );
      case 'notifications':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        );
    }
  };

  const getTabLabel = (tab: string) => {
    // Check if translation exists, otherwise capitalize
    const key = `profileNav.${tab}`;
    const label = t(key);
    return label === key ? tab.charAt(0).toUpperCase() + tab.slice(1) : label;
  };

  // Render a single navigation button
  const renderNavButton = (tab: string) => {
    const isActive = activeTab === tab;
    const hasNotification = tab === 'notifications' && notificationCount > 0;
    
    return (
      <button
        key={tab}
        onClick={() => handleTabChange(tab)}
        className={`
          group w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
          ${isActive 
            ? 'bg-teal-50 text-teal-700 shadow-xs' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }
        `}
      >
        <div className="flex items-center gap-3">
          <span className={`${isActive ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-500'}`}>
            {getTabIcon(tab)}
          </span>
          <span>{getTabLabel(tab)}</span>
        </div>
        
        {hasNotification && showNotificationBadge && (
          <span className={`
            inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none rounded-full
            ${isActive ? 'bg-teal-200 text-teal-800' : 'bg-red-100 text-red-600'}
          `}>
            {notificationCount > 99 ? '99+' : notificationCount}
          </span>
        )}
      </button>
    );
  };

  // Render Desktop Sidebar
  const renderDesktopNav = () => (
    <nav className={`
      ${orientation === 'vertical' ? 'flex flex-col h-full' : 'flex items-center gap-2'} 
      ${className}
    `}>
      <div className="space-y-1 w-full">
        {navigationTabs.map(renderNavButton)}
      </div>

      {/* Spacer to push logout to bottom in vertical mode */}
      {orientation === 'vertical' && <div className="flex-grow min-h-[2rem]" />}

      {/* Logout Button */}
      <div className={`${orientation === 'vertical' ? 'mt-auto pt-4 border-t border-gray-100' : ''}`}>
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>{t('profileNav.logout')}</span>
        </button>
      </div>
    </nav>
  );

  // Render Mobile Menu (Dropdown/Accordion style)
  const renderMobileNav = () => (
    <div className={`md:hidden mb-6 ${className}`}>
      <div className="relative">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 font-medium"
        >
          <div className="flex items-center gap-2">
            <span className="text-teal-600">{getTabIcon(activeTab)}</span>
            <span>{getTabLabel(activeTab)}</span>
          </div>
          <svg 
            className={`w-5 h-5 transition-transform duration-200 ${isMobileMenuOpen ? 'transform rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="absolute top-full left-0 right-0 z-20 mt-2 bg-white border border-gray-100 rounded-lg shadow-lg py-1 overflow-hidden">
            {navigationTabs.map(tab => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors
                  ${activeTab === tab ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'}
                `}
              >
                {getTabIcon(tab)}
                {getTabLabel(tab)}
              </button>
            ))}
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {t('profileNav.logout')}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop/Tablet Sidebar */}
      <div className={`hidden ${mobileBreakpoint}:block h-full`}>
        {renderDesktopNav()}
      </div>
      
      {/* Mobile Dropdown */}
      {renderMobileNav()}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsLogoutModalOpen(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {t('profileNav.logoutConfirmation')}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {t('profileNav.logoutMessage')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmLogout}
                >
                  {t('profileNav.logout')}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsLogoutModalOpen(false)}
                >
                  {t('profileNav.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileNav;