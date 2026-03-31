-- V5__add_profile_picture.sql
ALTER TABLE users
    ADD COLUMN profile_picture VARCHAR(255);
