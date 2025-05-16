import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainLayout from '../MainLayout';

// Mock Navbar component
jest.mock('../Navbar', () => ({
  __esModule: true,
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

// Mock react-router-dom Outlet
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-testid="outlet-content">Page Content</div>,
}));

describe('MainLayout', () => {
  const renderMainLayout = () => {
    return render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>
    );
  };

  it('renders navbar', () => {
    renderMainLayout();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders outlet content', () => {
    renderMainLayout();
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
  });

  it('maintains correct layout structure', () => {
    renderMainLayout();
    const main = screen.getByRole('main');
    expect(main).toHaveClass('mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-8', 'mt-16');
  });

  it('has correct background color', () => {
    renderMainLayout();
    const container = screen.getByTestId('outlet-content').parentElement?.parentElement;
    expect(container).toHaveClass('min-h-screen', 'bg-gray-50');
  });
});
