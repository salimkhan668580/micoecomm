ALTER TABLE inventory
ALTER COLUMN product_id TYPE VARCHAR(36)
USING product_id::text;

ALTER TABLE reservations
ALTER COLUMN product_id TYPE VARCHAR(36)
USING product_id::text;

ALTER TABLE reservations
ALTER COLUMN order_id TYPE VARCHAR(100)
USING order_id::text;
