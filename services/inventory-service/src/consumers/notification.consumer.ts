import { consumeMessage } from "../messaging/consumer.js";

export const initNotificationConsumer = async () => {
  await consumeMessage("notification_queue", async (message) => {
    console.log("Notification received:", message);
  });
};
