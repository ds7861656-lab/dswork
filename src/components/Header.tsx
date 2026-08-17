import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { ComponentErrorBoundary } from './error-boundaries/ComponentErrorBoundary';
import { locationService } from '../services/locationService';
import { MapPinIcon } from '@heroicons/react/24/solid'; 
import { MapPinIcon as MapPinOutline } from '@heroicons/react/24/outline';

interface HeaderProps {
  showToolbar?: boolean;
  showNavLinks?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  showToolbar = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  
  // Location State
  const [userLocation, setUserLocation] = useState<{ city: string; country: string } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  // --- Location Logic ---
  useEffect(() => {
    const fetchLocation = async () => {
      setLocationLoading(true);
      try {
        const loc = await locationService.getCurrentLocation();
        setUserLocation({ city: loc.city, country: loc.country });
      } catch (error) {
        console.error('Could not determine user location:', error);
      } finally {
        setLocationLoading(false);
      }
    };

    fetchLocation();
  }, []);

  // Handle click outside & Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      // Fix logic: check if click is outside menu AND not on the toggle button
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest('button[aria-controls="mobile-menu"]')) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsUserDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setLogoutError(t('header.logoutError'));
    } finally {
      setIsLoggingOut(false);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsDropdownOpen(false);
  };

  const isActiveLink = (path: string) => location.pathname === path;

  const languages = [
    { code: 'en', label: t('header.english'), flag: '🇬🇧' },
    { code: 'fr', label: t('header.french'), flag: '🇫🇷' },
    { code: 'es', label: t('header.spanish'), flag: '🇪🇸' },
    { code: 'zh', label: t('header.chinese'), flag: '🇨🇳' },
    { code: 'ar', label: t('header.arabic'), flag: '🇸🇦' },
  ];

  return (
    <ComponentErrorBoundary componentName="header">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-60 focus:px-4 focus:py-2 focus:bg-white focus:text-teal-900 focus:font-bold focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        {t('header.skipToMainContent')}
      </a>

      <header className="sticky top-0 z-50 bg-teal-900 border-b border-teal-800 shadow-md h-20 shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <nav className="flex justify-between items-center h-full" aria-label="Main Navigation">
            
            {/* Left: Logo & Location */}
            <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
              <Link
                to="/"
                className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-lg p-1 -ml-1"
                aria-label={t('header.afreshtripHome')}
              >
                <img 
                  src="/assets/tubiao.png" 
                  alt="" 
                  aria-hidden="true"
                  className="w-10 h-10 rounded-full border-2 border-teal-700 shadow-md group-hover:border-teal-500 transition-colors" 
                />
                <span className="text-xl md:text-2xl font-bold text-white tracking-tight group-hover:text-teal-200 transition-colors hidden xl:block">
                  Afreshtrip
                </span>
              </Link>

              {/* Location Badge */}
              <div className="flex items-center gap-2 px-2 py-1 md:px-3 md:py-1.5 bg-teal-800/50 rounded-full border border-teal-700/50 text-teal-100 text-xs font-medium animate-in fade-in duration-700">
                {locationLoading ? (
                  <>
                    <MapPinOutline className="w-3.5 h-3.5 animate-pulse" />
                    <span className="opacity-75 hidden xs:inline">Locating...</span>
                  </>
                ) : userLocation ? (
                  <>
                    <MapPinIcon className="w-3.5 h-3.5 text-teal-300" />
                    <span className="truncate max-w-[100px] sm:max-w-[150px]">
                      {userLocation.city}{userLocation.country ? `, ${userLocation.country}` : ''}
                    </span>
                  </>
                ) : (
                  <>
                    <MapPinOutline className="w-3.5 h-3.5 opacity-50" />
                    <span className="opacity-75 hidden xs:inline">World</span>
                  </>
                )}
              </div>

              {/* Vertical Separator */}
              <div className="hidden sm:block h-8 w-px bg-teal-800 mx-1"></div>

              {/* Language Selector (Desktop) */}
              <div className="relative hidden sm:block" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 px-2 py-2 rounded-lg text-teal-100 hover:bg-teal-800 hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 text-sm font-medium"
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  aria-label={t('header.language')}
                >
                  <span className="text-lg">{(languages.find(l => l.code === i18n.language)?.flag || '🌐')}</span>
                  <span className="pl-1">{languages.find(l => l.code === i18n.language)?.label || ""}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 animate-fade-in-up origin-top-left">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors ${
                          i18n.language === lang.code ? 'bg-teal-50 font-semibold text-teal-700' : ''
                        }`}
                        onClick={() => changeLanguage(lang.code)}
                      >
                        <span className="text-lg">{lang.flag}</span> {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Navigation Links */}
            <div className="flex items-center gap-4">
              
              {/* Desktop Nav Links */}
              <div className="hidden lg:flex items-center space-x-1">
                <Link 
                  to="/" 
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                    isActiveLink('/') 
                      ? 'bg-teal-800 text-white shadow-inner' 
                      : 'text-teal-100 hover:text-white hover:bg-teal-800/50'
                  }`}
                  aria-current={isActiveLink('/') ? 'page' : undefined}
                >
                  {t('header.home')}
                </Link>
                <Link 
                  to="/blog" 
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                    isActiveLink('/blog') 
                      ? 'bg-teal-800 text-white shadow-inner' 
                      : 'text-teal-100 hover:text-white hover:bg-teal-800/50'
                  }`}
                  aria-current={isActiveLink('/blog') ? 'page' : undefined}
                >
                  {t('header.blog')}
                </Link>

                {user && location.pathname === '/blog' && (
                  <Link
                    to="/blog/create"
                    className="flex items-center gap-1.5 px-3 py-1.5 ml-1 rounded-full text-sm font-medium text-teal-100 hover:text-white hover:bg-teal-700/50 transition-all border border-teal-700/50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>{t('header.add')}</span>
                  </Link>
                )}
                      <Link 
        to="/trips" 
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
          isActiveLink('/trips') 
            ? 'bg-teal-800 text-white shadow-inner' 
            : 'text-teal-100 hover:text-white hover:bg-teal-800/50'
        }`}
        aria-current={isActiveLink('/trips') ? 'page' : undefined}
      >
        {t('header.travelTool')}
      </Link>
                {user && (
                  <>
                    <div className="w-px h-6 bg-teal-800 mx-2" aria-hidden="true" />
                     {/* Hidden menus when a user logged in, removed some menus here*/}
                  
                  </>
                )}
              </div>

              {/* Action Toolbar (Optional) */}
              {showToolbar && (
                <div className="hidden sm:flex gap-2 items-center border-l border-teal-800 pl-4 ml-2">
                  <button className="p-2 text-teal-200 hover:text-white hover:bg-teal-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button className="p-2 text-teal-200 hover:text-white hover:bg-teal-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              )}

              {/* User Profile / Auth */}
              <div className="flex items-center gap-3">
                {!user ? (
                  <Link 
                    to="/login" 
                    className="hidden sm:inline-flex items-center px-5 py-2.5 text-sm font-semibold text-teal-900 bg-white rounded-full hover:bg-teal-50 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-900 focus-visible:ring-white"
                  >
                    {t('header.signIn')}
                  </Link>
                ) : (
                  <div className="relative" ref={userDropdownRef}>
                    <button
                      className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-teal-800/50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 group"
                      onClick={toggleUserDropdown}
                      aria-expanded={isUserDropdownOpen}
                      aria-haspopup="true"
                    >
                      <span className="hidden md:inline text-sm font-medium text-teal-100 group-hover:text-white">
                        {user.displayName || user.email?.split('@')[0]}
                      </span>
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="" aria-hidden="true" className="w-9 h-9 rounded-full border-2 border-teal-700" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold border-2 border-teal-600">
                          {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-teal-300 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 animate-fade-in-up origin-top-right">
                        <div className="px-4 py-3 border-b border-gray-100 mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.displayName || t('header.traveler')}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700" onClick={() => setIsUserDropdownOpen(false)}>
                          {t('profileNav.profile')}
                        </Link>
                        <Link to="/subscription" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700" onClick={() => setIsUserDropdownOpen(false)}>
                          {t('profileNav.subscription')}
                        </Link>
                        <Link to="/trips" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700" onClick={() => setIsUserDropdownOpen(false)}>
                          {t('profileNav.trips')}
                        </Link>
                        
                        <div className="border-t border-gray-100 my-1"></div>
                        
                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            handleLogout();
                          }}
                          disabled={isLoggingOut}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          {isLoggingOut ? t('header.loggingOut') : t('header.logout')}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-lg text-teal-100 hover:bg-teal-800 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu"
                  aria-label="Toggle navigation menu"
                >
                  {isMobileMenuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile Menu Drawer */}
        <div 
          id="mobile-menu"
          ref={mobileMenuRef}
          className={`lg:hidden fixed inset-x-0 top-20 bg-teal-900 border-b border-teal-800 shadow-xl transition-all duration-300 ease-in-out transform origin-top ${
            isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
          }`}
        >
          <div className="px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Mobile Location Display (Duplicated for menu visibility) */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-teal-800/30 border border-teal-800 text-teal-100">
               {locationLoading ? (
                  <>
                    <MapPinOutline className="w-4 h-4 animate-pulse" />
                    <span className="text-sm">Locating...</span>
                  </>
                ) : userLocation ? (
                  <>
                    <MapPinIcon className="w-4 h-4 text-teal-300" />
                    <span className="text-sm font-medium">
                       {userLocation.city}{userLocation.country ? `, ${userLocation.country}` : ''}
                    </span>
                  </>
                ) : (
                  <>
                    <MapPinOutline className="w-4 h-4 opacity-50" />
                    <span className="text-sm opacity-75">World</span>
                  </>
                )}
            </div>

            {/* Public Links */}
            <div className="grid grid-cols-2 gap-3">
              <Link 
                to="/" 
                className="flex items-center gap-2 p-3 rounded-lg bg-teal-800/50 text-teal-50 hover:bg-teal-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('header.home')}
              </Link>
              <Link 
                to="/blog" 
                className="flex items-center gap-2 p-3 rounded-lg bg-teal-800/50 text-teal-50 hover:bg-teal-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('header.blog')}
              </Link>
              <Link
  to="/travel-tools"
 onClick={() => setIsMobileMenuOpen(false)}
     className="flex items-center gap-2 p-3 rounded-lg bg-teal-800/50 text-teal-50 hover:bg-teal-800"
>
  {t('header.travelTool')}
</Link>
            </div>

            {/* Authenticated Links */}
            {user && (
              <div className="space-y-1 border-t border-teal-800 pt-4">
                <p className="px-3 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">{t('header.myAccount')}</p>
                <Link to="/profile" className="block px-3 py-2 text-teal-100 hover:bg-teal-800 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
                  {t('profileNav.profile')}
                </Link>
              
                <Link to="/trips" className="block px-3 py-2 text-teal-100 hover:bg-teal-800 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
                  {t('profileNav.trips')}
                </Link>
                <Link to="/blog/create" className="block px-3 py-2 text-teal-100 hover:bg-teal-800 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
                  {t('header.createBlogPost')}
                </Link>
              </div>
            )}

            {/* Mobile Footer Actions */}
            <div className="border-t border-teal-800 pt-4 pb-2 space-y-3">
              {/* Language Mobile */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`shrink-0 px-3 py-1 rounded-full text-xs border ${
                      i18n.language === lang.code 
                        ? 'bg-teal-100 text-teal-900 border-teal-100' 
                        : 'text-teal-300 border-teal-700 hover:border-teal-500'
                    }`}
                    onClick={() => changeLanguage(lang.code)}
                  >
                    {lang.flag} {lang.label}
                  </button>
                ))}
              </div>

              {!user ? (
                <Link 
                  to="/login" 
                  className="block w-full text-center py-3 bg-white text-teal-900 font-bold rounded-lg shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('header.signIn')}
                </Link>
              ) : (
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                  className="block w-full text-center py-3 border border-red-800 text-red-300 font-medium rounded-lg hover:bg-red-900/20"
                >
                  {isLoggingOut ? t('header.loggingOut') : t('header.logout')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Toast */}
        {logoutError && (
          <div className="absolute top-full right-4 mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up" role="alert">
            <div className="flex items-center gap-2">
              <span>{logoutError}</span>
              <button onClick={() => setLogoutError(null)} className="ml-2 hover:text-red-900">✕</button>
            </div>
          </div>
        )}
      </header>
    </ComponentErrorBoundary>
  )
};

export default Header;