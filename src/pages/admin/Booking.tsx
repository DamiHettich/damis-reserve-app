import { useState } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: Date;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no-show';
  service: string;
  notes?: string;
  paymentStatus: 'paid' | 'pending' | 'refunded';
}

export default function AdminBookings() {
  const { t } = useTranslation('admin');
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+1234567890',
      date: new Date(),
      status: 'confirmed',
      service: 'Code Review',
      notes: 'First session',
      paymentStatus: 'paid'
    },
    // Add more mock data as needed
  ]);

  const [statusFilter, setStatusFilter] = useState<Booking['status'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerPhone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
    // TODO: Implement API call
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
  };

  const handleSendReminder = async (booking: Booking) => {
    // TODO: Implement email sending
    console.log('Sending reminder to:', booking.customerEmail);
  };

  const handleContactCustomer = async (booking: Booking) => {
    // TODO: Implement contact functionality
    window.location.href = `mailto:${booking.customerEmail}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('booking.title')}</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder={t('booking.search')}
            className="px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Booking['status'] | 'all')}
            className="px-4 py-2 border rounded-md bg-white"
          >
            <option value="all">{t('booking.filters.allStatus')}</option>
            <option value="confirmed">{t('booking.filters.confirmed')}</option>
            <option value="pending">{t('booking.filters.pending')}</option>
            <option value="cancelled">{t('booking.filters.cancelled')}</option>
            <option value="completed">{t('booking.filters.completed')}</option>
            <option value="no-show">{t('booking.filters.noShow')}</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('booking.table.customer')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('booking.table.date')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('booking.table.service')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('booking.table.status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('booking.table.payment')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('booking.table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr 
                key={booking.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedBooking(booking)}
              >
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                  <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {format(booking.date, 'PPp')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {booking.service}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                    ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    ${booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                    ${booking.status === 'no-show' ? 'bg-gray-100 text-gray-800' : ''}
                  `}>
                    {t(`booking.status.${booking.status}`)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : ''}
                    ${booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${booking.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {t(`booking.paymentStatus.${booking.paymentStatus}`)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContactCustomer(booking);
                    }}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    {t('booking.actions.contact')}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendReminder(booking);
                    }}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    {t('booking.actions.remind')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">{t('booking.details.title')}</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">{t('booking.details.customerInfo')}</h4>
                <p className="mt-1">{selectedBooking.customerName}</p>
                <p className="text-sm text-gray-500">{selectedBooking.customerEmail}</p>
                <p className="text-sm text-gray-500">{selectedBooking.customerPhone}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">{t('booking.details.bookingStatus')}</h4>
                <select
                  value={selectedBooking.status}
                  onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value as Booking['status'])}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="confirmed">{t('booking.filters.confirmed')}</option>
                  <option value="pending">{t('booking.filters.pending')}</option>
                  <option value="cancelled">{t('booking.filters.cancelled')}</option>
                  <option value="completed">{t('booking.filters.completed')}</option>
                  <option value="no-show">{t('booking.filters.noShow')}</option>
                </select>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">{t('booking.details.notes')}</h4>
                <textarea
                  value={selectedBooking.notes}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => handleContactCustomer(selectedBooking)}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  {t('booking.details.contactCustomer')}
                </button>
                <button
                  onClick={() => handleSendReminder(selectedBooking)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('booking.details.sendReminder')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
