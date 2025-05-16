import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import es from 'date-fns/locale/es';
import enUS from 'date-fns/locale/en-US';
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { TimeSlot } from '../../types/calendar';

const locales = {
  'en-US': enUS,
  'es': es,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Calendar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('client');
  const locale = i18n.language === 'es' ? es : enUS;
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace with API call
  const mockAvailableSlots: TimeSlot[] = [
    {
      id: '1',
      start: '2025-05-07T10:00:00',
      end: '2025-05-07T11:00:00',
      available: true,
      price: 50,
    },
    {
      id: '2',
      start: '2025-05-08T14:00:00',
      end: '2025-05-08T15:00:00',
      available: true,
      price: 50,
    }
  ];

  const events = mockAvailableSlots.map(slot => ({
    id: slot.id,
    title: `${t('calendar.slot.available')} - $${slot.price}`,
    start: new Date(slot.start),
    end: new Date(slot.end),
    resource: slot,
    className: selectedSlots.some(s => s.id === slot.id) ? 'selected-event' : ''
  }));

  const handleSelectEvent = (event: any) => {
    const slot = event.resource as TimeSlot;
    
    if (selectedSlots.some(s => s.id === slot.id)) {
      setSelectedSlots(selectedSlots.filter(s => s.id !== slot.id));
    } else {
      // Optional: Add validation for consecutive slots or maximum slots
      setSelectedSlots([...selectedSlots, slot]);
    }
    setError(null);
  };

  const handleProceedToCheckout = () => {
    if (selectedSlots.length === 0) {
      setError(t('calendar.errors.noSelection'));
      return;
    }

    navigate('/booking/confirm', { 
      state: { 
        selectedSlots,
        returnPath: '/calendar'
      } 
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('calendar.title')}</h2>
        <p className="mt-2 text-gray-600">{t('calendar.subtitle')}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          views={['week']}
          min={new Date(0, 0, 0, 7, 0, 0)} // 7 AM
          max={new Date(0, 0, 0, 23, 0, 0)} // 11 PM
          style={{ height: 600 }}
          onSelectEvent={handleSelectEvent}
          culture={i18n.language === 'es' ? 'es' : 'en-US'}
          messages={{
            week: t('calendar.views.week'),
            today: t('calendar.views.today'),
            previous: t('calendar.navigation.previous'),
            next: t('calendar.navigation.next'),
            noEventsInRange: t('calendar.messages.noEvents')
          }}
          eventPropGetter={(event) => ({
            className: event.className,
            style: {
              backgroundColor: event.className === 'selected-event' ? '#4F46E5' : '#6366F1',
              border: 'none'
            }
          })}
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {selectedSlots.length > 0 && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-2">{t('calendar.selectedSessions.title')}</h3>
            <div className="space-y-2">
              {selectedSlots.map(slot => (
                <div key={slot.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{t('calendar.selectedSessions.session')}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(slot.start), 'PPPP', { locale })} {t('calendar.at')} {format(new Date(slot.start), 'p', { locale })}
                    </p>
                  </div>
                  <p className="font-medium">${slot.price}</p>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{t('calendar.selectedSessions.total')}</p>
                  <p className="font-semibold">
                    ${selectedSlots.reduce((sum, slot) => sum + slot.price, 0)}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleProceedToCheckout}
              className="mt-4 w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              {t('calendar.actions.checkout')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
