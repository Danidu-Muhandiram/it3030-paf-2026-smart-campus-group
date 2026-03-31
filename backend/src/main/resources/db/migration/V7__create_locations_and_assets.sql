-- V7__create_locations_and_assets.sql
CREATE TABLE locations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    building_name VARCHAR(100),
    floor_no INT
);

CREATE TABLE assets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    capacity INT,
    location_id BIGINT,
    CONSTRAINT fk_asset_location FOREIGN KEY (location_id) REFERENCES locations(id)
);
