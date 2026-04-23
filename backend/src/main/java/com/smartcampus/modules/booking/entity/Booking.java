package com.smartcampus.modules.booking.entity;

import com.smartcampus.modules.auth.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bookings", indexes = {
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
    @NotNull(message = "User is required")
    private User user;
    
    @Column(name = "resource_name", nullable = false, length = 100)
    @NotBlank(message = "Resource name is required")
    @Size(max = 100, message = "Resource name must not exceed 100 characters")
    private String resourceName;
   
    @Column(name = "booking_date", nullable = false)
    @NotNull(message = "Booking date is required")
    @Future(message = "Booking date must be in the future")
    private LocalDate bookingDate;
    
    @Column(name = "start_time", nullable = false)
    @NotNull(message = "Start time is required")
    private LocalTime startTime;
    
    @Column(name = "end_time", nullable = false)
    @NotNull(message = "End time is required")
    private LocalTime endTime;
    
    @Column(name = "purpose", nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "Purpose is required")
    @Size(max = 500, message = "Purpose must not exceed 500 characters")
    private String purpose;
    
    @Column(name = "expected_attendees", nullable = false)
    @NotNull(message = "Expected attendees is required")
    @Min(value = 1, message = "At least 1 attendee is required")
    private Integer expectedAttendees;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @NotNull(message = "Status is required")
    private BookingStatus status = BookingStatus.PENDING;
    
    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    @Size(max = 500, message = "Rejection reason must not exceed 500 characters")
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
    
    @AssertTrue(message = "End time must be after start time")
    public boolean isValidTimeRange() {
        if (startTime == null || endTime == null) {
            return true; // Let @NotNull handle null validation
        }
        return endTime.isAfter(startTime);
    }
    
    public boolean overlapsWith(Booking other) {
        if (!this.bookingDate.equals(other.bookingDate)) {
            return false;
        }
        if (!this.resourceName.equals(other.resourceName)) {
            return false;
        }
        
        // Check if time ranges overlap
        return this.startTime.isBefore(other.endTime) && this.endTime.isAfter(other.startTime);
    }
    
    public void approve(User admin) {
        this.status = BookingStatus.APPROVED;
        this.reviewedBy = admin;
        this.reviewedAt = LocalDateTime.now();
        this.rejectionReason = null;
    }
    
    public void reject(User admin, String reason) {
        this.status = BookingStatus.REJECTED;
        this.reviewedBy = admin;
        this.reviewedAt = LocalDateTime.now();
        this.rejectionReason = reason;
    }
    
    public void cancel() {
        if (this.status != BookingStatus.APPROVED) {
            throw new IllegalStateException("Only approved bookings can be cancelled");
        }
        this.status = BookingStatus.CANCELLED;
    }
    
    public boolean isCancellable() {
        return this.status == BookingStatus.APPROVED;
    }
    
    public boolean isPending() {
        return this.status == BookingStatus.PENDING;
    }
}
