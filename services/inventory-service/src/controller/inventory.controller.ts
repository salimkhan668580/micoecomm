
import db from "../db/ConnectDB";
import invertoryService from "../service/inventory.service";
import { InventoryInput } from "../zod/inventory.zod";
import type { Request, Response } from "express";
const inventoryController = {
  createInventory: async (data: InventoryInput) => {
    const { productId, quantity } = data || {};

    try {
      await invertoryService.createInventory({ productId, quantity });
      console.log("Inventory item added successfully");
    } catch (error) {
      console.error("Error adding inventory item:", error);
      throw new Error(`Error adding inventory item: ${error}`);
    }
  },
  getInventory: async (req:Request, res:Response) => {
    const { productId:id } = req.params;

    try {
      const inventory = await invertoryService.getInventory(id as string);
        res.json({
          message: "Inventory item fetched successfully",
          data: inventory,
          })
    } catch (error) {
      console.error("Error fetching inventory item:", error);
      throw new Error(`Error fetching inventory item: ${error}`);
    }
  },
};




export default inventoryController;
