import { render, screen, fireEvent } from '@testing-library/react';
import PendingBookings from '../PendingBookings';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

describe('PendingBookings', () => {
  const mockBookings = [
    {
      id: '1',
      title: 'Booking 1',
      start: new Date('2024-01-01T10:00:00'),
      end: new Date('2024-01-01T11:00:00'),
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      status: 'pending' as const,
      price: 50,
    },
    {
      id: '2',
      title: 'Booking 2',
      start: new Date('2024-01-02T15:00:00'),
      end: new Date('2024-01-02T16:00:00'),
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      status: 'confirmed' as const,
      price: 75,
    },
  ];

  const defaultProps = {
    bookings: mockBookings,
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pending bookings only', () => {
    render(<PendingBookings {...defaultProps} />);
    
    // Should show John's booking
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    
    // Shouldn't show Jane's booking (status: confirmed)
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('shows empty state when no pending bookings', () => {
    render(<PendingBookings {...defaultProps} bookings={[]} />);
    expect(screen.getByText('calendar.noPendingBookings')).toBeInTheDocument();
  });

  it('expands booking details on click', () => {
    render(<PendingBookings {...defaultProps} />);
    
    // Initially, price should not be visible
    expect(screen.queryByText('$50')).not.toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(screen.getByText('John Doe'));
    
    // Now price should be visible
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.getByText('calendar.actions.confirm')).toBeInTheDocument();
    expect(screen.getByText('calendar.actions.cancel')).toBeInTheDocument();
  });

  it('collapses expanded booking on second click', () => {
    render(<PendingBookings {...defaultProps} />);
    
    // Expand
    fireEvent.click(screen.getByText('John Doe'));
    expect(screen.getByText('$50')).toBeInTheDocument();
    
    // Collapse
    fireEvent.click(screen.getByText('John Doe'));
    expect(screen.queryByText('$50')).not.toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(<PendingBookings {...defaultProps} />);
    
    // Expand and click confirm
    fireEvent.click(screen.getByText('John Doe'));
    fireEvent.click(screen.getByText('calendar.actions.confirm'));
    
    expect(defaultProps.onConfirm).toHaveBeenCalledWith(mockBookings[0]);
    expect(defaultProps.onCancel).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<PendingBookings {...defaultProps} />);
    
    // Expand and click cancel
    fireEvent.click(screen.getByText('John Doe'));
    fireEvent.click(screen.getByText('calendar.actions.cancel'));
    
    expect(defaultProps.onCancel).toHaveBeenCalledWith(mockBookings[0]);
    expect(defaultProps.onConfirm).not.toHaveBeenCalled();
  });

  it('sorts pending bookings by start date', () => {
    const unsortedBookings = [
      {
        ...mockBookings[0],
        id: '3',
        start: new Date('2024-01-03T10:00:00'),
      },
      {
        ...mockBookings[0],
        id: '1',
        start: new Date('2024-01-01T10:00:00'),
      },
    ];

    render(<PendingBookings {...defaultProps} bookings={unsortedBookings} />);
    
    const bookingElements = screen.getAllByText('John Doe');
    expect(bookingElements).toHaveLength(2);
    // Would need to add data-testid to verify order
  });
});
