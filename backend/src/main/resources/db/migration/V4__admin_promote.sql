-- Seed ADMIN role if it does not already exist.
INSERT INTO roles (name)
SELECT 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM roles WHERE name = 'ADMIN'
);

-- Promote known account(s) to ADMIN.
UPDATE users u
JOIN roles r ON r.name = 'ADMIN'
SET u.role_id = r.id
WHERE LOWER(u.email) IN (
    'admin@smartcampus.com'
);
