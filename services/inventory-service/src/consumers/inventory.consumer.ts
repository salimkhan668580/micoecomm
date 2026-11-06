import inventoryController from "../controller/inventory.controller.js";
import { consumeMessage } from "../messaging/consumer.js";

type InventoryMessage = {
  event?: string;
  data: {
    _id: string;
    stock: number;
  };
};

export const initInventoryConsumer = async () => {
  await consumeMessage("inventory_queue", async (message: InventoryMessage) => {
    console.log("Inventory received:", message);
    if (message.event === "product.created") {
      await inventoryController.createInventory({
        productId: message.data._id,
        quantity: message.data.stock,
      });
    }
  });
};
