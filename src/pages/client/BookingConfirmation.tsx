import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import type { TimeSlot } from '../../types/calendar';

interface LocationState {
  selectedSlots: TimeSlot[];
  returnPath: string;
}

const PAYMENT_METHODS = [
  {
    id: 'webpay',
    name: 'WebPay',
    description: 'Pay with debit, credit card or prepaid',
    icon: (
      <img src="/webpay.png" alt="Fintoc" className="h-14 w-14" />
    )
  },
  // {
  //   id: 'fintoc',
  //   name: 'Fintoc',
  //   description: 'Direct bank transfer',
  //   icon: (
  //     <img src="/fintoc.webp" alt="Fintoc" className="h-14 w-14" />
  //   )
  // },
  {
    id: 'mercadopago',
    name: 'MercadoPago',
    description: 'Multiple payment methods',
    icon: (
      <img src="/mercadopago.webp" alt="Fintoc" className="h-14 w-14" />
    )
  }
] as const;

type PaymentMethodId = typeof PAYMENT_METHODS[number]['id'];

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSlots, returnPath } = location.state as LocationState;
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodId | null>(null);

  const totalAmount = selectedSlots.reduce((sum, slot) => sum + slot.price, 0);

  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // TODO: Implement payment processing and booking confirmation
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Navigate to success page or show success message
      navigate('/booking/success', {
        state: {
          bookingDetails: {
            slots: selectedSlots,
            totalAmount
          }
        }
      });
    } catch (err) {
      setError('Failed to process booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Confirm Your Booking</h2>
        <p className="mt-2 text-gray-600">Please review your selected sessions before proceeding.</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden  mb-4">
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">You are booking</h3>
              <div className="mt-4 space-y-4">
                {selectedSlots.map(slot => (
                  <div key={slot.id} className="pb-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">Session</h4>
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

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">Total Amount</p>
                <p className="text-lg font-semibold">${totalAmount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <div className="p-6">
            {/* Payment Method Selection */}
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Choose a payment method
              </h3>
              <div className="grid gap-4">
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    className={`
                      relative rounded-lg border p-4 cursor-pointer
                      ${
                        selectedPaymentMethod === method.id
                          ? 'border-primary-600 ring-2 ring-primary-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 text-gray-600">
                        {method.icon}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-base font-medium text-gray-900">
                          {method.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {method.description}
                        </p>
                      </div>
                      {selectedPaymentMethod === method.id && (
                        <div className="absolute right-4">
                          <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-4 m-4">
              <button
                onClick={() => navigate(returnPath)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isProcessing || !selectedPaymentMethod}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Confirm and Pay'}
              </button>
            </div>
          </div>
        </div>
  );
}
