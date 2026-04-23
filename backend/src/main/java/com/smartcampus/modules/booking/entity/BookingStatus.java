package com.smartcampus.modules.booking.entity;

/**
 * Enum representing the status of a booking in the system.
 * Bookings follow the workflow: PENDING → APPROVED/REJECTED → CANCELLED
 */
public enum BookingStatus {
    /**
     * Initial status when a booking request is created
     */
    PENDING,
    
    /**
     * Status when admin approves the booking request
     */
    APPROVED,
    
    /**
     * Status when admin rejects the booking request
     */
    REJECTED,
    
    /**
     * Status when an approved booking is cancelled by the user
     */
    CANCELLED
}
