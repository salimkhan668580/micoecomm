import { consumeMessage } from "../messaging/consumer";
import inventoryController from "../controller/inventory.controller.js";
import { InventoryInput } from "../zod/inventory.zod";

export const initConsumers = async () => {
  // Inventory Consumer
  await consumeMessage("inventory_queue", async (message:any) => {
    console.log("Inventory received:", message);
    if(message.event === "product.created") {
       await inventoryController.createInventory({
            productId: message.data._id,
            quantity: message.data.stock
        });

    }
  });

  // Notification Consumer
  await consumeMessage("notification_queue", async (message) => {
    console.log("Notification received:", message);
  });

  // Email Consumer
  await consumeMessage("email_queue", async (message) => {
    console.log("Email received:", message);
  });

  // Order Consumer
  await consumeMessage("order_queue", async (message) => {
    console.log("Order received:", message);
  });

  // Payment Consumer
  await consumeMessage("payment_queue", async (message) => {
    console.log("Payment received:", message);
  });

  console.log("All consumers started successfully");
};