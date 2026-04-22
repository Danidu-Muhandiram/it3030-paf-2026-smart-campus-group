-- Add image URL column to assets table (idempotent, MySQL 8.0 compatible)
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'assets' AND COLUMN_NAME = 'image_url');
SET @sql = IF(@has_col = 0, 'ALTER TABLE assets ADD COLUMN image_url VARCHAR(255) NULL', 'SELECT 1');
PREPARE s FROM @sql;
EXECUTE s;
DEALLOCATE PREPARE s;
