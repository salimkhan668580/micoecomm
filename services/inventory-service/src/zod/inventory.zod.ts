import * as z from "zod";

export const inventorySchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
  quantity: z.number().int().min(0, "Quantity cannot be negative"),
});


export type InventoryInput = z.infer<typeof inventorySchema>;