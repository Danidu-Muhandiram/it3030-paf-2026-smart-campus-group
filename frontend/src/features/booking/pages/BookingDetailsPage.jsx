import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Users, FileText, CheckCircle, XCircle } from 'lucide-react';
import '../styles/booking.css';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch booking details
      const bookingResponse = await fetch(`http://localhost:8086/api/bookings/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!bookingResponse.ok) {
        throw new Error('Failed to fetch booking details');
      }

      const bookingData = await bookingResponse.json();
      setBooking(bookingData.data);

      // Fetch other bookings for the same resource and date
      if (bookingData.data) {
        await fetchTimeSlots(bookingData.data.resourceName, bookingData.data.bookingDate);
      }
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSlots = async (resourceName, date) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8086/api/bookings/resource/${encodeURIComponent(resourceName)}/date/${date}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTimeSlots(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching time slots:', err);
    }
  };

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8086/api/bookings/admin/${id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Booking approved successfully!');
        navigate('/admin/bookings');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to approve booking');
      }
    } catch (err) {
      console.error('Error approving booking:', err);
      alert('Failed to approve booking');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim() || rejectionReason.length < 10) {
      setError('Rejection reason must be at least 10 characters');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8086/api/bookings/admin/${id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectionReason })
      });

      if (response.ok) {
        alert('Booking rejected successfully!');
        navigate('/admin/bookings');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to reject booking');
      }
    } catch (err) {
      console.error('Error rejecting booking:', err);
      alert('Failed to reject booking');
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        status: 'available'
      });
    }

    // Mark booked slots
    timeSlots.forEach(booking => {
      const startHour = parseInt(booking.startTime.split(':')[0]);
      const endHour = parseInt(booking.endTime.split(':')[0]);
      
      for (let i = 0; i < slots.length; i++) {
        const slotHour = parseInt(slots[i].time.split(':')[0]);
        if (slotHour >= startHour && slotHour < endHour) {
          slots[i].status = booking.id === parseInt(id) ? 'current' : 'booked';
          slots[i].booking = booking;
        }
      }
    });

    return slots;
  };

  if (loading) {
    return (
      <div className="booking-details-page">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="booking-details-page">
        <div className="error-message">Booking not found</div>
      </div>
    );
  }

  const slots = generateTimeSlots();

  return (
    <div className="booking-details-page">
      <div className="booking-details-header">
        <button className="back-button" onClick={() => navigate('/admin/bookings')}>
          <ArrowLeft size={20} />
          Back to Bookings
        </button>
        <h1 className="page-title">Booking Request Details</h1>
      </div>

      <div className="booking-details-container">
        {/* Left Side - Booking Details */}
        <div className="booking-details-left">
          <div className="booking-details-card">
            <div className="resource-header">
              <h2 className="resource-name">{booking.resourceName}</h2>
              <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                {booking.status}
              </span>
            </div>
            <div className="requested-date">
              <span className="label">Requested Date</span>
              <span className="value">{booking.bookingDate}</span>
            </div>

            <div className="details-grid">
              <div className="details-section">
                <h3 className="section-title">Requester Information</h3>
                <div className="requester-info">
                  <div className="user-avatar">
                    {booking.userName ? booking.userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="user-details">
                    <div className="user-name">{booking.userName || 'Unknown User'}</div>
                    <div className="user-email">{booking.userEmail || 'No email'}</div>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3 className="section-title">Booking Details</h3>
                <div className="detail-item">
                  <Calendar size={18} className="detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Date</span>
                    <span className="detail-value">{booking.bookingDate}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Clock size={18} className="detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Time</span>
                    <span className="detail-value">
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <Users size={18} className="detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Expected Attendees</span>
                    <span className="detail-value">{booking.expectedAttendees} people</span>
                  </div>
                </div>
                <div className="detail-item">
                  <FileText size={18} className="detail-icon" />
                  <div className="detail-content">
                    <span className="detail-label">Purpose</span>
                    <span className="detail-value">{booking.purpose}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Time Slots */}
        <div className="booking-details-right">
          <div className="time-slots-card">
            <h3 className="time-slots-title">
              Other Bookings - {booking.resourceName} on {booking.bookingDate}
            </h3>
            
            <div className="time-slots-legend">
              <div className="legend-item">
                <span className="legend-color available"></span>
                <span className="legend-label">Available</span>
              </div>
              <div className="legend-item">
                <span className="legend-color current"></span>
                <span className="legend-label">Current Booking</span>
              </div>
              <div className="legend-item">
                <span className="legend-color booked"></span>
                <span className="legend-label">Booked</span>
              </div>
            </div>

            <div className="time-slots-grid">
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className={`time-slot time-slot-${slot.status}`}
                  title={slot.booking ? `Booked by ${slot.booking.userName}` : 'Available'}
                >
                  <span className="slot-time">{slot.time}</span>
                  {slot.booking && slot.status !== 'current' && (
                    <span className="slot-info">{slot.booking.userName}</span>
                  )}
                  {slot.status === 'current' && (
                    <span className="slot-info">This Booking</span>
                  )}
                </div>
              ))}
            </div>

            {timeSlots.length === 0 && (
              <div className="no-bookings-message">
                <p>No other bookings for this resource on this date</p>
                <p className="sub-message">This time slot is available</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {booking.status === 'PENDING' && (
            <div className="action-buttons">
              <button className="approve-button" onClick={handleApprove}>
                <CheckCircle size={20} />
                Approve Booking
              </button>
              <button className="reject-button" onClick={() => setShowRejectModal(true)}>
                <XCircle size={20} />
                Reject Booking
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reject Booking</h2>
              <button className="modal-close" onClick={() => setShowRejectModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                Please provide a reason for rejecting this booking request.
              </p>
              <textarea
                className="rejection-textarea"
                placeholder="Enter rejection reason (minimum 10 characters)..."
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  setError('');
                }}
                rows={4}
              />
              {error && <div className="error-text">{error}</div>}
              <div className="character-count">
                {rejectionReason.length} / 500 characters
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="modal-button cancel-button"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setError('');
                }}
              >
                Cancel
              </button>
              <button
                className="modal-button confirm-button"
                onClick={handleReject}
                disabled={rejectionReason.length < 10}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetailsPage;
