package com.smartcampus.modules.booking.service;

import com.smartcampus.modules.booking.dto.BookingResponse;
import com.smartcampus.modules.booking.dto.CancelBookingRequest;
import com.smartcampus.modules.booking.dto.CreateBookingRequest;
import com.smartcampus.modules.booking.dto.RejectBookingRequest;
import com.smartcampus.modules.booking.entity.BookingStatus;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {

    BookingResponse createBooking(CreateBookingRequest request, Long userId);

    List<BookingResponse> getMyBookings(Long userId);
    
    List<BookingResponse> getMyUpcomingBookings(Long userId);
    
    List<BookingResponse> getMyPastBookings(Long userId);

    List<BookingResponse> getAllBookings();
    
    List<BookingResponse> getBookingsByStatus(BookingStatus status);
    
    List<BookingResponse> getBookingsByResourceAndDate(String resourceName, LocalDate date);
    
    BookingResponse getBookingById(Long bookingId, Long userId);

    BookingResponse approveBooking(Long bookingId, Long adminUserId);

    BookingResponse rejectBooking(Long bookingId, RejectBookingRequest request, Long adminUserId);

    BookingResponse cancelBooking(Long bookingId, CancelBookingRequest request, Long userId);
    
    BookingStatistics getBookingStatistics();
    
    // Inner class for statistics
    class BookingStatistics {
        private long totalBookings;
        private long pendingBookings;
        private long approvedBookings;
        private long rejectedBookings;
        private long cancelledBookings;
        
        public BookingStatistics(long totalBookings, long pendingBookings, long approvedBookings, 
                                long rejectedBookings, long cancelledBookings) {
            this.totalBookings = totalBookings;
            this.pendingBookings = pendingBookings;
            this.approvedBookings = approvedBookings;
            this.rejectedBookings = rejectedBookings;
            this.cancelledBookings = cancelledBookings;
        }
        
        public long getTotalBookings() { return totalBookings; }
        public long getPendingBookings() { return pendingBookings; }
        public long getApprovedBookings() { return approvedBookings; }
        public long getRejectedBookings() { return rejectedBookings; }
        public long getCancelledBookings() { return cancelledBookings; }
    }
}
