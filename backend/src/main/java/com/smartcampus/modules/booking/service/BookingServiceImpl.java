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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingServiceImpl(BookingRepository bookingRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    @Override
    public BookingResponse createBooking(CreateBookingRequest request, Long userId) {
        log.info("Creating booking for user {} and resource {}", userId, request.getResourceName());
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Validate time range
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        // Check for conflicts
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(
                request.getResourceName(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime()
        );

        if (!overlappingBookings.isEmpty()) {
            throw new IllegalStateException("This resource is already booked for the selected time range");
        }

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResourceName(request.getResourceName());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);
        log.info("Booking created successfully with id: {}", savedBooking.getId());
        
        return BookingResponse.fromEntity(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(Long userId) {
        log.info("Fetching all bookings for user {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        return bookingRepository.findByUserOrderByBookingDateDescStartTimeDesc(user)
                .stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyUpcomingBookings(Long userId) {
        log.info("Fetching upcoming bookings for user {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        return bookingRepository.findUpcomingBookingsByUser(user, LocalDate.now())
                .stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyPastBookings(Long userId) {
        log.info("Fetching past bookings for user {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        return bookingRepository.findPastBookingsByUser(user, LocalDate.now())
                .stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        log.info("Fetching all bookings");
        
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByStatus(BookingStatus status) {
        log.info("Fetching bookings with status: {}", status);
        
        return bookingRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByResourceAndDate(String resourceName, LocalDate date) {
        log.info("Fetching bookings for resource {} on date {}", resourceName, date);
        
        return bookingRepository.findByResourceNameAndBookingDateOrderByStartTimeAsc(resourceName, date)
                .stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long bookingId, Long userId) {
        log.info("Fetching booking {} for user {}", bookingId, userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + bookingId));
        
        // Check if user owns this booking or is admin
        if (!booking.getUser().getId().equals(userId) && !isAdmin(user)) {
            throw new IllegalArgumentException("You don't have permission to view this booking");
        }
        
        return BookingResponse.fromEntity(booking);
    }

    @Override
    public BookingResponse approveBooking(Long bookingId, Long adminUserId) {
        log.info("Admin {} approving booking {}", adminUserId, bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + bookingId));

        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found with id: " + adminUserId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending bookings can be approved");
        }

        // Check for conflicts with already approved bookings
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookingsExcludingId(
                booking.getResourceName(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                bookingId
        );

        if (!overlappingBookings.isEmpty()) {
            throw new IllegalStateException("Cannot approve booking due to time conflict with another approved booking");
        }

        booking.approve(admin);
        Booking updatedBooking = bookingRepository.save(booking);
        
        log.info("Booking {} approved successfully", bookingId);
        return BookingResponse.fromEntity(updatedBooking);
    }

    @Override
    public BookingResponse rejectBooking(Long bookingId, RejectBookingRequest request, Long adminUserId) {
        log.info("Admin {} rejecting booking {}", adminUserId, bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + bookingId));

        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found with id: " + adminUserId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending bookings can be rejected");
        }

        booking.reject(admin, request.getReason());
        Booking updatedBooking = bookingRepository.save(booking);
        
        log.info("Booking {} rejected successfully", bookingId);
        return BookingResponse.fromEntity(updatedBooking);
    }

    @Override
    public BookingResponse cancelBooking(Long bookingId, CancelBookingRequest request, Long userId) {
        log.info("User {} cancelling booking {}", userId, bookingId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        Booking booking = bookingRepository.findByIdAndUser(bookingId, user)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found or does not belong to you"));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException("Only approved bookings can be cancelled");
        }

        booking.cancel();

        // Optional cancellation reason
        if (request != null && request.getReason() != null && !request.getReason().isBlank()) {
            booking.setRejectionReason(request.getReason());
        }

        Booking updatedBooking = bookingRepository.save(booking);
        
        log.info("Booking {} cancelled successfully", bookingId);
        return BookingResponse.fromEntity(updatedBooking);
    }
    
    @Override
    @Transactional(readOnly = true)
    public BookingStatistics getBookingStatistics() {
        log.info("Fetching booking statistics");
        
        long total = bookingRepository.count();
        long pending = bookingRepository.countByStatus(BookingStatus.PENDING);
        long approved = bookingRepository.countByStatus(BookingStatus.APPROVED);
        long rejected = bookingRepository.countByStatus(BookingStatus.REJECTED);
        long cancelled = bookingRepository.countByStatus(BookingStatus.CANCELLED);
        
        return new BookingStatistics(total, pending, approved, rejected, cancelled);
    }
    
    private boolean isAdmin(User user) {
        return user.getRole() != null && "ROLE_ADMIN".equals(user.getRole().getName());
    }
}
