import { useState } from 'react';

const RESOURCES = ['All Resources', 'Conference Room A', 'Meeting Room B', 'Auditorium', 'Board Room'];

const MOCK_BOOKINGS = [
  {
    id: '1',
    requesterName: 'John Doe',
    requesterEmail: 'john.doe@example.com',
    resourceName: 'Conference Room A',
    date: '2026-04-15',
    startTime: '09:00',
    endTime: '11:00',
    purpose: 'Team Meeting',
    expectedAttendees: 10,
    status: 'PENDING'
  },
  {
    id: '2',
    requesterName: 'Jane Smith',
    requesterEmail: 'jane.smith@example.com',
    resourceName: 'Meeting Room B',
    date: '2026-04-16',
    startTime: '14:00',
    endTime: '16:00',
    purpose: 'Client Presentation',
    expectedAttendees: 5,
    status: 'APPROVED'
  }
];

export function AdminBookingsPage({
  initialBookings = MOCK_BOOKINGS,
  onApprove,
  onReject,
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [resourceFilter, setResourceFilter] = useState('All Resources');
  const [rejectingId, setRejectingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const statusMatch = statusFilter === 'ALL' || booking.status === statusFilter;
    const resourceMatch = resourceFilter === 'All Resources' || booking.resourceName === resourceFilter;
    const searchMatch =
      booking.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.requesterEmail.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && resourceMatch && searchMatch;
  });

  const handleApprove = async (bookingId) => {
    setIsLoading(true);
    try {
      if (onApprove) {
        await onApprove(bookingId);
      }

      setBookings(prev =>
        prev.map(b =>
          b.id === bookingId ? { ...b, status: 'APPROVED' } : b
        )
      );

      alert('Booking approved successfully');
    } catch (error) {
      alert('Failed to approve booking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (reason) => {
    if (!rejectingId) return;

    setIsLoading(true);
    try {
      if (onReject) {
        await onReject(rejectingId, reason);
      }

      setBookings(prev =>
        prev.map(b =>
          b.id === rejectingId ? { ...b, status: 'REJECTED' } : b
        )
      );

      alert('Booking rejected successfully');
    } catch (error) {
      alert('Failed to reject booking');
    } finally {
      setIsLoading(false);
      setRejectingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Booking Management</h1>
        <p className="text-muted-foreground mt-2">
          Review and manage all booking requests
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 p-4 bg-secondary/50 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Search by Name or Email
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter requester name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Filter by Status
            </label>
            <select 
              className="w-full px-3 py-2 border rounded-md"
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Resource Filter */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Filter by Resource
            </label>
            <select 
              className="w-full px-3 py-2 border rounded-md"
              value={resourceFilter} 
              onChange={(e) => setResourceFilter(e.target.value)}
            >
              {RESOURCES.map((resource) => (
                <option key={resource} value={resource}>
                  {resource}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(searchQuery || statusFilter !== 'ALL' || resourceFilter !== 'All Resources') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
              setResourceFilter('All Resources');
            }}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 w-fit"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Info */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredBookings.length} of {bookings.length} bookings
      </p>

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">No Bookings Found</h3>
          <p className="text-muted-foreground">No bookings match your filter criteria. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="font-semibold text-foreground text-left p-4">Requester</th>
                <th className="font-semibold text-foreground text-left p-4">Resource</th>
                <th className="font-semibold text-foreground text-left p-4">Date & Time</th>
                <th className="font-semibold text-foreground text-left p-4">Purpose</th>
                <th className="font-semibold text-foreground text-left p-4">Attendees</th>
                <th className="font-semibold text-foreground text-left p-4">Status</th>
                <th className="font-semibold text-foreground text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr 
                  key={booking.id} 
                  className="hover:bg-gray-50 transition-colors border-t"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">{booking.requesterName}</p>
                      <p className="text-xs text-muted-foreground">{booking.requesterEmail}</p>
                    </div>
                  </td>
                  <td className="text-foreground p-4">{booking.resourceName}</td>
                  <td className="text-foreground p-4">
                    <div>
                      <p>{formatDate(booking.date)}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                  </td>
                  <td className="text-foreground p-4">
                    <p className="truncate max-w-xs">{booking.purpose}</p>
                  </td>
                  <td className="text-foreground text-center p-4">
                    {booking.expectedAttendees}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      booking.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {booking.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(booking.id)}
                          disabled={isLoading}
                          className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectingId(booking.id)}
                          disabled={isLoading}
                          className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {booking.status !== 'PENDING' && (
                      <span className="text-xs text-muted-foreground">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Reject Booking</h3>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows="4"
              placeholder="Enter rejection reason..."
              id="reject-reason"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setRejectingId(null)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const reason = document.getElementById('reject-reason').value;
                  handleReject(reason);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
