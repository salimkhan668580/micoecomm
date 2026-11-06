import { initEmailConsumer } from "./email.consumer.js";
import { initInventoryConsumer } from "./inventory.consumer.js";
import { initNotificationConsumer } from "./notification.consumer.js";
import { initOrderConsumer } from "./order.consumer.js";
import { initPaymentConsumer } from "./payment.consumer.js";

export const initConsumers = async () => {
  await initInventoryConsumer();
  await initNotificationConsumer();
  await initEmailConsumer();
  await initOrderConsumer();
  await initPaymentConsumer();

  console.log("All consumers started successfully");
};
