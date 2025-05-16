import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { enUS, es } from 'date-fns/locale';
import { useState } from 'react';

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

interface PendingBookingsProps {
  bookings: Booking[];
  onConfirm: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
}

export default function PendingBookings({ bookings, onConfirm, onCancel }: PendingBookingsProps) {
  const { t, i18n } = useTranslation('admin');
  const locale = i18n.language === 'es' ? es : enUS;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pendingBookings = bookings
    .filter(booking => booking.status === 'pending')
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">{t('calendar.pendingBookings')}</h3>
      
      {pendingBookings.length === 0 ? (
        <p className="text-gray-500 text-sm">{t('calendar.noPendingBookings')}</p>
      ) : (
        <div className="space-y-3">
          {pendingBookings.map((booking) => (
            <div
              key={booking.id}
              className="border rounded-lg transition-colors"
            >
              <div 
                onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                className="p-3 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{booking.customerName}</p>
                    <p className="text-sm text-gray-500">{booking.customerEmail}</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    {t('booking.status.pending')}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>{format(booking.start, 'PPP', { locale })}</p>
                  <p>{format(booking.start, 'p', { locale })} - {format(booking.end, 'p', { locale })}</p>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === booking.id && (
                <div className="px-3 pb-3 border-t">
                  <div className="pt-3 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">{t('calendar.fields.price')}:</span> ${booking.price}
                    </p>
                    
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onConfirm(booking);
                        }}
                        className="px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm"
                      >
                        {t('calendar.actions.confirm')}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancel(booking);
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                      >
                        {t('calendar.actions.cancel')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 