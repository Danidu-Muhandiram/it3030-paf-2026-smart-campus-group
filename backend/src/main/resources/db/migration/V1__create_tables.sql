-- ROLES & USERS
CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255),

    provider VARCHAR(50) NOT NULL,
    provider_id VARCHAR(100),

    role_id BIGINT NOT NULL,

    status VARCHAR(50) DEFAULT 'ACTIVE',

    profile_picture VARCHAR(255),
    phone VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);


-- LOCATIONS
CREATE TABLE locations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    building_name VARCHAR(100),
    floor_no INT
);

-- ASSETS
CREATE TABLE assets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    
    capacity INT,
    location_id BIGINT,

    CONSTRAINT fk_asset_location FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
);


-- BOOKINGS
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

    CONSTRAINT fk_booking_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_user FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,

    CONSTRAINT chk_booking_time CHECK (start_time < end_time)
);

CREATE INDEX idx_bookings_asset_id ON bookings(asset_id);
CREATE INDEX idx_bookings_requested_by ON bookings(requested_by);
CREATE INDEX idx_bookings_status ON bookings(status);


-- TICKETS
CREATE TABLE tickets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    reported_by BIGINT NOT NULL,
    asset_id BIGINT NOT NULL,

    priority VARCHAR(50) DEFAULT 'MEDIUM',

    title VARCHAR(200) NOT NULL,
    description TEXT,
    contact VARCHAR(100),

    status VARCHAR(50) DEFAULT 'OPEN',

    assigned_to BIGINT,

    resolution_notes TEXT,
    rejection_reason TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    closed_at TIMESTAMP NULL,

    CONSTRAINT fk_ticket_user FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ticket_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    CONSTRAINT fk_ticket_assigned FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_asset_id ON tickets(asset_id);

-- TICKET ATTACHMENTS
CREATE TABLE ticket_attachments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ticket_id BIGINT NOT NULL,

    file_name VARCHAR(255),
    file_path VARCHAR(255),
    file_type VARCHAR(50),

    uploaded_by BIGINT,

    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_attachment_ticket
        FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,

    CONSTRAINT fk_attachment_user
        FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- TICKET COMMENTS
CREATE TABLE ticket_comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ticket_id BIGINT NOT NULL,
    commented_by BIGINT NOT NULL,

    comment TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_comment_ticket
        FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,

    CONSTRAINT fk_comment_user
        FOREIGN KEY (commented_by) REFERENCES users(id) ON DELETE CASCADE
);

-- NOTIFICATIONS
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,

    type VARCHAR(50),
    title VARCHAR(200),
    message TEXT,

    reference_type VARCHAR(50),
    reference_id BIGINT,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- AUDIT LOGS
CREATE TABLE audits (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,

    action_type VARCHAR(50),
    entity_type VARCHAR(50),
    entity_id BIGINT,

    old_value JSON,
    new_value JSON,
    
    ip_address VARCHAR(45),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
