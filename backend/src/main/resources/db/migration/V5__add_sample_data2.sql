-- Seed realistic development data for FK validation.
-- Roles are intentionally limited to USER and TECHNICIAN.

-- ROLES (2 fixed roles)
INSERT IGNORE INTO roles (name)
VALUES
    ('USER'),
    ('TECHNICIAN');

-- USERS (9)
INSERT IGNORE INTO users (
    first_name,
    last_name,
    email,
    password,
    provider,
    provider_id,
    role_id,
    status,
    profile_picture,
    phone,
    university_id
)
VALUES
    ('Kavinda', 'Mendis', 'kavinda.mendis@smartcampus.com', '$2a$10$S8zLk3mPwX0jV7qR9nA1beC2fD4hJ6kL8mN0pQ2rS4tU6vW8xY0zA', 'LOCAL', NULL, (SELECT id FROM roles WHERE name = 'TECHNICIAN' LIMIT 1), 'ACTIVE', NULL, '0771001002', 'EMP2026002'),
    ('Nadeesha', 'Peries', 'nadeesha.peries@smartcampus.com', '$2a$10$B7yNf1dGh3Jk5Lm7Pq9RsTuVwXyZaBcDeFgHiJkLmNoPqRsTuVwXy', 'LOCAL', NULL, (SELECT id FROM roles WHERE name = 'TECHNICIAN' LIMIT 1), 'ACTIVE', NULL, '0771001003', 'EMP2026003'),
    ('Ruwan', 'Fernando', 'ruwan.fernando@smartcampus.com', '$2a$10$M4nBv6Cx8Zq1Wr3Et5Yu7Io9PaSdFgHjKlMnOpQrStUvWxYzA1bC2', 'LOCAL', NULL, (SELECT id FROM roles WHERE name = 'TECHNICIAN' LIMIT 1), 'ACTIVE', NULL, '0771001004', 'EMP2026004'),
    ('Isuri', 'Jayawardena', 'isuri.jayawardena@smartcampus.com', '$2a$10$D3fGh5Jk7Lm9Np1Qr3St5Uv7Wx9YzAbCdEfGhIjKlMnOpQrStUvWx', 'LOCAL', NULL, (SELECT id FROM roles WHERE name = 'USER' LIMIT 1), 'ACTIVE', NULL, '0771001005', 'ST2026001'),
    ('Chamod', 'Perera', 'chamod.perera@smartcampus.com', '$2a$10$E1rTy3Ui5Op7As9Df1Gh3Jk5Lm7Np9Qr1St3Uv5Wx7Yz9Ab1Cd3Ef', 'LOCAL', NULL, (SELECT id FROM roles WHERE name = 'USER' LIMIT 1), 'ACTIVE', NULL, '0771001006', 'ST2026002'),
    ('Shehani', 'Wickramasinghe', 'shehani.wickramasinghe@smartcampus.com', '$2a$10$G5hJk7Lm9Np1Qr3St5Uv7Wx9YzAbCdEfGhIjKlMnOpQrStUvWxYzA', 'LOCAL', NULL, (SELECT id FROM roles WHERE name = 'USER' LIMIT 1), 'ACTIVE', NULL, '0771001007', 'ST2026003'),
    ('Dilan', 'Gunasekara', 'dilan.gunasekara@smartcampus.com', '$2a$10$H9jKl1Mn3Op5Qr7St9Uv1Wx3Yz5Ab7Cd9Ef1Gh3Jk5Lm7Np9Qr1St', 'LOCAL', NULL, (SELECT id FROM roles WHERE name = 'USER' LIMIT 1), 'ACTIVE', NULL, '0771001008', 'ST2026004'),
    ('Malith', 'Senaratne', 'malith.senaratne@smartcampus.com', '$2a$10$J2kLm4No6Pq8Rs0Tu2Vw4Xy6Za8Bc0De2Fg4Hi6Jk8Lm0No2Pq4Rs', 'LOCAL', NULL, (SELECT id FROM roles WHERE name = 'USER' LIMIT 1), 'ACTIVE', NULL, '0771001009', 'ST2026005'),
    ('Pavithra', 'Abeywickrama', 'pavithra.abeywickrama@smartcampus.com', '$2a$10$K6lMn8Op0Qr2St4Uv6Wx8Yz0Ab2Cd4Ef6Gh8Ij0Kl2Mn4Op6Qr8St', 'LOCAL', NULL, (SELECT id FROM roles WHERE name = 'USER' LIMIT 1), 'ACTIVE', NULL, '0771001010', 'ST2026006');

