import { getChannel } from "../config/rabbitmq";

export const createExchange = async (
  name: string,
  type: "direct" | "fanout" | "topic" | "headers"
) => {
  const channel = getChannel();

  await channel.assertExchange(name, type, {
    durable: true,
  });
};