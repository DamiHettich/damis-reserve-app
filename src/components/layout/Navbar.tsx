import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../common/LanguageSwitcher/LanguageSwitcher';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation('common');

  return (
    <nav className="bg-white shadow fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary-600">
              ReservApp
            </Link>

            {isAuthenticated && user?.role === 'client' && (
              <>
                <Link to="/calendar" className="text-gray-600 hover:text-gray-900">
                  {t('nav.calendar')}
                </Link>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                  {t('nav.dashboard')}
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                  {t('nav.profile')}
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Link to="/admin/calendar" className="text-gray-600 hover:text-gray-900">
                  {t('nav.admin.calendar')}
                </Link>
                <Link to="/admin/bookings" className="text-gray-600 hover:text-gray-900">
                  {t('nav.admin.bookings')}
                </Link>
                <Link to="/admin/availability" className="text-gray-600 hover:text-gray-900">
                  {t('nav.admin.availability')}
                </Link>
                <Link to="/admin/configuration" className="text-gray-600 hover:text-gray-900">
                  {t('nav.admin.configuration')}
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <LanguageSwitcher />
                <span className="text-gray-700">{user?.name}</span>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {t('auth.logout')}
                </button>
              </>
            ) : (
              <>
                <LanguageSwitcher />
                <Link
                  to="/login"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                  {t('auth.login')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}