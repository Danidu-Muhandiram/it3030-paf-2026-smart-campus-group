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
import com.smartcampus.modules.booking.dto.RescheduleBookingRequest;
import com.smartcampus.modules.facilities.entity.Asset;
import com.smartcampus.modules.facilities.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final AssetRepository assetRepository;
    private final BookingNotificationService bookingNotificationService;

    @Override
    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request, Long userId) {
        User user = getUserOrThrow(userId);

        Asset asset = assetRepository.findByName(request.getResourceName())
                .orElseThrow(() -> new IllegalArgumentException("Selected resource was not found"));

        if (asset.getStatus() != null && !"ACTIVE".equalsIgnoreCase(asset.getStatus())) {
            throw new IllegalStateException("Selected resource is not available for booking");
        }

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        if (asset.getCapacity() != null
                && request.getExpectedAttendees() != null
                && request.getExpectedAttendees() > asset.getCapacity()) {
            throw new IllegalArgumentException("Expected attendees exceed the resource capacity");
        }

        validateRequestedSlotHasNotStarted(request.getBookingDate(), request.getStartTime());
        validateRequestedWindow(asset, request.getStartTime(), request.getEndTime());
        validateRemainingCapacity(
                asset,
                request.getExpectedAttendees(),
                bookingRepository.findOverlappingBookings(
                        request.getResourceName(),
                        request.getBookingDate(),
                        request.getStartTime(),
                        request.getEndTime()));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResourceName(request.getResourceName());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.saveAndFlush(booking);
        return toBookingResponse(savedBooking.getId());
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

        Asset asset = assetRepository.findByName(booking.getResourceName())
                .orElseThrow(() -> new IllegalArgumentException("Selected resource was not found"));

        validateRequestedWindow(asset, booking.getStartTime(), booking.getEndTime());
        validateRemainingCapacity(
                asset,
                booking.getExpectedAttendees(),
                bookingRepository.findOverlappingBookingsExcludingId(
                        booking.getResourceName(),
                        booking.getBookingDate(),
                        booking.getStartTime(),
                        booking.getEndTime(),
                        booking.getId()));

        booking.setStatus(BookingStatus.APPROVED);
        booking.setReviewedBy(admin);
        booking.setReviewedAt(LocalDateTime.now());
        booking.setRejectionReason(null);

        Booking savedBooking = bookingRepository.saveAndFlush(booking);
        bookingNotificationService.sendApprovalEmail(savedBooking);
        return toBookingResponse(savedBooking.getId());
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

        Booking savedBooking = bookingRepository.saveAndFlush(booking);
        bookingNotificationService.sendRejectionEmail(savedBooking);
        return toBookingResponse(savedBooking.getId());
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

        Booking savedBooking = bookingRepository.saveAndFlush(booking);
        return toBookingResponse(savedBooking.getId());
    }

    @Override
    @Transactional
    public BookingResponse rescheduleBooking(Long bookingId, RescheduleBookingRequest request, Long userId) {
        User user = getUserOrThrow(userId);
        Booking booking = bookingRepository.findByIdAndUser(bookingId, user)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found or does not belong to you"));

        if (booking.getStatus() == BookingStatus.REJECTED || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Rejected or cancelled bookings cannot be rescheduled");
        }

        String resourceName = request.getResourceName() == null ? "" : request.getResourceName().trim();
        Asset asset = assetRepository.findByName(resourceName)
                .orElseThrow(() -> new IllegalArgumentException("Selected resource was not found"));

        if (asset.getStatus() != null && !"ACTIVE".equalsIgnoreCase(asset.getStatus())) {
            throw new IllegalStateException("Selected resource is not available for booking");
        }

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        if (asset.getCapacity() != null
                && request.getExpectedAttendees() != null
                && request.getExpectedAttendees() > asset.getCapacity()) {
            throw new IllegalArgumentException("Expected attendees exceed the resource capacity");
        }

        validateRequestedSlotHasNotStarted(request.getBookingDate(), request.getStartTime());
        validateRequestedWindow(asset, request.getStartTime(), request.getEndTime());
        validateRemainingCapacity(
                asset,
                request.getExpectedAttendees(),
                bookingRepository.findOverlappingBookingsExcludingId(
                        resourceName,
                        request.getBookingDate(),
                        request.getStartTime(),
                        request.getEndTime(),
                        booking.getId()));

        booking.setResourceName(resourceName);
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose().trim());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);
        booking.setReviewedBy(null);
        booking.setReviewedAt(null);
        booking.setRejectionReason(null);

        Booking savedBooking = bookingRepository.saveAndFlush(booking);
        return toBookingResponse(savedBooking.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public void resendBookingStatusEmail(Long bookingId, Long adminUserId) {
        User admin = getUserOrThrow(adminUserId);
        if (!isAdmin(admin)) {
            throw new IllegalArgumentException("Only admins can resend booking emails");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + bookingId));

        bookingNotificationService.resendStatusEmail(booking);
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

    private void validateRequestedWindow(Asset asset, LocalTime startTime, LocalTime endTime) {
        if (asset.getAvailabilityStart() == null || asset.getAvailabilityEnd() == null) {
            return;
        }

        if (startTime.isBefore(asset.getAvailabilityStart()) || endTime.isAfter(asset.getAvailabilityEnd())) {
            throw new IllegalArgumentException("Selected slot is outside the resource availability window");
        }
    }

    private void validateRequestedSlotHasNotStarted(LocalDate bookingDate, LocalTime startTime) {
        LocalDate today = LocalDate.now();
        if (bookingDate.isBefore(today)) {
            throw new IllegalArgumentException("Cannot book a slot in the past");
        }

        if (bookingDate.isEqual(today) && !startTime.isAfter(LocalTime.now())) {
            throw new IllegalArgumentException("Cannot book a slot that has already started or passed");
        }
    }

    private void validateRemainingCapacity(Asset asset, Integer requestedAttendees, List<Booking> overlaps) {
        if (asset.getCapacity() == null || requestedAttendees == null) {
            return;
        }

        int alreadyReserved = overlaps.stream()
                .mapToInt(booking -> booking.getExpectedAttendees() == null ? 0 : booking.getExpectedAttendees())
                .sum();

        if (requestedAttendees > asset.getCapacity() - alreadyReserved) {
            throw new IllegalStateException("Not enough capacity left in the selected slot");
        }
    }

    private BookingResponse toBookingResponse(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + bookingId));
        return BookingResponse.fromEntity(booking);
    }
}
