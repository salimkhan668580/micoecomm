ALTER TABLE reservations
ALTER COLUMN order_id TYPE VARCHAR(100)
USING order_id::text;