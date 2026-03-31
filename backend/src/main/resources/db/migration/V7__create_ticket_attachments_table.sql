CREATE TABLE ticket_attachments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ticket_id BIGINT NOT NULL,
    file_name VARCHAR(255),
    file_path VARCHAR(255),
    file_type VARCHAR(50),
    uploaded_by BIGINT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_attachment_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    CONSTRAINT fk_attachment_user FOREIGN KEY (uploaded_by) REFERENCES users(id)
);
