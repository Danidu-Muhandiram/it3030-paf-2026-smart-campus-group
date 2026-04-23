import { useNavigate } from 'react-router-dom';
import { BookingRequestForm } from './BookingRequestForm';
import axiosInstance from '../../../services/axios';

export function BookingFormWrapper() {
  const navigate = useNavigate();

  const handleSubmit = async (requestData) => {
    try {
      console.log('Sending booking data:', requestData);

      const response = await axiosInstance.post('/bookings', requestData);
      console.log('Booking created:', response.data?.data || response.data);
      
      // Show success message
      alert('Your booking request has been submitted and is pending approval.');
      
      // Redirect to My Bookings page
      navigate('/dashboard/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        (error?.code === 'ERR_NETWORK'
          ? 'Cannot reach backend server. Check that API is running on the configured port.'
          : error.message) ||
        'Failed to create booking. Please try again.';
      alert(message);
    }
  };

  return <BookingRequestForm onSubmit={handleSubmit} />;
}
