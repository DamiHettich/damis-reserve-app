import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ColorPicker from '../../components/configuration/ColorPicker';
import { useTheme } from '../../context/ThemeContext';

interface ConfigState {
  slots: {
    duration: number; // in minutes
    startTime: string;
    endTime: string;
  };
  pricing: {
    basePrice: number;
    reservationFee: number;
    cancellationFee: number;
  };
  cancellation: {
    deadline: number; // hours before appointment
    lateCancellationFee: number;
    cutoffTime: number; // hours before appointment
  };
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  notifications: {
    email: boolean;
    whatsapp: boolean;
    reminderHours: number[];
  };
}

export default function Configuration() {
  const { t } = useTranslation('admin');
  const { colors, updateColors } = useTheme();
  const [config, setConfig] = useState<ConfigState>({
    slots: {
      duration: 60,
      startTime: '09:00',
      endTime: '17:00'
    },
    pricing: {
      basePrice: 50,
      reservationFee: 10,
      cancellationFee: 15
    },
    cancellation: {
      deadline: 24,
      lateCancellationFee: 25,
      cutoffTime: 12
    },
    theme: {
      primary: '#1a73e8',
      secondary: '#4285f4',
      accent: '#fbbc04'
    },
    notifications: {
      email: true,
      whatsapp: true,
      reminderHours: [24, 2]
    }
  });

  const handleSave = () => {
    // TODO: API call to save configuration
    console.log('Saving configuration:', config);
  };

  const handleColorChange = (key: keyof typeof colors, value: string) => {
    updateColors({ ...colors, [key]: value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('configuration.title')}</h2>
        <button
          onClick={handleSave}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          {t('configuration.actions.save')}
        </button>
      </div>

      <div className="space-y-8">
        {/* Slot Configuration */}
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">{t('configuration.sections.slots.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('configuration.sections.slots.duration')}
              </label>
              <select
                value={config.slots.duration}
                onChange={(e) => setConfig({
                  ...config,
                  slots: { ...config.slots, duration: Number(e.target.value) }
                })}
                className="w-full border rounded-md p-2"
              >
                <option value={30}>{t('configuration.sections.slots.durations.30')}</option>
                <option value={60}>{t('configuration.sections.slots.durations.60')}</option>
                <option value={90}>{t('configuration.sections.slots.durations.90')}</option>
                <option value={120}>{t('configuration.sections.slots.durations.120')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('configuration.sections.slots.operatingHours')}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={config.slots.startTime}
                  onChange={(e) => setConfig({
                    ...config,
                    slots: { ...config.slots, startTime: e.target.value }
                  })}
                  className="border rounded-md p-2"
                />
                <span>to</span>
                <input
                  type="time"
                  value={config.slots.endTime}
                  onChange={(e) => setConfig({
                    ...config,
                    slots: { ...config.slots, endTime: e.target.value }
                  })}
                  className="border rounded-md p-2"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Configuration */}
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">{t('configuration.sections.pricing.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('configuration.sections.pricing.basePrice')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2">$</span>
                <input
                  type="number"
                  value={config.pricing.basePrice}
                  onChange={(e) => setConfig({
                    ...config,
                    pricing: { ...config.pricing, basePrice: Number(e.target.value) }
                  })}
                  className="w-full pl-8 border rounded-md p-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('configuration.sections.pricing.reservationFee')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2">$</span>
                <input
                  type="number"
                  value={config.pricing.reservationFee}
                  onChange={(e) => setConfig({
                    ...config,
                    pricing: { ...config.pricing, reservationFee: Number(e.target.value) }
                  })}
                  className="w-full pl-8 border rounded-md p-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('configuration.sections.pricing.cancellationFee')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2">$</span>
                <input
                  type="number"
                  value={config.pricing.cancellationFee}
                  onChange={(e) => setConfig({
                    ...config,
                    pricing: { ...config.pricing, cancellationFee: Number(e.target.value) }
                  })}
                  className="w-full pl-8 border rounded-md p-2"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Cancellation Policy */}
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">{t('configuration.sections.cancellation.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('configuration.sections.cancellation.deadline')}
              </label>
              <input
                type="number"
                value={config.cancellation.deadline}
                onChange={(e) => setConfig({
                  ...config,
                  cancellation: { ...config.cancellation, deadline: Number(e.target.value) }
                })}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('configuration.sections.cancellation.lateFee')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2">$</span>
                <input
                  type="number"
                  value={config.cancellation.lateCancellationFee}
                  onChange={(e) => setConfig({
                    ...config,
                    cancellation: { ...config.cancellation, lateCancellationFee: Number(e.target.value) }
                  })}
                  className="w-full pl-8 border rounded-md p-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('configuration.sections.cancellation.cutoff')}
              </label>
              <input
                type="number"
                value={config.cancellation.cutoffTime}
                onChange={(e) => setConfig({
                  ...config,
                  cancellation: { ...config.cancellation, cutoffTime: Number(e.target.value) }
                })}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>
        </section>

        {/* Notification Configuration */}
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">{t('configuration.sections.notifications.title')}</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={config.notifications.email}
                  onChange={(e) => setConfig({
                    ...config,
                    notifications: { ...config.notifications, email: e.target.checked }
                  })}
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
                <span className="ml-2">{t('configuration.sections.notifications.email')}</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={config.notifications.whatsapp}
                  onChange={(e) => setConfig({
                    ...config,
                    notifications: { ...config.notifications, whatsapp: e.target.checked }
                  })}
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
                <span className="ml-2">{t('configuration.sections.notifications.whatsapp')}</span>
              </label>
            </div>
            {/* Notification Configuration - Reminder Times */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('configuration.sections.notifications.reminderTimes')}
              </label>
              <div className="space-y-3">
                {config.notifications.reminderHours.map((hours, index) => (
                  <div 
                    key={index} 
                    className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex-1 flex items-center space-x-3">
                      <div className="relative flex-shrink-0">
                        <input
                          type="number"
                          min="1"
                          max="168"
                          value={hours}
                          onChange={(e) => {
                            const newHours = [...config.notifications.reminderHours];
                            newHours[index] = Number(e.target.value);
                            setConfig({
                              ...config,
                              notifications: { ...config.notifications, reminderHours: newHours }
                            });
                          }}
                          className="w-24 border rounded-md p-2 pr-12 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                          hrs
                        </span>
                      </div>
                      <span className="text-gray-600">
                        {t('configuration.sections.notifications.beforeAppointment')}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const newHours = config.notifications.reminderHours.filter((_, i) => i !== index);
                        setConfig({
                          ...config,
                          notifications: { ...config.notifications, reminderHours: newHours }
                        });
                      }}
                      className="ml-3 p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                      title={t('configuration.sections.notifications.removeReminder')}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newHours = [...config.notifications.reminderHours, 24];
                    setConfig({
                      ...config,
                      notifications: { ...config.notifications, reminderHours: newHours }
                    });
                  }}
                  className="mt-2 flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {t('configuration.sections.notifications.addReminder')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Theme Configuration */}
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">{t('configuration.sections.theme.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ColorPicker
              color={colors.primary}
              onChange={(color) => handleColorChange('primary', color)}
              label={t('configuration.sections.theme.colors.primary')}
            />
            <ColorPicker
              color={colors.secondary}
              onChange={(color) => handleColorChange('secondary', color)}
              label={t('configuration.sections.theme.colors.secondary')}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
