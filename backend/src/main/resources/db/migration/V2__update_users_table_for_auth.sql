-- Update users table to split name and add university_id

-- 1. Add new columns allows null temporarily to accommodate existing rows
ALTER TABLE users ADD COLUMN first_name VARCHAR(50);
ALTER TABLE users ADD COLUMN last_name VARCHAR(50);
ALTER TABLE users ADD COLUMN university_id VARCHAR(50) UNIQUE;

-- 2. Migrate existing data conceptually
-- We use a simple space split for name. If there's no space, last_name is empty string.
UPDATE users SET 
    first_name = SUBSTRING_INDEX(name, ' ', 1),
    last_name = IF(LOCATE(' ', name) > 0, SUBSTRING(name, LOCATE(' ', name) + 1), '');

-- 3. Inforce NOT NULL constraints on the new columns now that data is populated
ALTER TABLE users MODIFY COLUMN first_name VARCHAR(50) NOT NULL;
ALTER TABLE users MODIFY COLUMN last_name VARCHAR(50) NOT NULL;

-- 4. Drop the old name column
ALTER TABLE users DROP COLUMN name;
