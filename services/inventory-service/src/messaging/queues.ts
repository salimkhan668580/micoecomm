import { getChannel } from "../config/rabbitmq";

export const createQueue = async (
  queueName: string,
  exchange: string
) => {
  const channel = getChannel();

  await channel.assertQueue(queueName, {
    durable: true,
  });

  await channel.bindQueue(
    queueName,
    exchange,
    ""
  );
};