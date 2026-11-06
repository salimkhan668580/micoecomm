ALTER TABLE inventory
RENAME COLUMN quantity TO stock;

ALTER TABLE inventory
ADD COLUMN reserved_stock INTEGER NOT NULL DEFAULT 0,
ADD COLUMN available_stock INTEGER NOT NULL DEFAULT 0;

UPDATE inventory
SET available_stock = stock;