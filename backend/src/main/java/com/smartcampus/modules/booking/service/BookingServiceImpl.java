package com.smartcampus.modules.booking.service;

import com.smartcampus.modules.auth.entity.User;
import com.smartcampus.modules.auth.repository.UserRepository;
import com.smartcampus.modules.booking.dto.BookingResponse;
import com.smartcampus.modules.booking.dto.CancelBookingRequest;
import com.smartcampus.modules.booking.dto.CreateBookingRequest;
import com.smartcampus.modules.booking.dto.RejectBookingRequest;
import com.smartcampus.modules.booking.entity.Booking;
import com.smartcampus.modules.booking.entity.BookingStatus;
import com.smartcampus.modules.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request, Long userId) {
        User user = getUserOrThrow(userId);

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        List<Booking> overlaps = bookingRepository.findOverlappingBookings(
                request.getResourceName(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime()
        );
        if (!overlaps.isEmpty()) {
            throw new IllegalStateException("This resource is already booked for the selected time range");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResourceName(request.getResourceName());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);

        return BookingResponse.fromEntity(bookingRepository.save(booking));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(Long userId) {
        User user = getUserOrThrow(userId);
        return bookingRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(BookingResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(BookingResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(BookingResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByResourceAndDate(String resourceName, java.time.LocalDate date) {
        return bookingRepository.findByResourceNameAndBookingDateOrderByStartTimeAsc(resourceName, date)
                .stream()
                .map(BookingResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long bookingId, Long userId) {
        User user = getUserOrThrow(userId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + bookingId));

        if (!booking.getUser().getId().equals(userId) && !isAdmin(user)) {
            throw new IllegalArgumentException("You don't have permission to view this booking");
        }

        return BookingResponse.fromEntity(booking);
    }

    @Override
    @Transactional
    public BookingResponse approveBooking(Long bookingId, Long adminUserId) {
        User admin = getUserOrThrow(adminUserId);
        if (!isAdmin(admin)) {
            throw new IllegalArgumentException("Only admins can approve bookings");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending bookings can be approved");
        }

        List<Booking> overlaps = bookingRepository.findOverlappingBookingsExcludingId(
                booking.getResourceName(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getId()
        );
        if (!overlaps.isEmpty()) {
            throw new IllegalStateException("Cannot approve booking due to a scheduling conflict");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setReviewedBy(admin);
        booking.setReviewedAt(LocalDateTime.now());
        booking.setRejectionReason(null);

        return BookingResponse.fromEntity(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public BookingResponse rejectBooking(Long bookingId, RejectBookingRequest request, Long adminUserId) {
        User admin = getUserOrThrow(adminUserId);
        if (!isAdmin(admin)) {
            throw new IllegalArgumentException("Only admins can reject bookings");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setReviewedBy(admin);
        booking.setReviewedAt(LocalDateTime.now());
        booking.setRejectionReason(request.getReason());

        return BookingResponse.fromEntity(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long bookingId, CancelBookingRequest request, Long userId) {
        User user = getUserOrThrow(userId);
        Booking booking = bookingRepository.findByIdAndUser(bookingId, user)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found or does not belong to you"));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException("Only approved bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        if (request != null && request.getReason() != null && !request.getReason().isBlank()) {
            booking.setRejectionReason(request.getReason().trim());
        }

        return BookingResponse.fromEntity(bookingRepository.save(booking));
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
    }

    private boolean isAdmin(User user) {
        if (user.getRole() == null || user.getRole().getName() == null) {
            return false;
        }
        String roleName = user.getRole().getName().toUpperCase();
        return "ADMIN".equals(roleName) || "ROLE_ADMIN".equals(roleName);
    }
}
