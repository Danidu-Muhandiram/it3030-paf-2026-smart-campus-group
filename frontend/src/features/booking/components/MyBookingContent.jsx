import { useState, useEffect } from 'react';
import { BookingCard } from './BookingCard';
import axiosInstance from '../../../services/axios';

export function MyBookingsPage({ initialBookings = [], onCancelBooking }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState('ALL');
  const [cancelingId, setCancelingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch bookings from backend
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsFetching(true);
      const response = await axiosInstance.get('/bookings/my-bookings');
      const sortedBookings = (response.data?.data || []).sort((a, b) =>
        new Date(b.createdAt || b.bookingDate) - new Date(a.createdAt || a.bookingDate)
      );
      setBookings(sortedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const filteredBookings = filter === 'ALL'
    ? bookings
    : bookings.filter(b => b.status === filter);

  const handleCancel = async (bookingId) => {
    setIsLoading(true);
    try {
      await axiosInstance.post(`/bookings/${bookingId}/cancel`, { reason: 'Cancelled by user' });

      // Update local state
      setBookings(prev =>
        prev.map(b =>
          b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
        )
      );

      alert('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      const message = error?.response?.data?.message || 'Failed to cancel booking';
      alert(message);
    } finally {
      setIsLoading(false);
      setCancelingId(null);
    }
  };

  const statuses = [
    { value: 'ALL', label: 'All Bookings' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  if (isFetching) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => setFilter(status.value)}
            className={`px-4 py-2 rounded border ${
              filter === status.value 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">No Bookings Found</h3>
          <p className="text-muted-foreground">
            {filter === 'ALL'
              ? "You haven't made any bookings yet. Create one to get started!"
              : `You don't have any ${filter.toLowerCase()} bookings.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              id={booking.id}
              resourceName={booking.resourceName}
              date={booking.bookingDate}
              startTime={booking.startTime}
              endTime={booking.endTime}
              purpose={booking.purpose}
              status={booking.status}
              attendees={booking.expectedAttendees}
              onCancel={() => setCancelingId(booking.id)}
            />
          ))}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {cancelingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-semibold mb-2">Cancel Booking?</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setCancelingId(null)}
                disabled={isLoading}
                className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancel(cancelingId)}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
              >
                {isLoading ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
