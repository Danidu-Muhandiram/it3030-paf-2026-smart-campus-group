-- Add description column to assets table (idempotent, MySQL 8.0 compatible)
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'assets' AND COLUMN_NAME = 'description');
SET @sql = IF(@has_col = 0, 'ALTER TABLE assets ADD COLUMN description TEXT NULL', 'SELECT 1');
PREPARE s FROM @sql;
EXECUTE s;
DEALLOCATE PREPARE s;
