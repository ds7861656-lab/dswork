import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Info, 
  Sparkles, 
  Plane, 
  ShieldAlert,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// --- Types ---
interface Notification {
  id: string;
  title: string;
  message: string;
  date: string; // ISO String
  read: boolean;
  type: 'service' | 'feature' | 'trip' | 'security';
  link?: string;
}

const Notifications: React.FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Updates to Service Terms',
      message: 'We have updated our privacy policy to better protect your data. Please review the changes at your earliest convenience.',
      date: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
      read: false,
      type: 'service',
    },
    {
      id: '2',
      title: 'New Feature: AI Itinerary',
      message: 'Try our new AI-powered itinerary builder. It creates personalized travel plans in seconds!',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      read: false,
      type: 'feature',
    },
    {
      id: '3',
      title: 'Trip Reminder: Paris',
      message: 'Your flight to Paris is in 3 days. Have you packed your bags and checked your tickets?',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      read: true,
      type: 'trip',
    },
    {
      id: '4',
      title: 'Security Alert',
      message: 'New login detected from a new device (iPhone 13, London). Was this you?',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(), // 8 days ago
      read: false,
      type: 'security',
    },
    {
      id: '5',
      title: 'Subscription Renewed',
      message: 'Your monthly subscription has been successfully renewed. Thank you for being with us.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(), // 12 days ago
      read: true,
      type: 'service',
    },
  ]);

  const filteredNotifications = useMemo(() => {
    switch (filter) {
      case 'unread': return notifications.filter(n => !n.read);
      case 'read': return notifications.filter(n => n.read);
      default: return notifications;
    }
  }, [notifications, filter]);

  const markAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- Icon Configuration ---
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'service': return <Info className="w-5 h-5" />;
      case 'feature': return <Sparkles className="w-5 h-5" />;
      case 'trip': return <Plane className="w-5 h-5" />;
      case 'security': return <ShieldAlert className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'service': return 'bg-blue-50 text-blue-600 ring-blue-600/10';
      case 'feature': return 'bg-purple-50 text-purple-600 ring-purple-600/10';
      case 'trip': return 'bg-teal-50 text-teal-600 ring-teal-600/10';
      case 'security': return 'bg-rose-50 text-rose-600 ring-rose-600/10';
      default: return 'bg-gray-50 text-gray-600 ring-gray-600/10';
    }
  };

  const tabs = [
    { key: 'all' as const, label: t('notifications.all', 'All') },
    { key: 'unread' as const, label: t('notifications.unread', 'Unread') },
    { key: 'read' as const, label: t('notifications.read', 'Read') }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header showNavLinks={false} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <Link 
              to="/profile" 
              className="group inline-flex items-center text-sm font-medium text-gray-500 hover:text-teal-600 transition-colors"
            >
              <motion.span 
                initial={{ x: -2 }} 
                whileHover={{ x: -4 }} 
                className="flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                {t('blog.back', 'Back to Profile')}
              </motion.span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {t('profileNav.notifications', 'Notifications')}
            </h1>
            <p className="text-sm text-gray-500">
              {t('notifications.subtitle', 'Stay updated on your travels and account activity.')}
            </p>
          </div>
          
          {notifications.some(n => !n.read) && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={markAllAsRead}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <CheckCheck className="w-4 h-4 mr-2 text-teal-600" />
              {t('notifications.markAllAsRead', 'Mark all read')}
            </motion.button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="inline-flex p-1 bg-white rounded-xl border border-gray-200 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`
                  relative px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200
                  ${filter === tab.key 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
                `}
              >
                {tab.label}
                {/* Badge for unread count in tabs */}
                {tab.key === 'unread' && notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.8)" }}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                  className={`
                    group relative flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer
                    ${notification.read 
                      ? 'bg-white border-gray-100 opacity-75 hover:opacity-100' 
                      : 'bg-white border-gray-200 shadow-sm shadow-gray-100 ring-1 ring-black/5'}
                  `}
                >
                  {/* Status Indicator Strip */}
                  {!notification.read && (
                    <motion.div 
                      layoutId={`indicator-${notification.id}`}
                      className="absolute left-0 top-6 bottom-6 w-1 bg-linear-to-b from-teal-400 to-teal-600 rounded-r-full"
                    />
                  )}

                  {/* Icon Container */}
                  <div className={`
                    shrink-0 p-2.5 rounded-full ring-1 transition-transform duration-300 group-hover:scale-110
                    ${getIconColor(notification.type)}
                  `}>
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className={`text-base leading-snug ${notification.read ? 'font-medium text-gray-600' : 'font-semibold text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        <p className={`text-sm leading-relaxed ${notification.read ? 'text-gray-400' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                           <span className={`text-xs font-medium tracking-wide uppercase ${notification.read ? 'text-gray-300' : 'text-teal-600'}`}>
                            {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                           </span>
                           {!notification.read && (
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-teal-50 text-teal-700 border border-teal-100">
                               New
                             </span>
                           )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {!notification.read && (
                          <button
                            onClick={(e) => markAsRead(notification.id, e)}
                            className="p-2 text-teal-600 rounded-full hover:bg-teal-50 active:bg-teal-100 transition-colors"
                            title={t('notifications.markAsRead', 'Mark as read')}
                          >
                            <CheckCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => deleteNotification(notification.id, e)}
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              /* Empty State */
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-3xl border border-dashed border-gray-200"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-teal-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-gray-50 rounded-full p-6 ring-1 ring-gray-100">
                    <Bell className="h-10 w-10 text-gray-300" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {filter === 'unread' ? t('notifications.noUnread', 'All caught up!') : t('notifications.noNotifications', 'No notifications')}
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  {t('notifications.noNotificationsDesc', "You don't have any notifications right now. We'll let you know when something important happens.")}
                </p>
                {filter !== 'all' && (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter('all')}
                    className="mt-6 px-5 py-2.5 text-sm font-medium text-teal-700 bg-teal-50 rounded-full hover:bg-teal-100 transition-colors"
                  >
                    View all notifications
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Notifications;