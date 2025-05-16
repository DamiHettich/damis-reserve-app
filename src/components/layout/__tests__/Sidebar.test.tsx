import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';

// Mock dependencies
jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { role: 'client' },
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => ({
      'nav.dashboard': 'Dashboard',
      'nav.calendar': 'Calendar',
      'nav.profile': 'Profile',
      'nav.admin.calendar': 'Admin Calendar',
      'nav.admin.bookings': 'Bookings',
      'nav.admin.availability': 'Availability',
      'nav.admin.configuration': 'Configuration',
    }[key] || key),
  }),
}));

// Mock react-router-dom's useLocation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/dashboard',
  }),
}));

describe('Sidebar', () => {
  const defaultProps = {
    open: false,
    onClose: jest.fn(),
  };

  const renderSidebar = (props = {}, userRole = 'client') => {
    jest.spyOn(require('../../../context/AuthContext'), 'useAuth')
      .mockImplementation(() => ({
        user: { role: userRole },
      }));

    return render(
      <MemoryRouter>
        <Sidebar {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the logo', () => {
    renderSidebar();
    expect(screen.getByText('ReservApp')).toBeInTheDocument();
  });

  it('shows client menu items when user is client', () => {
    renderSidebar();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('shows admin menu items when user is admin', () => {
    renderSidebar({}, 'admin');
    expect(screen.getByText('Admin Calendar')).toBeInTheDocument();
    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText('Availability')).toBeInTheDocument();
    expect(screen.getByText('Configuration')).toBeInTheDocument();
  });

  it('applies active styles to current route', () => {
    renderSidebar();
    const activeLink = screen.getByText('Dashboard').closest('a');
    expect(activeLink).toHaveClass('bg-gray-100', 'text-gray-900');
  });

  it('applies inactive styles to other routes', () => {
    renderSidebar();
    const inactiveLink = screen.getByText('Calendar').closest('a');
    expect(inactiveLink).toHaveClass('text-gray-600', 'hover:bg-gray-50', 'hover:text-gray-900');
  });

  it('shows backdrop when open on mobile', () => {
    renderSidebar({ open: true });
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop).toHaveClass('bg-gray-600', 'bg-opacity-75', 'lg:hidden');
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = jest.fn();
    renderSidebar({ open: true, onClose });
    
    const backdrop = screen.getByTestId('backdrop');
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('applies correct transform classes based on open prop', () => {
    // Test closed state
    const { rerender } = renderSidebar({ open: false });
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveClass('-translate-x-full');

    // Test open state
    rerender(
      <MemoryRouter>
        <Sidebar {...defaultProps} open={true} />
      </MemoryRouter>
    );
    expect(sidebar).toHaveClass('translate-x-0');
  });

  it('renders icons for all menu items', () => {
    renderSidebar();
    const menuItems = screen.getAllByRole('link');
    menuItems.forEach(item => {
      expect(item.querySelector('svg')).toBeInTheDocument();
    });
  });
});
