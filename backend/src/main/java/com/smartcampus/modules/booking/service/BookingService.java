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

    List<BookingResponse> getAllBookings();

    List<BookingResponse> getBookingsByStatus(BookingStatus status);

    List<BookingResponse> getBookingsByResourceAndDate(String resourceName, LocalDate date);

    BookingResponse getBookingById(Long bookingId, Long userId);

    BookingResponse approveBooking(Long bookingId, Long adminUserId);

    BookingResponse rejectBooking(Long bookingId, RejectBookingRequest request, Long adminUserId);

    BookingResponse cancelBooking(Long bookingId, CancelBookingRequest request, Long userId);
}
