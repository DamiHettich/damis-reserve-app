import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import BookingFailure from '../BookingFailure';

interface LocationState {
  returnPath: string;
  error?: string;  // Make error optional
}

const defaultProps: LocationState = {
  returnPath: '/calendar',
  error: 'Payment processing failed',
};

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('BookingFailure', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useLocation as jest.Mock).mockReturnValue({
      state: defaultProps,
    });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderBookingFailure = (locationState = defaultProps) => {
    (useLocation as jest.Mock).mockReturnValue({
      state: locationState,
    });
    return render(
      <MemoryRouter>
        <BookingFailure />
      </MemoryRouter>
    );
  };

  it('renders the failure page with title and description', () => {
    renderBookingFailure();
    expect(screen.getByText('Booking Failed')).toBeInTheDocument();
    expect(screen.getByText('We encountered an issue while processing your booking.')).toBeInTheDocument();
  });

  it('displays custom error message when provided', () => {
    renderBookingFailure();
    expect(screen.getByText('Payment processing failed')).toBeInTheDocument();
  });

  it('displays default error message when no error provided', () => {
    renderBookingFailure({ returnPath: '/calendar' });
    expect(screen.getByText("We couldn't process your booking at this time.")).toBeInTheDocument();
  });

  it('navigates to dashboard when dashboard button is clicked', () => {
    renderBookingFailure();
    const dashboardButton = screen.getByText('Go to Dashboard');
    fireEvent.click(dashboardButton);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to return path when try again button is clicked', () => {
    renderBookingFailure();
    const tryAgainButton = screen.getByText('Try Again');
    fireEvent.click(tryAgainButton);
    expect(mockNavigate).toHaveBeenCalledWith('/calendar');
  });

  it('renders all help suggestions', () => {
    renderBookingFailure();
    expect(screen.getByText(/Try booking again/)).toBeInTheDocument();
    expect(screen.getByText(/Wait a few minutes/)).toBeInTheDocument();
    expect(screen.getByText(/Contact support/)).toBeInTheDocument();
  });

  it('renders error icon', () => {
    renderBookingFailure();
    const errorIcon = screen.getByTestId('error-icon');
    expect(errorIcon).toBeInTheDocument();
  });

  it('handles missing location state gracefully', () => {
    (useLocation as jest.Mock).mockReturnValue({
      state: null,
    });

    render(
      <MemoryRouter>
        <BookingFailure />
      </MemoryRouter>
    );

    expect(screen.getByText("We couldn't process your booking at this time.")).toBeInTheDocument();
  });

  it('maintains layout structure', () => {
    renderBookingFailure();
    expect(screen.getByText('Error Details')).toBeInTheDocument();
    expect(screen.getByText('What you can do:')).toBeInTheDocument();
  });
});
