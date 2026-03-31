-- V9__create_tickets_table.sql
CREATE TABLE tickets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    reported_by BIGINT NOT NULL,
    asset_id BIGINT NOT NULL,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
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
    CONSTRAINT fk_ticket_user FOREIGN KEY (reported_by) REFERENCES users(id),
    CONSTRAINT fk_ticket_asset FOREIGN KEY (asset_id) REFERENCES assets(id),
    CONSTRAINT fk_ticket_assigned FOREIGN KEY (assigned_to) REFERENCES users(id)
);
