package com.smartcampus.modules.booking.entity;

import com.smartcampus.modules.auth.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity(name = "ResourceBooking")
@Table(name = "resource_bookings", indexes = {
        @Index(name = "idx_booking_user", columnList = "user_id"),
        @Index(name = "idx_booking_resource", columnList = "resource_name"),
        @Index(name = "idx_booking_date", columnList = "booking_date"),
        @Index(name = "idx_booking_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull
    private User user;

    @Column(name = "resource_name", nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String resourceName;

    @Column(name = "booking_date", nullable = false)
    @NotNull
    @FutureOrPresent
    private LocalDate bookingDate;

    @Column(name = "start_time", nullable = false)
    @NotNull
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    @NotNull
    private LocalTime endTime;

    @Column(name = "purpose", nullable = false, columnDefinition = "TEXT")
    @NotBlank
    @Size(max = 500)
    private String purpose;

    @Column(name = "expected_attendees", nullable = false)
    @NotNull
    @Min(1)
    private Integer expectedAttendees;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @NotNull
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    @Size(max = 500)
    private String rejectionReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
