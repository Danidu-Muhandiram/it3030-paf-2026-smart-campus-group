package com.smartcampus.modules.facilities.repository;

import com.smartcampus.modules.facilities.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * Returns all bookings for a given asset on a given date
     * that are APPROVED or PENDING (i.e. not cancelled / rejected).
     */
    @Query("""
            SELECT b FROM Booking b
            WHERE b.asset.id = :assetId
              AND b.bookingDate = :date
              AND b.status IN ('APPROVED', 'PENDING')
            ORDER BY b.startTime
            """)
    List<Booking> findActiveByAssetAndDate(@Param("assetId") Long assetId,
                                           @Param("date")    LocalDate date);
}
