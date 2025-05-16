import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import type { TimeSlot } from '../../types/calendar';

interface BookingDetails {
  slots: TimeSlot[];
  totalAmount: number;
}

interface LocationState {
  bookingDetails: BookingDetails;
}

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = location.state as LocationState;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg 
                className="h-6 w-6 text-green-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                data-testid="success-icon"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
            <p className="mt-1 text-gray-600">Thank you for your booking. We look forward to seeing you!</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="space-y-6">
            {/* Booking Details */}
            <div>
              <div className="mt-4 space-y-4">
                {bookingDetails.slots.map(slot => (
                  <div key={slot.id} className="border-b pb-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          {format(new Date(slot.start), 'PPPP')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(slot.start), 'p')} - {format(new Date(slot.end), 'p')}
                        </p>
                      </div>
                      <p className="font-medium">${slot.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-900">Payment Information</h4>
              <p className="mt-2 text-sm text-gray-600">
                A deposit of ${bookingDetails.totalAmount} has been processed. The remaining balance
                will be charged after the session.
              </p>
            </div>

            {/* Important Notes */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Important Information</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Please arrive 15 minutes before your scheduled session time.</p>
                <p>• If you need to cancel or reschedule, please do so at least 24 hours in advance.</p>
                <p>• The location details and any additional instructions will be sent to your email.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-6">
              <button
                onClick={() => navigate('/calendar')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Book Another Session
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
