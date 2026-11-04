import db from "../db/ConnectDB";
import { InventoryInput } from "../zod/inventory.zod";

const inventoryController ={
    createInventory: async (data:InventoryInput) => {
        const { productId, quantity } = data || {}

        console.log("Creating inventory item:", data);
         
 try {
      await db.query(
      `INSERT INTO inventory (product_id, quantity)
       VALUES ($1, $2)
       RETURNING *`,
      [productId, quantity]
    );
          console.log("Inventory item added successfully");
  } catch (error) {
      console.error("Error adding inventory item:", error);
    throw new Error(`Error adding inventory item: ${error}`);
  }
} 
}


export default inventoryController;