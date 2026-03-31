-- V8__create_bookings_table.sql
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    asset_id BIGINT NOT NULL,
    requested_by BIGINT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    purpose TEXT,
    headcount INT,
    status VARCHAR(50) DEFAULT 'PENDING',
    reviewed_by BIGINT,
    review_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_asset FOREIGN KEY (asset_id) REFERENCES assets(id),
    CONSTRAINT fk_booking_user FOREIGN KEY (requested_by) REFERENCES users(id),
    CONSTRAINT fk_booking_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id)
);