-- LOCATIONS (10)
INSERT INTO locations (name, building_name, floor_no)
VALUES
    ('A102 SMART CLASSROOM', 'Block A', 1),
    ('A305 DESIGN STUDIO', 'Block A', 3),
    ('B401 COMPUTER LAB', 'Block B', 4),
    ('B702 NETWORK LAB', 'Block B', 7),
    ('C203 ELECTRONICS LAB', 'Block C', 2),
    ('C110 SEMINAR ROOM', 'Block C', 1),
    ('D512 MEETING ROOM', 'Block D', 5),
    ('E904 AI INNOVATION HUB', 'Block E', 9),
    ('F1102 LIBRARY DISCUSSION ROOM', 'Block F', 11),
    ('G1203 ROOFTOP EVENT SPACE', 'Block G', 12);

-- ASSETS (10)
INSERT INTO assets (name, type, status, capacity, location_id)
VALUES
    ('A102 SMART CLASSROOM', 'smart classroom', 'ACTIVE', 80, (SELECT id FROM locations WHERE name = 'A102 SMART CLASSROOM' LIMIT 1)),
    ('A305 DESIGN STUDIO', 'design studio', 'ACTIVE', 45, (SELECT id FROM locations WHERE name = 'A305 DESIGN STUDIO' LIMIT 1)),
    ('B401 COMPUTER LAB', 'computer lab', 'ACTIVE', 60, (SELECT id FROM locations WHERE name = 'B401 COMPUTER LAB' LIMIT 1)),
    ('B702 NETWORK LAB', 'network lab', 'ACTIVE', 40, (SELECT id FROM locations WHERE name = 'B702 NETWORK LAB' LIMIT 1)),
    ('C203 ELECTRONICS LAB', 'electronics lab', 'MAINTENANCE', 36, (SELECT id FROM locations WHERE name = 'C203 ELECTRONICS LAB' LIMIT 1)),
    ('C110 SEMINAR ROOM', 'seminar room', 'ACTIVE', 55, (SELECT id FROM locations WHERE name = 'C110 SEMINAR ROOM' LIMIT 1)),
    ('D512 4K LASER PROJECTOR', 'projector', 'ACTIVE', 1, (SELECT id FROM locations WHERE name = 'D512 MEETING ROOM' LIMIT 1)),
    ('E904 AI INNOVATION HUB', 'innovation hub', 'ACTIVE', 70, (SELECT id FROM locations WHERE name = 'E904 AI INNOVATION HUB' LIMIT 1)),
    ('F1102 INTERACTIVE PROJECTOR', 'projector', 'ACTIVE', 1, (SELECT id FROM locations WHERE name = 'F1102 LIBRARY DISCUSSION ROOM' LIMIT 1)),
    ('G1203 LINE ARRAY SOUND SYSTEM', 'sound system', 'INACTIVE', 1, (SELECT id FROM locations WHERE name = 'G1203 ROOFTOP EVENT SPACE' LIMIT 1));

