import { consumeMessage } from "../messaging/consumer.js";

export const initEmailConsumer = async () => {
  await consumeMessage("email_queue", async (message) => {
    console.log("Email received:", message);
  });
};
