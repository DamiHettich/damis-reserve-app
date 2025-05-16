import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import BookingSuccess from '../BookingSuccess';
import { format } from 'date-fns';

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('BookingSuccess', () => {
  const mockNavigate = jest.fn();
  const mockBookingDetails = {
    slots: [
      {
        id: '1',
        start: '2024-03-20T10:00:00',
        end: '2024-03-20T11:00:00',
        price: 50,
      },
      {
        id: '2',
        start: '2024-03-21T14:00:00',
        end: '2024-03-21T15:00:00',
        price: 50,
      },
    ],
    totalAmount: 100,
  };

  beforeEach(() => {
    (useLocation as jest.Mock).mockReturnValue({
      state: { bookingDetails: mockBookingDetails },
    });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderBookingSuccess = () => {
    return render(
      <MemoryRouter>
        <BookingSuccess />
      </MemoryRouter>
    );
  };

  it('renders success message and confirmation', () => {
    renderBookingSuccess();
    expect(screen.getByText('Booking Confirmed!')).toBeInTheDocument();
    expect(screen.getByText('Thank you for your booking. We look forward to seeing you!')).toBeInTheDocument();
  });

  it('displays booking details correctly', () => {
    renderBookingSuccess();
    mockBookingDetails.slots.forEach(slot => {
      const date = format(new Date(slot.start), 'PPPP');
      const startTime = format(new Date(slot.start), 'p');
      const endTime = format(new Date(slot.end), 'p');
      
      expect(screen.getByText(date)).toBeInTheDocument();
      expect(screen.getByText(`${startTime} - ${endTime}`)).toBeInTheDocument();
      expect(screen.getAllByText(`$${slot.price}`).length).toBeGreaterThan(0);
    });
  });

  it('shows correct total amount in payment information', () => {
    renderBookingSuccess();
    expect(screen.getByText(/A deposit of \$100 has been processed/)).toBeInTheDocument();
  });

  it('displays important information section', () => {
    renderBookingSuccess();
    expect(screen.getByText('Important Information')).toBeInTheDocument();
    expect(screen.getByText(/Please arrive 15 minutes before/)).toBeInTheDocument();
    expect(screen.getByText(/If you need to cancel or reschedule/)).toBeInTheDocument();
    expect(screen.getByText(/The location details and any additional instructions/)).toBeInTheDocument();
  });

  it('navigates to calendar when booking another session', () => {
    renderBookingSuccess();
    const bookAnotherButton = screen.getByText('Book Another Session');
    fireEvent.click(bookAnotherButton);
    expect(mockNavigate).toHaveBeenCalledWith('/calendar');
  });

  it('navigates to dashboard when clicking dashboard button', () => {
    renderBookingSuccess();
    const dashboardButton = screen.getByText('Go to Dashboard');
    fireEvent.click(dashboardButton);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('renders success icon', () => {
    renderBookingSuccess();
    const successIcon = screen.getByTestId('success-icon');
    expect(successIcon).toBeInTheDocument();
  });

  it('handles missing location state gracefully', () => {
    (useLocation as jest.Mock).mockReturnValue({ state: null });
    expect(() => renderBookingSuccess()).toThrow();
  });
});
