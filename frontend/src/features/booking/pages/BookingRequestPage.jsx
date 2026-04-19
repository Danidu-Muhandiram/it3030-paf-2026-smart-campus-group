import { Link } from 'react-router-dom';
import { BookingFormWrapper } from '../components/BookingFormWrapper';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';

export function BookingRequestPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative h-72 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_white_0%,_transparent_45%),radial-gradient(circle_at_bottom_right,_white_0%,_transparent_45%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Book Your Resource</h1>
            <p className="text-xl text-blue-100">
              Simple, fast, and efficient resource booking for your team
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 -mt-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
            <Calendar className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Easy Scheduling</h3>
            <p className="text-sm text-gray-600">Pick dates and times that work for you</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
            <Clock className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Instant Availability</h3>
            <p className="text-sm text-gray-600">See available time slots immediately</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
            <Users className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Team Coordination</h3>
            <p className="text-sm text-gray-600">Specify attendees and resource needs</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
            <CheckCircle className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Fast Approval</h3>
            <p className="text-sm text-gray-600">Get instant feedback on your request</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-xl p-8 md:p-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/dashboard" className="hover:text-blue-600 transition-colors font-medium">Dashboard</Link>
            <span>/</span>
            <Link to="/dashboard/bookings" className="hover:text-blue-600 transition-colors font-medium">My Bookings</Link>
            <span>/</span>
            <span className="text-blue-600 font-medium">Create Booking</span>
          </nav>

          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Request a Resource</h2>
            <p className="text-gray-600">
              Fill out the form below to submit your booking request. Our team will review and respond within 2 hours.
            </p>
          </div>

          {/* Form */}
          <BookingFormWrapper />
        </div>
      </div>
    </main>
  );
}
