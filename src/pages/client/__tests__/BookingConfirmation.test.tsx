import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import BookingConfirmation from '../BookingConfirmation';
import { format } from 'date-fns';

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('BookingConfirmation', () => {
  const mockNavigate = jest.fn();
  const mockSelectedSlots = [
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
  ];

  beforeEach(() => {
    jest.useFakeTimers();
    (useLocation as jest.Mock).mockReturnValue({
      state: {
        selectedSlots: mockSelectedSlots,
        returnPath: '/calendar',
      },
    });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const renderBookingConfirmation = () => {
    return render(
      <MemoryRouter>
        <BookingConfirmation />
      </MemoryRouter>
    );
  };

  it('renders booking details correctly', () => {
    renderBookingConfirmation();
    expect(screen.getByText('Confirm Your Booking')).toBeInTheDocument();

    // Check if slots are rendered using more specific queries
    mockSelectedSlots.forEach(slot => {
      const date = format(new Date(slot.start), 'PPPP');
      const startTime = format(new Date(slot.start), 'p');
      const endTime = format(new Date(slot.end), 'p');
      
      expect(screen.getByText(date)).toBeInTheDocument();
      expect(screen.getByText(`${startTime} - ${endTime}`)).toBeInTheDocument();
    });

    // Check total amount
    const totalAmount = mockSelectedSlots.reduce((sum, slot) => sum + slot.price, 0);
    expect(screen.getByText(`$${totalAmount}`)).toBeInTheDocument();
  });

  it('renders payment methods', () => {
    renderBookingConfirmation();
    expect(screen.getByText('WebPay')).toBeInTheDocument();
    expect(screen.getByText('MercadoPago')).toBeInTheDocument();
  });

  it('allows payment method selection', () => {
    renderBookingConfirmation();
    const webpayMethod = screen.getByText('WebPay').closest('.relative');
    fireEvent.click(webpayMethod!);
    expect(webpayMethod).toHaveClass('border-primary-600');
  });

  it('disables confirm button when no payment method is selected', () => {
    renderBookingConfirmation();
    const confirmButton = screen.getByText('Confirm and Pay');
    expect(confirmButton).toBeDisabled();
  });

  it('enables confirm button when payment method is selected', () => {
    renderBookingConfirmation();
    const webpayMethod = screen.getByText('WebPay').closest('.relative');
    fireEvent.click(webpayMethod!);
    const confirmButton = screen.getByText('Confirm and Pay');
    expect(confirmButton).not.toBeDisabled();
  });

  it('navigates back when back button is clicked', () => {
    renderBookingConfirmation();
    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/calendar');
  });

  it('shows processing state during confirmation', async () => {
    renderBookingConfirmation();

    const webpayMethod = screen.getByText('WebPay').closest('.relative');
    fireEvent.click(webpayMethod!);

    const confirmButton = screen.getByText('Confirm and Pay');
    fireEvent.click(confirmButton);

    expect(screen.getByText('Processing...')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/booking/success', {
        state: {
          bookingDetails: {
            slots: mockSelectedSlots,
            totalAmount: 100,
          },
        },
      });
    }, {
      timeout: 2000,
      interval: 100
    });
  });

  it('handles error state', async () => {
    // Mock the setTimeout to immediately reject
    jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
      throw new Error('API Error');
      return undefined as any;
    });

    renderBookingConfirmation();

    const webpayMethod = screen.getByText('WebPay').closest('.relative');
    fireEvent.click(webpayMethod!);

    const confirmButton = screen.getByText('Confirm and Pay');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to process booking. Please try again.')).toBeInTheDocument();
    }, {
      timeout: 2000,
      interval: 100
    });
  });
});
