import db from "../db/ConnectDB";

type ReservationInput = {
  productId: string;
  quantity: number;
  orderId: string | null;
};

export class ReservationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "ReservationError";
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

const inventoryService = {
  createInventory: async (data: any) => {
    const { productId, quantity } = data || {};

    await db.query(
      `INSERT INTO inventory (product_id, stock,reserved_stock,available_stock)
       VALUES ($1, $2,0,$2)
       RETURNING *`,
      [productId, quantity],
    );
  },
  getInventory: async (id: string) => {
    const result = await db.query(
      `SELECT * FROM inventory WHERE product_id = $1`,
      [id],
    );
    return result.rows[0];
  },

  stockReservation: async (data: ReservationInput) => {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const inventoryResult = await client.query(
        `UPDATE inventory
         SET reserved_stock = reserved_stock + $2,
             available_stock = available_stock - $2
         WHERE product_id = $1 AND available_stock >= $2
         RETURNING product_id`,
        [data.productId, data.quantity],
      );

      if (inventoryResult.rowCount === 0) {
        const existingInventory = await client.query(
          "SELECT product_id FROM inventory WHERE product_id = $1",
          [data.productId],
        );

        if (existingInventory.rowCount === 0) {
          throw new ReservationError("Inventory item not found", 404);
        }

        throw new ReservationError("Insufficient available stock", 409);
      }

      const reservationResult = await client.query(
        `INSERT INTO reservations (product_id, order_id, quantity, expires_at)
         VALUES ($1, $2, $3, NOW() + INTERVAL '15 minutes')
         RETURNING id, product_id AS "productId", order_id AS "orderId",
                   quantity, status, expires_at AS "expiresAt",
                   created_at AS "createdAt"`,
        [data.productId, data.orderId, data.quantity],
      );

      await client.query("COMMIT");
      return reservationResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      if (isUniqueViolation(error)) {
        throw new ReservationError(
          "A reservation already exists for this order",
          409,
        );
      }
      throw error;
    } finally {
      client.release();
    }
  },

  confirmStockReservation: async (reservationId: string) => {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const reservationResult = await client.query(
        `SELECT id, product_id, quantity, status
         FROM reservations
         WHERE id = $1
         FOR UPDATE`,
        [reservationId],
      );
      const reservation = reservationResult.rows[0];

      if (!reservation) {
        throw new ReservationError("Reservation not found", 404);
      }

      if (reservation.status === "confirmed") {
        await client.query("COMMIT");
        return { id: reservation.id, status: reservation.status };
      }

      if (reservation.status !== "reserved") {
        throw new ReservationError(
          `Cannot confirm a ${reservation.status} reservation`,
          409,
        );
      }

      const inventoryResult = await client.query(
        `UPDATE inventory
         SET stock = stock - $2,
             reserved_stock = reserved_stock - $2
         WHERE product_id = $1
           AND stock >= $2
           AND reserved_stock >= $2`,
        [reservation.product_id, reservation.quantity],
      );

      if (inventoryResult.rowCount === 0) {
        throw new Error(
          `Inventory totals do not match reservation ${reservationId}`,
        );
      }

      const confirmedResult = await client.query(
        `UPDATE reservations
         SET status = 'confirmed', updated_at = NOW()
         WHERE id = $1
         RETURNING id, status`,
        [reservationId],
      );

      await client.query("COMMIT");
      return confirmedResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  expireStockReservation: async (reservationId: string) => {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const reservationResult = await client.query(
        `SELECT id, product_id, quantity, status
         FROM reservations
         WHERE id = $1
         FOR UPDATE`,
        [reservationId],
      );
      const reservation = reservationResult.rows[0];

      if (!reservation) {
        throw new ReservationError("Reservation not found", 404);
      }

      if (reservation.status === "expired") {
        await client.query("COMMIT");
        return { id: reservation.id, status: reservation.status };
      }

      if (reservation.status !== "reserved") {
        throw new ReservationError(
          `Cannot expire a ${reservation.status} reservation`,
          409,
        );
      }

      const inventoryResult = await client.query(
        `UPDATE inventory
         SET reserved_stock = reserved_stock - $2,
             available_stock = available_stock + $2
         WHERE product_id = $1
           AND reserved_stock >= $2`,
        [reservation.product_id, reservation.quantity],
      );

      if (inventoryResult.rowCount === 0) {
        throw new Error(
          `Inventory totals do not match reservation ${reservationId}`,
        );
      }

      const expiredResult = await client.query(
        `UPDATE reservations
         SET status = 'expired', updated_at = NOW()
         WHERE id = $1
         RETURNING id, status`,
        [reservationId],
      );

      await client.query("COMMIT");
      return expiredResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};

export default inventoryService;
