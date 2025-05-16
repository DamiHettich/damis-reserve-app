import { useState } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import es from 'date-fns/locale/es';
import enUS from 'date-fns/locale/en-US';
import type { TimeSlot } from '../../types/calendar';

type BookingStatus = 'upcoming' | 'past' | 'cancelled';

interface Booking extends TimeSlot {
  status: BookingStatus;
}

export default function Dashboard() {
  const { t, i18n } = useTranslation('client');
  const locale = i18n.language === 'es' ? es : enUS;

  // TODO: Replace with API call
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      start: '2024-01-20T10:00:00',
      end: '2024-01-20T11:00:00',
      price: 50,
      available: false,
      status: 'upcoming'
    },
    {
      id: '2',
      start: '2024-01-15T14:00:00',
      end: '2024-01-15T15:00:00',
      price: 50,
      available: false,
      status: 'past'
    },
    {
      id: '3',
      start: '2024-01-10T09:00:00',
      end: '2024-01-10T10:00:00',
      price: 50,
      available: false,
      status: 'cancelled'
    }
  ]);

  const metrics = {
    total: bookings.length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    totalSpent: bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, booking) => sum + booking.price, 0)
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'upcoming':
        return 'bg-green-100 text-green-800';
      case 'past':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-6">{t('dashboard.title')}</h2>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">{t('dashboard.metrics.totalAppointments')}</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">{t('dashboard.metrics.cancelled')}</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.cancelled}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">{t('dashboard.metrics.totalSpent')}</p>
          <p className="text-2xl font-bold text-gray-900">${metrics.totalSpent}</p>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <div key={booking.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {format(new Date(booking.start), 'PPPP', { locale })}
                  </p>
                  <p className="text-gray-500">
                    {format(new Date(booking.start), 'p', { locale })} - {format(new Date(booking.end), 'p', { locale })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {t(`dashboard.bookings.status.${booking.status}`)}
                </span>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <p className="text-gray-600">
                  {t('dashboard.bookings.price')}: ${booking.price}
                </p>
                {booking.status === 'upcoming' && (
                  <button className="text-red-600 hover:text-red-800">
                    {t('dashboard.bookings.actions.cancel')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
