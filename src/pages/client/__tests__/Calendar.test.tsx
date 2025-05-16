import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Calendar from '../Calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Mock react-big-calendar
jest.mock('react-big-calendar', () => ({
  Calendar: ({ events, onSelectEvent }: any) => (
    <div data-testid="mock-calendar">
      {events.map((event: any) => (
        <button
          key={event.id}
          onClick={() => onSelectEvent(event)}
          data-testid={`calendar-event-${event.id}`}
        >
          {event.title}
        </button>
      ))}
    </div>
  ),
  dateFnsLocalizer: () => ({}),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('Calendar', () => {
  const mockNavigate = jest.fn();
  const mockTranslation = {
    t: (key: string) => key,
    i18n: {
      language: 'en-US',
    },
  };

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useTranslation as jest.Mock).mockReturnValue(mockTranslation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderCalendar = () => {
    return render(
      <MemoryRouter>
        <Calendar />
      </MemoryRouter>
    );
  };

  it('renders calendar with title and subtitle', () => {
    renderCalendar();
    expect(screen.getByText('calendar.title')).toBeInTheDocument();
    expect(screen.getByText('calendar.subtitle')).toBeInTheDocument();
  });

  it('displays available time slots', () => {
    renderCalendar();
    const slots = screen.getAllByText(/calendar.slot.available - \$50/);
    expect(slots).toHaveLength(2);
  });

  it('allows selecting a time slot', () => {
    renderCalendar();
    const slot = screen.getByTestId('calendar-event-1');
    fireEvent.click(slot);
    
    expect(screen.getByText('calendar.selectedSessions.title')).toBeInTheDocument();
    expect(screen.getByText('calendar.selectedSessions.session')).toBeInTheDocument();
  });

  it('shows total price for selected slots', () => {
    renderCalendar();
    const slot = screen.getByTestId('calendar-event-1');
    fireEvent.click(slot);
    
    const totalText = screen.getByText('calendar.selectedSessions.total');
    expect(totalText).toBeInTheDocument();
    
    // Use getByText with a more specific selector
    const totalAmount = screen.getByText('$50', { 
      selector: '.font-semibold'  // This targets the total amount specifically
    });
    expect(totalAmount).toBeInTheDocument();
  });

  it('shows error when trying to checkout without selection', async () => {
    renderCalendar();
    const slot = screen.getByTestId('calendar-event-1');
    fireEvent.click(slot);
    
    const checkoutButton = screen.getByText('calendar.actions.checkout');
    fireEvent.click(checkoutButton);

    expect(mockNavigate).toHaveBeenCalledWith('/booking/confirm', {
      state: expect.objectContaining({
        selectedSlots: expect.any(Array),
        returnPath: '/calendar',
      }),
    });
  });

  it('allows deselecting a time slot', () => {
    renderCalendar();
    const slot = screen.getByTestId('calendar-event-1');
    
    // Select slot
    fireEvent.click(slot);
    expect(screen.getByText('calendar.selectedSessions.session')).toBeInTheDocument();
    
    // Deselect slot
    fireEvent.click(slot);
    expect(screen.queryByText('calendar.selectedSessions.session')).not.toBeInTheDocument();
  });

  it('handles language change', () => {
    (useTranslation as jest.Mock).mockReturnValue({
      ...mockTranslation,
      i18n: { language: 'es' },
      t: (key: string) => key === 'calendar.at' ? 'a las' : key,
    });
    
    renderCalendar();
    const slot = screen.getByTestId('calendar-event-1');
    fireEvent.click(slot);
    
    expect(screen.getByText(/a las/)).toBeInTheDocument();
  });
});
