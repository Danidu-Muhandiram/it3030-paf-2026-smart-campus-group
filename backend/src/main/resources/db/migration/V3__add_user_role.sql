-- V3__add_user_role.sql
ALTER TABLE users
    ADD COLUMN role_id BIGINT;

ALTER TABLE users
    ADD CONSTRAINT fk_user_role
    FOREIGN KEY (role_id) REFERENCES roles(id);
