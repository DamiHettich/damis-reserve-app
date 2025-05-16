import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';

// Mock child components
jest.mock('../TopBar', () => ({
  __esModule: true,
  default: ({ onMenuClick }: { onMenuClick: () => void }) => (
    <header data-testid="topbar">
      <button onClick={onMenuClick}>Menu</button>
    </header>
  ),
}));

jest.mock('../Sidebar', () => ({
  __esModule: true,
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) => (
    <div data-testid="sidebar" className={open ? 'visible' : 'hidden'}>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default',
  }),
  Outlet: () => <div data-testid="outlet-content">Page Content</div>,
}));

// Mock window.scrollTo
const scrollToMock = jest.fn();
window.scrollTo = scrollToMock;

describe('DashboardLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderDashboard = () => {
    return render(
      <MemoryRouter>
        <DashboardLayout />
      </MemoryRouter>
    );
  };

  it('renders all layout components', () => {
    renderDashboard();
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('toggles sidebar visibility when menu is clicked', () => {
    renderDashboard();
    const menuButton = screen.getByText('Menu');
    const sidebar = screen.getByTestId('sidebar');
    
    expect(sidebar).toHaveClass('hidden');
    fireEvent.click(menuButton);
    expect(sidebar).toHaveClass('visible');
  });

  it('scrolls to top when route changes', () => {
    let pathname = '/';
    
    // Mock useLocation with mutable pathname
    jest.spyOn(require('react-router-dom'), 'useLocation').mockImplementation(() => ({
      pathname,
      search: '',
      hash: '',
      state: null,
      key: 'default',
    }));

    renderDashboard();
    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
    
    // Change pathname to trigger useEffect
    pathname = '/new-route';
    renderDashboard();
    
    expect(scrollToMock).toHaveBeenCalledTimes(2);
    expect(scrollToMock).toHaveBeenLastCalledWith(0, 0);
  });

  it('maintains correct layout structure', () => {
    renderDashboard();
    const main = screen.getByRole('main');
    expect(main).toHaveClass('lg:pl-64', 'pt-16');
  });

  it('renders outlet content', () => {
    renderDashboard();
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
  });

  it('closes sidebar when close button is clicked', () => {
    renderDashboard();
    const menuButton = screen.getByText('Menu');
    fireEvent.click(menuButton);
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    expect(screen.getByTestId('sidebar')).toHaveClass('hidden');
  });
});
