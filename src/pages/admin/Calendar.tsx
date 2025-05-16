import { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, getDay, startOfWeek } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import esES from 'date-fns/locale/es';
import { useTranslation } from 'react-i18next';
import "react-big-calendar/lib/css/react-big-calendar.css";
import PendingBookings from '../../components/bookings/PendingBookings';

const locales = {
  'en-US': enUS,
  'es': esES,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Booking {
  id: string;
  title: string;
  start: Date;
  end: Date;
  customerName: string;
  customerEmail: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: number;
}

export default function AdminCalendar() {
  const { t, i18n } = useTranslation('admin');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Mock data - replace with API call
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      title: 'John Doe',
      start: new Date(2025, 5, 5, 10, 0),
      end: new Date(2025, 5, 5, 11, 0),
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      status: 'confirmed',
      price: 50
    },
    {
      id: '2',
      title: 'Jane Smith',
      start: new Date(2025, 5, 9, 10, 0),
      end: new Date(2025, 5, 9, 10, 0),
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      status: 'pending',
      price: 50
    }
  ]);

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  const handleConfirmBooking = async (booking: Booking) => {
    // TODO: Implement confirmation logic
    console.log('Confirming booking:', booking.id);
  };

  const handleCancelBooking = async (booking: Booking) => {
    // TODO: Implement cancellation logic
    console.log('Cancelling booking:', booking.id);
  };

  const handleSendReminder = async (booking: Booking) => {
    // TODO: Implement reminder logic
    console.log('Sending reminder for booking:', booking.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-6">{t('calendar.title')}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <BigCalendar
              localizer={localizer}
              events={bookings}
              startAccessor="start"
              endAccessor="end"
              defaultView="week"
              views={['week', 'day']}
              min={new Date(0, 0, 0, 7, 0, 0)} // 7 AM
              max={new Date(0, 0, 0, 23, 0, 0)} // 11 PM
              style={{ height: 600 }}
              onSelectEvent={(event) => setSelectedBooking(event as Booking)}
              culture={i18n.language === 'es' ? 'es' : 'en-US'}
              messages={{
                week: t('calendar.views.week'),
                day: t('calendar.views.day'),
                today: t('calendar.views.today'),
                previous: t('calendar.navigation.previous'),
                next: t('calendar.navigation.next'),
                noEventsInRange: t('calendar.messages.noEvents'),
              }}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pending Bookings */}
          <PendingBookings 
            bookings={bookings}
            onConfirm={handleConfirmBooking}
            onCancel={handleCancelBooking}
          />

          {/* Selected Booking Details */}
          {selectedBooking && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">{t('calendar.selectedBooking')}</h3>
              <div className="space-y-3">
                <p><span className="font-medium">{t('calendar.fields.customer')}:</span> {selectedBooking.customerName}</p>
                <p><span className="font-medium">{t('calendar.fields.email')}:</span> {selectedBooking.customerEmail}</p>
                <p><span className="font-medium">{t('calendar.fields.date')}:</span> {format(selectedBooking.start, 'PPPP', { locale: i18n.language === 'es' ? esES : enUS })}</p>
                <p><span className="font-medium">{t('calendar.fields.time')}:</span> {format(selectedBooking.start, 'p')} - {format(selectedBooking.end, 'p')}</p>
                <p><span className="font-medium">{t('calendar.fields.price')}:</span> ${selectedBooking.price}</p>
                <p>
                  <span className="font-medium">{t('calendar.fields.status')}:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-sm ${getStatusColor(selectedBooking.status)}`}>
                    {t(`booking.status.${selectedBooking.status}`)}
                  </span>
                </p>
                <div className="pt-4 space-x-2">
                  <button 
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => handleCancelBooking(selectedBooking)}
                  >
                    {t('calendar.actions.cancelBooking')}
                  </button>
                  <button 
                    className="bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700"
                    onClick={() => handleSendReminder(selectedBooking)}
                  >
                    {t('calendar.actions.sendReminder')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
