import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { MyBookingsPage as MyBookingContent } from '../components/MyBookingContent';

const MOCK_BOOKINGS = [
  {
    id: '1',
    resourceName: 'Conference Room A',
    date: '2026-04-20',
    startTime: '09:00',
    endTime: '10:00',
    purpose: 'Weekly Team Sync',
    status: 'APPROVED'
  },
  {
    id: '2',
    resourceName: 'Meeting Room B',
    date: '2026-04-22',
    startTime: '14:00',
    endTime: '15:30',
    purpose: 'Client Presentation Rehearsal',
    status: 'PENDING'
  },
  {
    id: '3',
    resourceName: 'Board Room',
    date: '2026-04-12',
    startTime: '11:00',
    endTime: '12:00',
    purpose: 'Budget Planning',
    status: 'REJECTED'
  }
];

export function MyBookingPage() {
  return (
    <div className="space-y-6 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main leading-tight">My Bookings</h1>
          <p className="text-text-muted mt-1">Manage and track your resource reservations in real-time.</p>
        </div>
        <Link
          to="/dashboard/bookings/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg transition-all shadow-sm"
        >
          <Plus size={18} />
          New Booking
        </Link>
      </div>

      {/* Page Content */}
      <MyBookingContent initialBookings={MOCK_BOOKINGS} />
    </div>
  );
}
