    CREATE TABLE reservations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        product_id VARCHAR(24) NOT NULL,
        order_id UUID UNIQUE,

        quantity INTEGER NOT NULL CHECK (quantity > 0),

        status VARCHAR(20) NOT NULL DEFAULT 'reserved'
            CHECK (status IN ('reserved', 'confirmed', 'released', 'expired')),

        expires_at TIMESTAMP NOT NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );