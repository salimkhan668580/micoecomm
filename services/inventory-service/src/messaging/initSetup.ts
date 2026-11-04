
import { createExchange } from "./exchanges";
import { createQueue } from "./queues";

const exchanges = [
  { name: "product_events", type: "direct" as const },
  { name: "order_events", type: "fanout" as const },
  { name: "payment_events", type: "topic" as const },
];

const queues = [
  {
    name: "inventory_queue",
    exchange: "product_events",
    routingKey: "product.created",
  },
  {
    name: "notification_queue",
    exchange: "product_events",
    routingKey: "product.created",
  },
  {
    name: "email_queue",
    exchange: "order_events",
    routingKey: "",
  },
  {
    name: "order_queue",
    exchange: "order_events",
    routingKey: "",
  },
  {
    name: "payment_queue",
    exchange: "payment_events",
    routingKey: "payment.*",
  },
];

export const initSetupRabbitMQ = async () => {
  // Create all exchanges
  for (const exchange of exchanges) {
    await createExchange(exchange.name, exchange.type);
  }

  // Create queues and bind them to exchanges
  for (const queue of queues) {
    await createQueue(
      queue.name,
      queue.exchange,
      queue.routingKey
    );
  }

  console.log("RabbitMQ setup completed");
};
