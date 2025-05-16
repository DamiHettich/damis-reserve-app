import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';

// Mock dependencies
jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    logout: jest.fn(),
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => ({
      'nav.calendar': 'Calendar',
      'nav.dashboard': 'Dashboard',
      'nav.profile': 'Profile',
      'nav.admin.calendar': 'Admin Calendar',
      'nav.admin.bookings': 'Bookings',
      'nav.admin.availability': 'Availability',
      'nav.admin.configuration': 'Configuration',
      'auth.logout': 'Logout',
      'auth.login': 'Login',
      'auth.signup': 'Sign Up',
    }[key] || key),
  }),
}));

jest.mock('../../common/LanguageSwitcher/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">Language Switcher</div>,
}));

describe('Navbar', () => {
  const renderNavbar = (authState = {}) => {
    const defaultAuth = {
      isAuthenticated: false,
      user: null,
      logout: jest.fn(),
      ...authState,
    };

    jest.spyOn(require('../../../context/AuthContext'), 'useAuth')
      .mockImplementation(() => defaultAuth);

    return render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  };

  it('renders logo link', () => {
    renderNavbar();
    const logo = screen.getByText('ReservApp');
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('renders login and signup buttons when not authenticated', () => {
    renderNavbar();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('renders client navigation when authenticated as client', () => {
    renderNavbar({
      isAuthenticated: true,
      user: { role: 'client', name: 'John Doe' },
    });

    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders admin navigation when authenticated as admin', () => {
    renderNavbar({
      isAuthenticated: true,
      user: { role: 'admin', name: 'Admin User' },
    });

    expect(screen.getByText('Admin Calendar')).toBeInTheDocument();
    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText('Availability')).toBeInTheDocument();
    expect(screen.getByText('Configuration')).toBeInTheDocument();
  });

  it('displays user name and logout button when authenticated', () => {
    const mockLogout = jest.fn();
    renderNavbar({
      isAuthenticated: true,
      user: { name: 'John Doe', role: 'client' },
      logout: mockLogout,
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();
    
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });

  it('renders language switcher in all states', () => {
    // Test unauthenticated state
    const { unmount } = renderNavbar();
    expect(screen.getAllByTestId('language-switcher')).toHaveLength(1);
    unmount();

    // Test authenticated state
    renderNavbar({ isAuthenticated: true, user: { role: 'client', name: 'John' } });
    expect(screen.getAllByTestId('language-switcher')).toHaveLength(1);
  });

  it('applies correct styling to navigation links', () => {
    renderNavbar({
      isAuthenticated: true,
      user: { role: 'client', name: 'John Doe' },
    });

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      if (link.textContent !== 'ReservApp') {
        expect(link).toHaveClass('text-gray-600', 'hover:text-gray-900');
      }
    });
  });

  it('maintains correct layout structure', () => {
    renderNavbar();
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('bg-white', 'shadow', 'fixed', 'top-0', 'left-0', 'right-0', 'z-50');
  });
});
