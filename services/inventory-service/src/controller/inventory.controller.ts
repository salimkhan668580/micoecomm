
import inventoryService, { ReservationError } from "../service/inventory.service";
import type { InventoryInput, ReservationInput } from "../zod/inventory.zod";
import type { NextFunction, Request, Response } from "express";
const inventoryController = {
  createInventory: async (data: InventoryInput) => {
    const { productId, quantity } = data || {};

    try {
      await inventoryService.createInventory({ productId, quantity });
      console.log("Inventory item added successfully");
    } catch (error) {
      console.error("Error adding inventory item:", error);
      throw new Error(`Error adding inventory item: ${error}`);
    }
  },
  getInventory: async (req:Request, res:Response) => {
    const { productId:id } = req.params;

    try {
      const inventory = await inventoryService.getInventory(id as string);
        res.json({
          message: "Inventory item fetched successfully",
          data: inventory,
          })
    } catch (error) {
      console.error("Error fetching inventory item:", error);
      throw new Error(`Error fetching inventory item: ${error}`);
    }
  },
  reserveStock: async (
    req: Request<Record<string, never>, unknown, ReservationInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {

      const reservation = await inventoryService.stockReservation(req.body as ReservationInput);
      res.status(201).json({
        message: "Stock reserved successfully",
        data: reservation,
      });
    } catch (error) {
      if (error instanceof ReservationError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }

      next(error);
    }
  },
  confirmStockReservation: async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.params;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      res.status(400).json({ message: "Invalid reservation ID" });
      return;
    }

    try {
      const reservation = await inventoryService.confirmStockReservation(id);
      res.json({
        message: "Reservation confirmed successfully",
        data: reservation,
      });
    } catch (error) {
      if (error instanceof ReservationError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }

      next(error);
    }
  },
};




export default inventoryController;
