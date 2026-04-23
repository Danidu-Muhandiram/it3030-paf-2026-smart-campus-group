package com.smartcampus.modules.booking.repository;

import com.smartcampus.modules.auth.entity.User;
import com.smartcampus.modules.booking.entity.Booking;
import com.smartcampus.modules.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // User bookings queries
    List<Booking> findByUserOrderByBookingDateDescStartTimeDesc(User user);

    List<Booking> findByUserAndStatusOrderByBookingDateDescStartTimeDesc(User user, BookingStatus status);
    
    Optional<Booking> findByIdAndUser(Long id, User user);

    // Admin queries
    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);

    List<Booking> findAllByOrderByCreatedAtDesc();

    // Resource queries
    List<Booking> findByResourceNameOrderByBookingDateDescStartTimeDesc(String resourceName);

    List<Booking> findByResourceNameAndBookingDateOrderByStartTimeAsc(String resourceName, LocalDate bookingDate);

    // Conflict detection queries
    @Query("SELECT b FROM Booking b WHERE b.resourceName = :resourceName " +
           "AND b.bookingDate = :date " +
           "AND b.status IN ('PENDING', 'APPROVED') " +
           "AND b.startTime < :endTime " +
           "AND b.endTime > :startTime")
    List<Booking> findOverlappingBookings(
            @Param("resourceName") String resourceName,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );
    
    @Query("SELECT b FROM Booking b WHERE b.resourceName = :resourceName " +
           "AND b.bookingDate = :date " +
           "AND b.status = 'APPROVED' " +
           "AND b.id != :excludeId " +
           "AND b.startTime < :endTime " +
           "AND b.endTime > :startTime")
    List<Booking> findOverlappingBookingsExcludingId(
            @Param("resourceName") String resourceName,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("excludeId") Long excludeId
    );

    // Statistics queries
    Long countByStatus(BookingStatus status);

    Long countByUserAndStatus(User user, BookingStatus status);

    // Time-based queries
    @Query("SELECT b FROM Booking b WHERE b.user = :user " +
           "AND b.bookingDate >= :currentDate " +
           "ORDER BY b.bookingDate ASC, b.startTime ASC")
    List<Booking> findUpcomingBookingsByUser(
            @Param("user") User user,
            @Param("currentDate") LocalDate currentDate
    );

    @Query("SELECT b FROM Booking b WHERE b.user = :user " +
           "AND b.bookingDate < :currentDate " +
           "ORDER BY b.bookingDate DESC, b.startTime DESC")
    List<Booking> findPastBookingsByUser(
            @Param("user") User user,
            @Param("currentDate") LocalDate currentDate
    );
    
    // Search queries
    @Query("SELECT b FROM Booking b WHERE " +
           "LOWER(b.resourceName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(b.purpose) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(b.user.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "ORDER BY b.createdAt DESC")
    List<Booking> searchBookings(@Param("searchTerm") String searchTerm);
}
