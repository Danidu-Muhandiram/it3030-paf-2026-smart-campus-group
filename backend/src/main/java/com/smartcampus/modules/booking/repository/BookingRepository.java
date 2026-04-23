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

@Repository("bookingModuleRepository")
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserOrderByCreatedAtDesc(User user);

    Optional<Booking> findByIdAndUser(Long id, User user);

    List<Booking> findAllByOrderByCreatedAtDesc();

    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);

    List<Booking> findByResourceNameAndBookingDateOrderByStartTimeAsc(String resourceName, LocalDate bookingDate);

    @Query("SELECT b FROM ResourceBooking b WHERE b.resourceName = :resourceName " +
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

    @Query("SELECT b FROM ResourceBooking b WHERE b.resourceName = :resourceName " +
            "AND b.bookingDate = :date " +
            "AND b.status IN ('PENDING', 'APPROVED') " +
            "AND b.id <> :excludeId " +
            "AND b.startTime < :endTime " +
            "AND b.endTime > :startTime")
    List<Booking> findOverlappingBookingsExcludingId(
            @Param("resourceName") String resourceName,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("excludeId") Long excludeId
    );
}
