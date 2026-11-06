import * as z from "zod";

export const inventorySchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
  quantity: z.number().int().min(0, "Quantity cannot be negative"),
});

export const reservationSchema = z.object({
  productId: z.string().min(1).max(24),
  orderId: z.string().min(1).max(100).nullable(),
  quantity: z.number().int().positive(),
});

export type InventoryInput = z.infer<typeof inventorySchema>;
export type ReservationInput = z.infer<typeof reservationSchema>;