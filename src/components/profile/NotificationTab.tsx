// src/components/profile/NotificationTab.tsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BellIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'message';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const NotificationTab: React.FC = () => {
  const { t } = useTranslation();
  
  // Mock data - replace with actual API call
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: t('trips.changesInService') || 'Changes in Service',
      message: t('trips.changesMsg') || 'We are excited to announce we have a new policy here in afrest service we customed. We accommodate travellers the changes.',
      date: '2025-02-10',
      read: false
    },
    {
      id: '2',
      type: 'info',
      title: t('trips.changesInService') || 'Changes in Service',
      message: t('trips.changesMsg') || 'We are excited to announce we have a new policy here in afrest service we customed. We accommodate travellers the changes.',
      date: '2025-02-09',
      read: false
    },
    {
      id: '3',
      type: 'success',
      title: t('trips.changesInService') || 'Changes in Service',
      message: t('trips.changesMsg') || 'We are excited to announce we have a new policy here in afrest service we customed. We accommodate travellers the changes.',
      date: '2025-02-08',
      read: true
    },
    {
      id: '4',
      type: 'message',
      title: t('trips.changesInService') || 'Changes in Service',
      message: t('trips.changesMsg') || 'We are excited to announce we have a new policy here in afrest service we customed. We accommodate travellers the changes.',
      date: '2025-02-07',
      read: true
    }
  ]);

  const getIcon = (type: Notification['type']) => {
    const iconClass = "w-6 h-6";
    switch (type) {
      case 'info':
        return <InformationCircleIcon className={`${iconClass} text-blue-600`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClass} text-yellow-600`} />;
      case 'success':
        return <CheckCircleIcon className={`${iconClass} text-green-600`} />;
      case 'message':
        return <EnvelopeIcon className={`${iconClass} text-purple-600`} />;
      default:
        return <BellIcon className={`${iconClass} text-gray-600`} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return t('notifications.today') || 'Today';
    if (diff === 1) return t('notifications.yesterday') || 'Yesterday';
    if (diff < 7) return `${diff} ${t('notifications.daysAgo') || 'days ago'}`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteAll = () => {
    if (window.confirm(t('notifications.deleteAllConfirm') || 'Are you sure you want to delete all notifications?')) {
      setNotifications([]);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BellIcon className="w-7 h-7 text-teal-600" />
            {t('trips.notifications') || 'Messages'}
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </h2>
          <p className="text-gray-600 mt-1">
            {t('trips.notificationsSubtitle') || 'Stay updated with your latest notifications'}
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
            >
              {t('trips.markAllRead') || 'Mark all as read'}
            </button>
            <button
              onClick={deleteAll}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              {t('trips.deleteAll') || 'Delete all'}
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <BellIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('notifications.noNotifications') || 'No notifications'}
          </h3>
          <p className="text-gray-600">
            {t('notifications.noNotificationsDesc') || "You're all caught up! Check back later for updates."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => !notification.read && markAsRead(notification.id)}
              className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer group ${
                notification.read
                  ? 'bg-white border-gray-200 hover:border-gray-300'
                  : 'bg-teal-50/50 border-teal-200 hover:border-teal-300 shadow-sm'
              }`}
            >
              {/* Unread Indicator */}
              {!notification.read && (
                <div className="absolute top-4 left-4 w-3 h-3 bg-teal-600 rounded-full" />
              )}

              <div className="flex items-start gap-4 ml-6">
                {/* Icon */}
                <div className={`p-3 rounded-full ${
                  notification.read ? 'bg-gray-100' : 'bg-white'
                }`}>
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className={`font-bold mb-2 ${
                    notification.read ? 'text-gray-700' : 'text-gray-900'
                  }`}>
                    {notification.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    notification.read ? 'text-gray-500' : 'text-gray-700'
                  }`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(notification.date)}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title={t('notifications.delete') || 'Delete'}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationTab;
