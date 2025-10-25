import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { Booking } from '../types';

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getMyBookings();
      if (response.data) {
        setBookings(response.data);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      alert('Booking cancelled successfully');
      loadBookings();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-purple-100 text-purple-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 text-lg mb-4">You haven't made any bookings yet.</p>
            <a href="/services" className="btn-primary inline-block">
              Browse Services
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {booking.service?.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Vendor: {booking.vendor?.name}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mt-3">
                      <div>
                        <strong>Date:</strong> {new Date(booking.slotDate).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Time:</strong> {booking.slotTime}
                      </div>
                      <div>
                        <strong>Address:</strong> {booking.address}
                      </div>
                      <div>
                        <strong>Amount:</strong> ₹{booking.totalAmount}
                      </div>
                      {booking.payment && (
                        <div>
                          <strong>Payment:</strong>{' '}
                          <span
                            className={
                              booking.payment.status === 'COMPLETED'
                                ? 'text-green-600'
                                : 'text-yellow-600'
                            }
                          >
                            {booking.payment.status}
                          </span>
                        </div>
                      )}
                    </div>

                    {booking.notes && (
                      <div className="mt-3 text-sm text-gray-600">
                        <strong>Notes:</strong> {booking.notes}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2">
                    {booking.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                      >
                        Cancel Booking
                      </button>
                    )}
                    {booking.status === 'CONFIRMED' &&
                      booking.payment?.status !== 'COMPLETED' && (
                        <button
                          className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed text-sm"
                          disabled
                          title="Payment gateway under maintenance"
                        >
                          Payment Unavailable
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
