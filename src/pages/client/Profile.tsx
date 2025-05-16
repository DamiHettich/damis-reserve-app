import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  notifications: {
    email: boolean;
    sms: boolean;
  };
  timezone: string;
}

export default function Profile() {
  const { t } = useTranslation('client');
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    notifications: {
      email: true,
      sms: true
    },
    timezone: 'America/New_York'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: API call to update profile
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{t('profile.title')}</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-primary-600 hover:text-primary-700"
        >
          {isEditing ? t('profile.actions.cancel') : t('profile.actions.edit')}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('profile.fields.name.label')}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              ) : (
                <p className="mt-1 text-gray-900">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('profile.fields.email.label')}
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              ) : (
                <p className="mt-1 text-gray-900">{profile.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('profile.fields.phone.label')}
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              ) : (
                <p className="mt-1 text-gray-900">{profile.phone}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">
                {t('profile.fields.notifications.title')}
              </h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.notifications.email}
                    onChange={(e) => setProfile({
                      ...profile,
                      notifications: {
                        ...profile.notifications,
                        email: e.target.checked
                      }
                    })}
                    disabled={!isEditing}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">
                    {t('profile.fields.notifications.email')}
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.notifications.sms}
                    onChange={(e) => setProfile({
                      ...profile,
                      notifications: {
                        ...profile.notifications,
                        sms: e.target.checked
                      }
                    })}
                    disabled={!isEditing}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">
                    {t('profile.fields.notifications.sms')}
                  </label>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                  {t('profile.actions.save')}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}