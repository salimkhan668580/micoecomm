import { consumeMessage } from "../messaging/consumer.js";

export const initOrderConsumer = async () => {
  await consumeMessage("order_queue", async (message) => {
    console.log("Order received:", message);
  });
};