-- BOOKINGS (10)
INSERT INTO bookings (
    asset_id,
    requested_by,
    booking_date,
    start_time,
    end_time,
    purpose,
    headcount,
    status,
    reviewed_by,
    review_reason
)
VALUES
    ((SELECT id FROM assets WHERE name = 'B401 COMPUTER LAB' LIMIT 1), (SELECT id FROM users WHERE email = 'isuri.jayawardena@smartcampus.com' LIMIT 1), '2026-04-21', '09:00:00', '11:00:00', 'Programming Fundamentals Lab Session', 52, 'APPROVED', (SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'Room and capacity confirmed'),
    ((SELECT id FROM assets WHERE name = 'A102 SMART CLASSROOM' LIMIT 1), (SELECT id FROM users WHERE email = 'chamod.perera@smartcampus.com' LIMIT 1), '2026-04-22', '10:00:00', '12:00:00', 'Data Structures Revision Workshop', 68, 'PENDING', NULL, NULL),
    ((SELECT id FROM assets WHERE name = 'A305 DESIGN STUDIO' LIMIT 1), (SELECT id FROM users WHERE email = 'shehani.wickramasinghe@smartcampus.com' LIMIT 1), '2026-04-23', '13:00:00', '15:00:00', 'UI UX Prototyping Lab', 32, 'APPROVED', (SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'No schedule conflicts'),
    ((SELECT id FROM assets WHERE name = 'C203 ELECTRONICS LAB' LIMIT 1), (SELECT id FROM users WHERE email = 'dilan.gunasekara@smartcampus.com' LIMIT 1), '2026-04-24', '08:30:00', '10:00:00', 'Embedded Systems Circuit Practical', 28, 'REJECTED', (SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'Lab currently under maintenance'),
    ((SELECT id FROM assets WHERE name = 'C110 SEMINAR ROOM' LIMIT 1), (SELECT id FROM users WHERE email = 'malith.senaratne@smartcampus.com' LIMIT 1), '2026-04-25', '14:00:00', '16:00:00', 'Final Year Project Proposal Presentation', 48, 'APPROVED', (SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'Approved by academic office'),
    ((SELECT id FROM assets WHERE name = 'D512 4K LASER PROJECTOR' LIMIT 1), (SELECT id FROM users WHERE email = 'pavithra.abeywickrama@smartcampus.com' LIMIT 1), '2026-04-26', '09:30:00', '11:00:00', 'Projector reservation for quality assurance review', 1, 'APPROVED', (SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'Projector slot confirmed'),
    ((SELECT id FROM assets WHERE name = 'E904 AI INNOVATION HUB' LIMIT 1), (SELECT id FROM users WHERE email = 'isuri.jayawardena@smartcampus.com' LIMIT 1), '2026-04-27', '11:00:00', '13:00:00', 'Machine Learning Club Hack Session', 58, 'PENDING', NULL, NULL),
    ((SELECT id FROM assets WHERE name = 'F1102 INTERACTIVE PROJECTOR' LIMIT 1), (SELECT id FROM users WHERE email = 'chamod.perera@smartcampus.com' LIMIT 1), '2026-04-28', '15:00:00', '17:00:00', 'Interactive projector reservation for research demo', 1, 'APPROVED', (SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'Equipment checkout approved'),
    ((SELECT id FROM assets WHERE name = 'B702 NETWORK LAB' LIMIT 1), (SELECT id FROM users WHERE email = 'shehani.wickramasinghe@smartcampus.com' LIMIT 1), '2026-04-29', '07:30:00', '09:30:00', 'Computer Networks Router Configuration Lab', 34, 'APPROVED', (SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'Technician support available'),
    ((SELECT id FROM assets WHERE name = 'G1203 LINE ARRAY SOUND SYSTEM' LIMIT 1), (SELECT id FROM users WHERE email = 'dilan.gunasekara@smartcampus.com' LIMIT 1), '2026-04-30', '16:00:00', '18:00:00', 'Sound system reservation for open air rehearsal', 1, 'REJECTED', (SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'Equipment is currently inactive');

-- TICKETS (10)
INSERT INTO tickets (
    reported_by,
    asset_id,
    priority,
    title,
    description,
    contact,
    status,
    assigned_to,
    resolution_notes,
    rejection_reason,
    resolved_at,
    closed_at
)
VALUES
    ((SELECT id FROM users WHERE email = 'isuri.jayawardena@smartcampus.com' LIMIT 1), (SELECT id FROM assets WHERE name = 'B401 COMPUTER LAB' LIMIT 1), 'HIGH', 'Projector Power Failure in B401', 'Ceiling projector does not turn on during lectures.', 'ticket001@smartcampus.com', 'OPEN', (SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), NULL, NULL, NULL, NULL),
    ((SELECT id FROM users WHERE email = 'chamod.perera@smartcampus.com' LIMIT 1), (SELECT id FROM assets WHERE name = 'A102 SMART CLASSROOM' LIMIT 1), 'MEDIUM', 'Air Conditioning Not Cooling in A102', 'Room temperature remains high even after one hour.', 'ticket002@smartcampus.com', 'IN_PROGRESS', (SELECT id FROM users WHERE email = 'nadeesha.peries@smartcampus.com' LIMIT 1), NULL, NULL, NULL, NULL),
    ((SELECT id FROM users WHERE email = 'shehani.wickramasinghe@smartcampus.com' LIMIT 1), (SELECT id FROM assets WHERE name = 'A305 DESIGN STUDIO' LIMIT 1), 'LOW', 'Drawing Tablets Need Driver Update', 'Several tablets disconnect randomly after login.', 'ticket003@smartcampus.com', 'RESOLVED', (SELECT id FROM users WHERE email = 'ruwan.fernando@smartcampus.com' LIMIT 1), 'Updated drivers and restarted all devices.', NULL, '2026-04-18 11:20:00', NULL),
    ((SELECT id FROM users WHERE email = 'dilan.gunasekara@smartcampus.com' LIMIT 1), (SELECT id FROM assets WHERE name = 'C203 ELECTRONICS LAB' LIMIT 1), 'HIGH', 'Soldering Station Fuse Tripping', 'Main soldering station trips power when heating starts.', 'ticket004@smartcampus.com', 'OPEN', (SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), NULL, NULL, NULL, NULL),
    ((SELECT id FROM users WHERE email = 'malith.senaratne@smartcampus.com' LIMIT 1), (SELECT id FROM assets WHERE name = 'C110 SEMINAR ROOM' LIMIT 1), 'MEDIUM', 'Wireless Microphone Interference', 'Audio cuts out every few minutes during presentations.', 'ticket005@smartcampus.com', 'CLOSED', (SELECT id FROM users WHERE email = 'nadeesha.peries@smartcampus.com' LIMIT 1), 'Frequency channel adjusted and tested.', NULL, '2026-04-17 10:10:00', '2026-04-17 16:45:00'),
    ((SELECT id FROM users WHERE email = 'pavithra.abeywickrama@smartcampus.com' LIMIT 1), (SELECT id FROM assets WHERE name = 'D512 4K LASER PROJECTOR' LIMIT 1), 'LOW', 'D512 Projector Focus Drift', 'Projected image loses focus after 15 minutes of use.', 'ticket006@smartcampus.com', 'OPEN', (SELECT id FROM users WHERE email = 'ruwan.fernando@smartcampus.com' LIMIT 1), NULL, NULL, NULL, NULL),
    ((SELECT id FROM users WHERE email = 'isuri.jayawardena@smartcampus.com' LIMIT 1), (SELECT id FROM assets WHERE name = 'E904 AI INNOVATION HUB' LIMIT 1), 'HIGH', 'GPU Workstation Overheating Alerts', 'Training machine shuts down under sustained load.', 'ticket007@smartcampus.com', 'IN_PROGRESS', (SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), NULL, NULL, NULL, NULL),
    ((SELECT id FROM users WHERE email = 'chamod.perera@smartcampus.com' LIMIT 1), (SELECT id FROM assets WHERE name = 'F1102 INTERACTIVE PROJECTOR' LIMIT 1), 'MEDIUM', 'F1102 Projector Remote Pairing Failure', 'The projector remote does not pair even after reset.', 'ticket008@smartcampus.com', 'OPEN', (SELECT id FROM users WHERE email = 'nadeesha.peries@smartcampus.com' LIMIT 1), NULL, NULL, NULL, NULL),
    ((SELECT id FROM users WHERE email = 'shehani.wickramasinghe@smartcampus.com' LIMIT 1), (SELECT id FROM assets WHERE name = 'B702 NETWORK LAB' LIMIT 1), 'LOW', 'Patch Panel Labels Missing', 'Multiple patch panel ports are unlabeled after rewiring.', 'ticket009@smartcampus.com', 'REJECTED', (SELECT id FROM users WHERE email = 'ruwan.fernando@smartcampus.com' LIMIT 1), NULL, 'Request lacks exact rack and port details.', NULL, NULL),
    ((SELECT id FROM users WHERE email = 'dilan.gunasekara@smartcampus.com' LIMIT 1), (SELECT id FROM assets WHERE name = 'G1203 LINE ARRAY SOUND SYSTEM' LIMIT 1), 'HIGH', 'G1203 Mixer Console Not Powering On', 'Main mixer remains offline and no output reaches speakers.', 'ticket010@smartcampus.com', 'OPEN', (SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), NULL, NULL, NULL, NULL);

-- TICKET ATTACHMENTS (10)
INSERT INTO ticket_attachments (
    ticket_id,
    file_name,
    file_path,
    file_type,
    uploaded_by
)
VALUES
    ((SELECT id FROM tickets WHERE title = 'Projector Power Failure in B401' LIMIT 1), 'b401_projector_photo.jpg', '/uploads/tickets/b401_projector_photo.jpg', 'image/jpeg', (SELECT id FROM users WHERE email = 'isuri.jayawardena@smartcampus.com' LIMIT 1)),
    ((SELECT id FROM tickets WHERE title = 'Air Conditioning Not Cooling in A102' LIMIT 1), 'a102_ac_reading.png', '/uploads/tickets/a102_ac_reading.png', 'image/png', (SELECT id FROM users WHERE email = 'chamod.perera@smartcampus.com' LIMIT 1)),
    ((SELECT id FROM tickets WHERE title = 'Drawing Tablets Need Driver Update' LIMIT 1), 'a305_tablet_log.txt', '/uploads/tickets/a305_tablet_log.txt', 'text/plain', (SELECT id FROM users WHERE email = 'ruwan.fernando@smartcampus.com' LIMIT 1)),
    ((SELECT id FROM tickets WHERE title = 'Soldering Station Fuse Tripping' LIMIT 1), 'c203_power_panel.jpg', '/uploads/tickets/c203_power_panel.jpg', 'image/jpeg', (SELECT id FROM users WHERE email = 'dilan.gunasekara@smartcampus.com' LIMIT 1)),
    ((SELECT id FROM tickets WHERE title = 'Wireless Microphone Interference' LIMIT 1), 'c110_audio_test.mp3', '/uploads/tickets/c110_audio_test.mp3', 'audio/mpeg', (SELECT id FROM users WHERE email = 'nadeesha.peries@smartcampus.com' LIMIT 1)),
    ((SELECT id FROM tickets WHERE title = 'D512 Projector Focus Drift' LIMIT 1), 'd512_projector_focus.jpg', '/uploads/tickets/d512_projector_focus.jpg', 'image/jpeg', (SELECT id FROM users WHERE email = 'pavithra.abeywickrama@smartcampus.com' LIMIT 1)),
    ((SELECT id FROM tickets WHERE title = 'GPU Workstation Overheating Alerts' LIMIT 1), 'e904_thermal_report.pdf', '/uploads/tickets/e904_thermal_report.pdf', 'application/pdf', (SELECT id FROM users WHERE email = 'isuri.jayawardena@smartcampus.com' LIMIT 1)),
    ((SELECT id FROM tickets WHERE title = 'F1102 Projector Remote Pairing Failure' LIMIT 1), 'f1102_projector_remote.mp4', '/uploads/tickets/f1102_projector_remote.mp4', 'video/mp4', (SELECT id FROM users WHERE email = 'chamod.perera@smartcampus.com' LIMIT 1)),
    ((SELECT id FROM tickets WHERE title = 'Patch Panel Labels Missing' LIMIT 1), 'b702_rack_ports.xlsx', '/uploads/tickets/b702_rack_ports.xlsx', 'application/xlsx', (SELECT id FROM users WHERE email = 'shehani.wickramasinghe@smartcampus.com' LIMIT 1)),
    ((SELECT id FROM tickets WHERE title = 'G1203 Mixer Console Not Powering On' LIMIT 1), 'g1203_mixer_log.txt', '/uploads/tickets/g1203_mixer_log.txt', 'text/plain', (SELECT id FROM users WHERE email = 'dilan.gunasekara@smartcampus.com' LIMIT 1));

-- TICKET COMMENTS (10)
INSERT INTO ticket_comments (
    ticket_id,
    commented_by,
    comment
)
VALUES
    ((SELECT id FROM tickets WHERE title = 'Projector Power Failure in B401' LIMIT 1), (SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'Technician visit scheduled for 10:30 AM tomorrow.'),
    ((SELECT id FROM tickets WHERE title = 'Air Conditioning Not Cooling in A102' LIMIT 1), (SELECT id FROM users WHERE email = 'nadeesha.peries@smartcampus.com' LIMIT 1), 'Filter cleaning completed, monitoring temperature now.'),
    ((SELECT id FROM tickets WHERE title = 'Drawing Tablets Need Driver Update' LIMIT 1), (SELECT id FROM users WHERE email = 'ruwan.fernando@smartcampus.com' LIMIT 1), 'Driver package 24.4 installed on all tablet units.'),
    ((SELECT id FROM tickets WHERE title = 'Soldering Station Fuse Tripping' LIMIT 1), (SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'Please keep the station offline until electrical check is done.'),
    ((SELECT id FROM tickets WHERE title = 'Wireless Microphone Interference' LIMIT 1), (SELECT id FROM users WHERE email = 'malith.senaratne@smartcampus.com' LIMIT 1), 'Audio is stable now. Confirming closure from our side.'),
    ((SELECT id FROM tickets WHERE title = 'D512 Projector Focus Drift' LIMIT 1), (SELECT id FROM users WHERE email = 'ruwan.fernando@smartcampus.com' LIMIT 1), 'Lens ring was cleaned and focus lock recalibrated.'),
    ((SELECT id FROM tickets WHERE title = 'GPU Workstation Overheating Alerts' LIMIT 1), (SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'Reapplying thermal paste and cleaning intake filters.'),
    ((SELECT id FROM tickets WHERE title = 'F1102 Projector Remote Pairing Failure' LIMIT 1), (SELECT id FROM users WHERE email = 'nadeesha.peries@smartcampus.com' LIMIT 1), 'Remote firmware synced; verify pairing during next session.'),
    ((SELECT id FROM tickets WHERE title = 'Patch Panel Labels Missing' LIMIT 1), (SELECT id FROM users WHERE email = 'ruwan.fernando@smartcampus.com' LIMIT 1), 'Need exact rack number to proceed with relabeling.'),
    ((SELECT id FROM tickets WHERE title = 'G1203 Mixer Console Not Powering On' LIMIT 1), (SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'Temporary mixer unit will be installed before rehearsal.');

-- NOTIFICATIONS (10)
INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    reference_type,
    reference_id,
    is_read
)
VALUES
    ((SELECT id FROM users WHERE email = 'isuri.jayawardena@smartcampus.com' LIMIT 1), 'BOOKING', 'Booking Approved', 'Your booking for B401 COMPUTER LAB has been approved.', 'BOOKING', (SELECT id FROM bookings WHERE purpose = 'Programming Fundamentals Lab Session' LIMIT 1), FALSE),
    ((SELECT id FROM users WHERE email = 'chamod.perera@smartcampus.com' LIMIT 1), 'BOOKING', 'Booking Pending Review', 'Your request for A102 SMART CLASSROOM is waiting for approval.', 'BOOKING', (SELECT id FROM bookings WHERE purpose = 'Data Structures Revision Workshop' LIMIT 1), FALSE),
    ((SELECT id FROM users WHERE email = 'shehani.wickramasinghe@smartcampus.com' LIMIT 1), 'BOOKING', 'Booking Approved', 'A305 DESIGN STUDIO is reserved for your workshop.', 'BOOKING', (SELECT id FROM bookings WHERE purpose = 'UI UX Prototyping Lab' LIMIT 1), TRUE),
    ((SELECT id FROM users WHERE email = 'dilan.gunasekara@smartcampus.com' LIMIT 1), 'BOOKING', 'Booking Rejected', 'C203 ELECTRONICS LAB is under maintenance.', 'BOOKING', (SELECT id FROM bookings WHERE purpose = 'Embedded Systems Circuit Practical' LIMIT 1), FALSE),
    ((SELECT id FROM users WHERE email = 'isuri.jayawardena@smartcampus.com' LIMIT 1), 'TICKET', 'Ticket Assigned', 'Your projector issue has been assigned to a technician.', 'TICKET', (SELECT id FROM tickets WHERE title = 'Projector Power Failure in B401' LIMIT 1), FALSE),
    ((SELECT id FROM users WHERE email = 'chamod.perera@smartcampus.com' LIMIT 1), 'TICKET', 'Ticket In Progress', 'AC maintenance is in progress in A102.', 'TICKET', (SELECT id FROM tickets WHERE title = 'Air Conditioning Not Cooling in A102' LIMIT 1), FALSE),
    ((SELECT id FROM users WHERE email = 'shehani.wickramasinghe@smartcampus.com' LIMIT 1), 'TICKET', 'Ticket Resolved', 'Tablet driver issue in A305 has been resolved.', 'TICKET', (SELECT id FROM tickets WHERE title = 'Drawing Tablets Need Driver Update' LIMIT 1), TRUE),
    ((SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'ASSIGNMENT', 'New Work Order', 'You have been assigned a high priority projector ticket.', 'TICKET', (SELECT id FROM tickets WHERE title = 'Projector Power Failure in B401' LIMIT 1), FALSE),
    ((SELECT id FROM users WHERE email = 'nadeesha.peries@smartcampus.com' LIMIT 1), 'ASSIGNMENT', 'New Work Order', 'You have been assigned the A102 cooling issue.', 'TICKET', (SELECT id FROM tickets WHERE title = 'Air Conditioning Not Cooling in A102' LIMIT 1), FALSE),
    ((SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'SYSTEM', 'Operations Snapshot', 'Development seed includes 9 users, 10 bookings, and 10 tickets.', 'SYSTEM', NULL, TRUE);

-- AUDITS (10)
INSERT INTO audits (
    user_id,
    action_type,
    entity_type,
    entity_id,
    old_value,
    new_value,
    ip_address
)
VALUES
    ((SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'CREATE', 'USER', (SELECT id FROM users WHERE email = 'isuri.jayawardena@smartcampus.com' LIMIT 1), NULL, '{"email":"isuri.jayawardena@smartcampus.com","role":"USER","status":"ACTIVE"}', '127.0.0.1'),
    ((SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'CREATE', 'USER', (SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), NULL, '{"email":"kavinda.mendis@smartcampus.com","role":"TECHNICIAN","status":"ACTIVE"}', '127.0.0.1'),
    ((SELECT id FROM users WHERE email = 'isuri.jayawardena@smartcampus.com' LIMIT 1), 'CREATE', 'BOOKING', (SELECT id FROM bookings WHERE purpose = 'Programming Fundamentals Lab Session' LIMIT 1), NULL, '{"asset":"B401 COMPUTER LAB","status":"APPROVED"}', '127.0.0.1'),
    ((SELECT id FROM users WHERE email = 'chamod.perera@smartcampus.com' LIMIT 1), 'CREATE', 'BOOKING', (SELECT id FROM bookings WHERE purpose = 'Data Structures Revision Workshop' LIMIT 1), NULL, '{"asset":"A102 SMART CLASSROOM","status":"PENDING"}', '127.0.0.1'),
    ((SELECT id FROM users WHERE email = 'shehani.wickramasinghe@smartcampus.com' LIMIT 1), 'CREATE', 'TICKET', (SELECT id FROM tickets WHERE title = 'Drawing Tablets Need Driver Update' LIMIT 1), NULL, '{"priority":"LOW","status":"RESOLVED"}', '127.0.0.1'),
    ((SELECT id FROM users WHERE email = 'dilan.gunasekara@smartcampus.com' LIMIT 1), 'CREATE', 'TICKET', (SELECT id FROM tickets WHERE title = 'Soldering Station Fuse Tripping' LIMIT 1), NULL, '{"priority":"HIGH","status":"OPEN"}', '127.0.0.1'),
    ((SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'UPDATE', 'TICKET', (SELECT id FROM tickets WHERE title = 'Projector Power Failure in B401' LIMIT 1), '{"status":"OPEN"}', '{"status":"IN_PROGRESS"}', '127.0.0.1'),
    ((SELECT id FROM users WHERE email = 'ruwan.fernando@smartcampus.com' LIMIT 1), 'UPDATE', 'TICKET', (SELECT id FROM tickets WHERE title = 'Drawing Tablets Need Driver Update' LIMIT 1), '{"status":"IN_PROGRESS"}', '{"status":"RESOLVED"}', '127.0.0.1'),
    ((SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'UPDATE', 'BOOKING', (SELECT id FROM bookings WHERE purpose = 'Embedded Systems Circuit Practical' LIMIT 1), '{"status":"PENDING"}', '{"status":"REJECTED"}', '127.0.0.1'),
    ((SELECT id FROM users WHERE email = 'kavinda.mendis@smartcampus.com' LIMIT 1), 'READ', 'DASHBOARD', NULL, NULL, '{"scope":"TECHNICIAN_DASHBOARD"}', '127.0.0.1');
