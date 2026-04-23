-- Recreate bookings table with correct schema matching the Booking entity

-- Drop the existing bookings table (this will also drop foreign keys)
DROP TABLE IF EXISTS bookings;

-- Create the new bookings table with the correct schema
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    resource_name VARCHAR(100) NOT NULL,
    
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    purpose TEXT NOT NULL,
    expected_attendees INT NOT NULL,
    
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    
    rejection_reason TEXT,
    reviewed_by BIGINT,
    reviewed_at TIMESTAMP NULL,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_booking_time CHECK (start_time < end_time),
    
    INDEX idx_booking_user (user_id),
    INDEX idx_booking_resource (resource_name),
    INDEX idx_booking_date (booking_date),
    INDEX idx_booking_status (status)
);
