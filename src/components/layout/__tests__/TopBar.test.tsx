import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TopBar from '../TopBar';

// Mock dependencies
jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'John Doe', role: 'client' },
    logout: jest.fn(),
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => ({
      'nav.profile': 'Profile',
      'auth.logout': 'Logout',
    }[key] || key),
  }),
}));

describe('TopBar', () => {
  const defaultProps = {
    onMenuClick: jest.fn(),
  };

  const renderTopBar = (props = {}, authState = {}) => {
    const defaultAuth = {
      user: { name: 'John Doe', role: 'client' },
      logout: jest.fn(),
      ...authState,
    };

    jest.spyOn(require('../../../context/AuthContext'), 'useAuth')
      .mockImplementation(() => defaultAuth);

    return render(
      <MemoryRouter>
        <TopBar {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the logo', () => {
    renderTopBar();
    expect(screen.getByText('ReservApp')).toBeInTheDocument();
  });

  it('calls onMenuClick when menu button is clicked', () => {
    const onMenuClick = jest.fn();
    renderTopBar({ onMenuClick });
    
    const menuButton = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(menuButton);
    
    expect(onMenuClick).toHaveBeenCalled();
  });

  it('displays user initial in avatar button', () => {
    renderTopBar();
    const avatarButton = screen.getByRole('button', { name: 'J' });
    expect(avatarButton).toBeInTheDocument();
  });

  it('toggles user menu when avatar is clicked', () => {
    renderTopBar();
    
    const avatarButton = screen.getByRole('button', { name: 'J' });
    fireEvent.click(avatarButton);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('shows profile link for client users', () => {
    renderTopBar();
    
    const avatarButton = screen.getByRole('button', { name: 'J' });
    fireEvent.click(avatarButton);
    
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('hides profile link for admin users', () => {
    renderTopBar({}, { user: { name: 'Admin', role: 'admin' } });
    
    const avatarButton = screen.getByRole('button', { name: 'A' });
    fireEvent.click(avatarButton);
    
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', () => {
    const mockLogout = jest.fn();
    renderTopBar({}, { logout: mockLogout });
    
    const avatarButton = screen.getByRole('button', { name: 'J' });
    fireEvent.click(avatarButton);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
  });

  it('closes menu when clicking outside', () => {
    renderTopBar();
    
    // Open menu
    const avatarButton = screen.getByRole('button', { name: 'J' });
    fireEvent.click(avatarButton);
    expect(screen.getByText('Logout')).toBeInTheDocument();
    
    // Click outside
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('maintains correct layout structure', () => {
    renderTopBar();
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-white', 'shadow', 'fixed', 'w-full', 'z-50');
  });
});
