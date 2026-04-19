-- Create resource_types lookup table
CREATE TABLE resource_types (
    id   BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Migrate any existing distinct type strings from assets into resource_types
INSERT INTO resource_types (name)
SELECT DISTINCT type FROM assets WHERE type IS NOT NULL AND type != '';

-- Add type_id FK column (nullable during migration)
ALTER TABLE assets ADD COLUMN type_id BIGINT NULL;
ALTER TABLE assets ADD CONSTRAINT fk_asset_type
    FOREIGN KEY (type_id) REFERENCES resource_types(id) ON DELETE SET NULL;

-- Backfill type_id from the migrated resource_types rows
UPDATE assets a
    JOIN resource_types rt ON rt.name = a.type
SET a.type_id = rt.id
WHERE a.type IS NOT NULL AND a.type != '';

-- Drop the old string column
ALTER TABLE assets DROP COLUMN type;
