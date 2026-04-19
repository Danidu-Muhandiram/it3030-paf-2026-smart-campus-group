import { Link } from 'react-router-dom';
import { MyBookingsPage as MyBookingContent } from '../components/MyBookingContent';
import { Calendar } from 'lucide-react';

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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/dashboard" className="hover:text-blue-600 transition-colors font-medium">Dashboard</Link>
              <span>/</span>
              <span className="text-blue-600 font-medium">My Bookings</span>
            </nav>
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                <p className="text-gray-600">Manage and track your resource reservations</p>
              </div>
            </div>
          </div>
          <Link
            to="/dashboard/bookings/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md h-auto inline-flex items-center"
          >
              + New Booking
          </Link>
        </div>

        {/* Page Content */}
        <MyBookingContent initialBookings={MOCK_BOOKINGS} />
      </div>
    </main>
  );
}
