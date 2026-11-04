import { getChannel } from "../config/rabbitmq";

export const publishMessage = (
  exchange: string,
  routingKey: string,
  message: object
) => {
  const channel = getChannel();

  channel.publish(
    exchange,
    routingKey,
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );
};