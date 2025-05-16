import { useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import esES from 'date-fns/locale/es';
import { useTranslation } from 'react-i18next';
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  'en-US': enUS,
  'es': esES
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

interface AvailableSlot {
  id: string;
  start: Date;
  end: Date;
  dayOfWeek: number;
}

export default function AdminAvailability() {
  const { t, i18n } = useTranslation('admin');
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const events = slots.map(slot => ({
    title: t('availability.slotTitle', 'Available'),
    start: slot.start,
    end: slot.end,
    id: slot.id
  }));

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    const startTime = new Date(slotInfo.start);
    const endTime = new Date(slotInfo.end);
    const dayOfWeek = startTime.getDay();

    const existingSlotIndex = slots.findIndex(
      slot => 
        slot.dayOfWeek === dayOfWeek &&
        format(slot.start, 'HH:mm') === format(startTime, 'HH:mm') &&
        format(slot.end, 'HH:mm') === format(endTime, 'HH:mm')
    );

    if (existingSlotIndex >= 0) {
      setSlots(prev => prev.filter((_, index) => index !== existingSlotIndex));
    } else {
      const newSlot: AvailableSlot = {
        id: `${dayOfWeek}-${format(startTime, 'HHmm')}`,
        start: startTime,
        end: endTime,
        dayOfWeek
      };
      setSlots(prev => [...prev, newSlot]);
    }
    setUnsavedChanges(true);
  }, [slots]);

  const handleSave = async () => {
    const weeklySchedule = slots.map(slot => ({
      dayOfWeek: slot.dayOfWeek,
      startTime: format(slot.start, 'HH:mm'),
      endTime: format(slot.end, 'HH:mm')
    }));

    console.log('Saving weekly schedule:', weeklySchedule);
    setUnsavedChanges(false);
  };

  const handleReset = () => {
    setSlots([]);
    setUnsavedChanges(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('availability.title')}</h2>
        <div className="space-x-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            {t('availability.actions.reset')}
          </button>
          <button
            onClick={handleSave}
            disabled={!unsavedChanges}
            className={`px-4 py-2 rounded-md ${
              unsavedChanges
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {t('availability.actions.save')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">{t('availability.instructions.title')}</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {(t('availability.instructions.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <Calendar
          localizer={localizer}
          events={events}
          defaultView="week"
          views={['week']}
          selectable
          step={60}
          timeslots={1}
          min={new Date(0, 0, 0, 7, 0, 0)}
          max={new Date(0, 0, 0, 23, 0, 0)}
          style={{ height: 600 }}
          onSelectSlot={handleSelectSlot}
          eventPropGetter={() => ({
            style: {
              backgroundColor: '#3b82f6',
              borderRadius: '4px'
            }
          })}
          dayLayoutAlgorithm="no-overlap"
          toolbar={false}
          culture={i18n.language}
        />
      </div>

      {unsavedChanges && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md shadow">
          {t('availability.unsavedChanges')}
        </div>
      )}
    </div>
  );
}
