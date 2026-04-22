-- Create resource_types lookup table (idempotent)
CREATE TABLE IF NOT EXISTS resource_types (
    id   BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- If the legacy 'type' string column still exists on assets, seed resource_types
-- from it and backfill type_id. Uses prepared-statement trick to stay idempotent.

SET @has_type = (
    SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'assets'
      AND COLUMN_NAME  = 'type'
);

-- Seed from existing type strings (only when column still exists)
SET @sql1 = IF(@has_type > 0,
    'INSERT IGNORE INTO resource_types (name) SELECT DISTINCT `type` FROM assets WHERE `type` IS NOT NULL AND `type` != \'\'',
    'SELECT 1');
PREPARE s1 FROM @sql1; EXECUTE s1; DEALLOCATE PREPARE s1;

-- Add type_id FK column if not already present (MySQL 8.0 compatible)
SET @has_type_id = (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'assets' AND COLUMN_NAME = 'type_id');
SET @sql_add_col = IF(@has_type_id = 0, 'ALTER TABLE assets ADD COLUMN type_id BIGINT NULL', 'SELECT 1');
PREPARE s_add FROM @sql_add_col; EXECUTE s_add; DEALLOCATE PREPARE s_add;

-- Add FK constraint only if it does not already exist
SET @has_fk = (
    SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND TABLE_NAME         = 'assets'
      AND CONSTRAINT_NAME    = 'fk_asset_type'
);
SET @sql2 = IF(@has_fk = 0,
    'ALTER TABLE assets ADD CONSTRAINT fk_asset_type FOREIGN KEY (type_id) REFERENCES resource_types(id) ON DELETE SET NULL',
    'SELECT 1');
PREPARE s2 FROM @sql2; EXECUTE s2; DEALLOCATE PREPARE s2;

-- Backfill type_id from the legacy type strings (only when column still exists)
SET @sql3 = IF(@has_type > 0,
    'UPDATE assets a JOIN resource_types rt ON rt.name = a.`type` SET a.type_id = rt.id WHERE a.`type` IS NOT NULL AND a.`type` != \'\'',
    'SELECT 1');
PREPARE s3 FROM @sql3; EXECUTE s3; DEALLOCATE PREPARE s3;

-- Drop the old string column if it still exists (MySQL 8.0 compatible)
SET @has_type_drop = (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'assets' AND COLUMN_NAME = 'type');
SET @sql_drop = IF(@has_type_drop > 0, 'ALTER TABLE assets DROP COLUMN `type`', 'SELECT 1');
PREPARE s_drop FROM @sql_drop; EXECUTE s_drop; DEALLOCATE PREPARE s_drop;
