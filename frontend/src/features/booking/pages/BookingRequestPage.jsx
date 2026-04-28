import { Link } from 'react-router-dom';
import { BookingFormWrapper } from '../components/BookingFormWrapper';
import { ArrowLeft } from 'lucide-react';

export function BookingRequestPage() {
  return (
    <div className="space-y-6 pb-10 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <Link 
          to="/dashboard/bookings"
          className="inline-flex items-center text-sm font-medium text-text-muted hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to My Bookings
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-main leading-tight">Request a Resource</h1>
          <p className="text-text-muted mt-1">
            Fill out the form below to submit your booking request. Our team will review and respond within 2 hours.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <BookingFormWrapper />
      </div>
    </div>
  );
}
