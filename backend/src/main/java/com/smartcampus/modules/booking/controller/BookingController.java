package com.smartcampus.modules.booking.controller;

import com.smartcampus.modules.auth.entity.User;
import com.smartcampus.modules.auth.repository.UserRepository;
import com.smartcampus.modules.booking.dto.BookingResponse;
import com.smartcampus.modules.booking.dto.CancelBookingRequest;
import com.smartcampus.modules.booking.dto.CreateBookingRequest;
import com.smartcampus.modules.booking.dto.RejectBookingRequest;
import com.smartcampus.modules.booking.entity.BookingStatus;
import com.smartcampus.modules.booking.service.BookingService;
import com.smartcampus.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    public BookingController(BookingService bookingService, UserRepository userRepository) {
        this.bookingService = bookingService;
        this.userRepository = userRepository;
    }

    // ==================== USER ENDPOINTS ====================

    /**
     * Create a new booking request
     * POST /api/bookings
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            BookingResponse booking = bookingService.createBooking(request, user.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(booking, "Booking request created successfully"));
        } catch (IllegalArgumentException e) {
            log.error("Invalid booking request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalStateException e) {
            log.error("Booking conflict: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating booking", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create booking"));
        }
    }

    /**
     * Get all bookings for the authenticated user
     * GET /api/bookings/my-bookings
     */
    @GetMapping("/my-bookings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @RequestParam(required = false) BookingStatus status,
            Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            List<BookingResponse> bookings = bookingService.getMyBookings(user.getId());
            
            return ResponseEntity.ok(ApiResponse.success(bookings, 
                    "Bookings retrieved successfully"));
        } catch (Exception e) {
            log.error("Error fetching user bookings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch bookings"));
        }
    }
    
    /**
     * Get upcoming bookings for the authenticated user
     * GET /api/bookings/my-bookings/upcoming
     */
    @GetMapping("/my-bookings/upcoming")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getUpcomingBookings(
            Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            List<BookingResponse> bookings = bookingService.getMyUpcomingBookings(user.getId());
            
            return ResponseEntity.ok(ApiResponse.success(bookings, 
                    "Upcoming bookings retrieved successfully"));
        } catch (Exception e) {
            log.error("Error fetching upcoming bookings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch upcoming bookings"));
        }
    }
    
    /**
     * Get past bookings for the authenticated user
     * GET /api/bookings/my-bookings/past
     */
    @GetMapping("/my-bookings/past")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getPastBookings(
            Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            List<BookingResponse> bookings = bookingService.getMyPastBookings(user.getId());
            
            return ResponseEntity.ok(ApiResponse.success(bookings, 
                    "Past bookings retrieved successfully"));
        } catch (Exception e) {
            log.error("Error fetching past bookings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch past bookings"));
        }
    }
    
    /**
     * Get a specific booking by ID (user can only access their own bookings)
     * GET /api/bookings/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            BookingResponse booking = bookingService.getBookingById(id, user.getId());
            return ResponseEntity.ok(ApiResponse.success(booking, 
                    "Booking retrieved successfully"));
        } catch (IllegalArgumentException e) {
            log.error("Booking not found or unauthorized: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error fetching booking", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch booking"));
        }
    }
    
    /**
     * Cancel a booking (user can only cancel their own approved bookings)
     * POST /api/bookings/{id}/cancel
     */
    @PostMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id,
            @RequestBody(required = false) CancelBookingRequest request,
            Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            BookingResponse booking = bookingService.cancelBooking(id, request, user.getId());
            
            return ResponseEntity.ok(ApiResponse.success(booking, 
                    "Booking cancelled successfully"));
        } catch (IllegalArgumentException e) {
            log.error("Error cancelling booking: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalStateException e) {
            log.error("Invalid booking state for cancellation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error cancelling booking", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to cancel booking"));
        }
    }
    
    // ==================== ADMIN ENDPOINTS ====================
    
    /**
     * Get all bookings (admin only)
     * GET /api/bookings/admin/all
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) String resourceName,
            @RequestParam(required = false) String search) {
        try {
            List<BookingResponse> bookings;
            
            if (status != null) {
                bookings = bookingService.getBookingsByStatus(status);
            } else {
                bookings = bookingService.getAllBookings();
            }
            
            return ResponseEntity.ok(ApiResponse.success(bookings, 
                    "Bookings retrieved successfully"));
        } catch (Exception e) {
            log.error("Error fetching all bookings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch bookings"));
        }
    }
    
    /**
     * Get pending bookings (admin only)
     * GET /api/bookings/admin/pending
     */
    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getPendingBookings() {
        try {
            List<BookingResponse> bookings = bookingService.getBookingsByStatus(BookingStatus.PENDING);
            return ResponseEntity.ok(ApiResponse.success(bookings, 
                    "Pending bookings retrieved successfully"));
        } catch (Exception e) {
            log.error("Error fetching pending bookings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch pending bookings"));
        }
    }
    
    /**
     * Approve a booking (admin only)
     * POST /api/bookings/admin/{id}/approve
     */
    @PostMapping("/admin/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> approveBooking(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            User admin = getUserFromAuthentication(authentication);
            BookingResponse booking = bookingService.approveBooking(id, admin.getId());
            
            return ResponseEntity.ok(ApiResponse.success(booking, 
                    "Booking approved successfully"));
        } catch (IllegalArgumentException e) {
            log.error("Error approving booking: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalStateException e) {
            log.error("Invalid booking state for approval: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error approving booking", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to approve booking"));
        }
    }
    
    /**
     * Reject a booking (admin only)
     * POST /api/bookings/admin/{id}/reject
     */
    @PostMapping("/admin/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> rejectBooking(
            @PathVariable Long id,
            @Valid @RequestBody RejectBookingRequest request,
            Authentication authentication) {
        try {
            User admin = getUserFromAuthentication(authentication);
            BookingResponse booking = bookingService.rejectBooking(id, request, admin.getId());
            
            return ResponseEntity.ok(ApiResponse.success(booking, 
                    "Booking rejected successfully"));
        } catch (IllegalArgumentException e) {
            log.error("Error rejecting booking: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalStateException e) {
            log.error("Invalid booking state for rejection: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error rejecting booking", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to reject booking"));
        }
    }
    
    /**
     * Get booking statistics (admin only)
     * GET /api/bookings/admin/statistics
     */
    @GetMapping("/admin/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingService.BookingStatistics>> getStatistics() {
        try {
            BookingService.BookingStatistics stats = bookingService.getBookingStatistics();
            return ResponseEntity.ok(ApiResponse.success(stats, 
                    "Statistics retrieved successfully"));
        } catch (Exception e) {
            log.error("Error fetching statistics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch statistics"));
        }
    }
    
    /**
     * Get bookings for a specific resource on a specific date
     * GET /api/bookings/resource/{resourceName}/date/{date}
     */
    @GetMapping("/resource/{resourceName}/date/{date}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getResourceBookingsByDate(
            @PathVariable String resourceName,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<BookingResponse> bookings = bookingService.getBookingsByResourceAndDate(resourceName, date);
            return ResponseEntity.ok(ApiResponse.success(bookings, 
                    "Resource bookings retrieved successfully"));
        } catch (Exception e) {
            log.error("Error fetching resource bookings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch resource bookings"));
        }
    }
    
    // ==================== HELPER METHODS ====================
    
    /**
     * Get user from authentication
     */
    private User getUserFromAuthentication(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
    
    /**
     * Check if user has admin role
     */
    private boolean isAdmin(User user) {
        return user.getRole() != null && "ADMIN".equalsIgnoreCase(user.getRole().getName());
    }
}
