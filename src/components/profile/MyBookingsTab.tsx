// src/components/profile/MyBookingsTab.tsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCartIcon} from '@heroicons/react/24/outline';

interface Booking {
  id: string;
  type: 'info' | 'warning' | 'success' | 'message';
  title: string;
  date: string;
  read: boolean;
  bookingDate: string;
  place: string;
  totalPrice: string;
}

const MyBookingsTab: React.FC = () => {
  const { t } = useTranslation();
  
  // Mock data - replace with actual API call
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      type: 'info',
      title: t('') || 'Mauritius Watch Whale',
      date: '2026-09-18',
      read: false,
      bookingDate: '2026-09-18',
      place: '5',
      totalPrice: '4000'
    },
    {
      id: '2',
      type: 'info',
      title: t('') || 'Mauritius Snorkeling',
      date: '2026-09-18',
      read: false,
      bookingDate: '2026-09-18',
      place: '5',
      totalPrice: '2000'
    }
  ]);

  const markAsRead = (id: string) => {
    setBookings(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setBookings(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteAll = () => {
    if (window.confirm(t('notifications.deleteAllConfirm') || 'Are you sure you want to delete all notifications?')) {
      setBookings([]);
    }
  };

  const unreadCount = bookings.filter(booking => !booking.read).length;

  
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCartIcon className="w-7 h-7 text-teal-600" />
            {t('trips.myBookings') || 'My Bookings'}
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </h2>
          <p className="text-gray-600 mt-1">
            {t('mybookings.bookingsSubtitle') || 'Stay updated with your latest bookings'}
          </p>
        </div>
        
        {bookings.length > 0 && (
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

      {/* Bookings List */}
      {bookings.length === 0 ? (  
        <div className="text-center py-16">
          <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('mybookings.noBookings') || 'No bookings'}
          </h3>
          <p className="text-gray-600">
            {t('mybookings.noBookingsDesc') || "You're all caught up! Check back later for updates."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => !booking.read && markAsRead(booking.id)}
              className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer group ${
                booking.read
                  ? 'bg-white border-gray-200 hover:border-gray-300'
                  : 'bg-teal-50/50 border-teal-200 hover:border-teal-300 shadow-sm'
              }`}
            >
              {/* Unread Indicator */}
              {!booking.read && (
                <div className="absolute top-4 left-4 w-3 h-3 bg-teal-600 rounded-full" />
              )}

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 ml-6">
                {/* Left: Title & Booking Date */}
                <div className="flex-[2] min-w-[200px]">
                  <h3 className={`text-xl md:text-2xl font-bold mb-3 leading-tight ${booking.read ? 'text-gray-700' : 'text-[#2d4b5a]'}`}>
                    {booking.title}
                  </h3>
                  <p className={`text-sm ${booking.read ? 'text-gray-500' : 'text-[#6b7280]'}`}>
                    {t("mybookings.bookingDate") || 'Booking Date'}: {booking.bookingDate}
                  </p>
                </div>

                {/* Middle: Details */}
                <div className={`flex-1 min-w-[150px] text-sm space-y-2 ${booking.read ? 'text-gray-500' : 'text-[#6b7280]'}`}>
                  <p>{t('mybookings.date') || 'Date'}: {booking.date}</p>
                  <p>{t('mybookings.place') || 'Place'}: {booking.place}</p>
                </div>

                {/* Right: Price & Buttons */}
                <div className="flex-[2] flex flex-col sm:flex-row items-end sm:items-center justify-end gap-6 min-w-[300px]">
                  <div className={`font-medium whitespace-nowrap flex flex-col items-start leading-snug ${booking.read ? 'text-gray-700' : 'text-gray-900'}`}>
                    <span>{t('mybookings.totalPrice') || 'Total Price'} :</span> 
                    <span className="font-bold">{t('mybookings.rmb') || 'Rmb'} : {booking.totalPrice}</span>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      className="px-6 py-2 rounded-lg font-medium transition-colors bg-[#f3f4f6] text-gray-600 hover:bg-gray-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t('mybookings.refund') || 'Refund'}
                    </button>
                    <button 
                      className="px-6 py-2 rounded-lg font-medium transition-colors bg-[#2d4b5a] text-white hover:bg-[#1f3642]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t('mybookings.rebook') || 'Rebook'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsTab;
