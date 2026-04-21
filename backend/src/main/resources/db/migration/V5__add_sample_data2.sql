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

-- NOTE: Asset / booking / ticket seed data is in V9 (requires resource_types from V7).
