import { BookingRequestForm } from './BookingRequestForm';

const RESOURCES = {
  '1': 'Conference Room A',
  '2': 'Meeting Room B',
  '3': 'Auditorium',
  '4': 'Board Room'
};

export function BookingFormWrapper() {
  const handleSubmit = async (data) => {
    // In a real app, this would make an API call to save the booking
    console.log('Booking submitted:', {
      requesterName: 'Current User', // In a real app, get from auth
      requesterEmail: 'user@company.com', // In a real app, get from auth
      resourceName: RESOURCES[data.resourceId] || '',
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      purpose: data.purpose,
      expectedAttendees: parseInt(data.expectedAttendees),
    });

    // Show success message
    alert('Your booking request has been saved and is pending approval.');
  };

  return <BookingRequestForm onSubmit={handleSubmit} />;
}
