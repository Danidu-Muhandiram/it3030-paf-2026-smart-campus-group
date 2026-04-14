'use client';

import { MyBookingsPage } from '@/components/booking/my-bookings-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { useBookings } from '@/context/bookings-context';

export default function Page() {
  const { bookings } = useBookings();
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <a href="/" className="hover:text-blue-600 transition-colors font-medium">Home</a>
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
          <Link href="/booking/request">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 h-auto">
              + New Booking
            </Button>
          </Link>
        </div>

        {/* Page Content */}
        <MyBookingsPage initialBookings={bookings} />
      </div>
    </main>
  );
}
