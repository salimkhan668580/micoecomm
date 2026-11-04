import { getChannel } from "../config/rabbitmq";

export const consumeMessage = async (
  queueName: string,
  callback: (data: any) => Promise<void>
) => {
  const channel = getChannel();
  console.log(`Consumer started: ${queueName}`);

  await channel.consume(queueName, async (msg: any) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());

      await callback( data);

      channel.ack(msg);
    } catch (error) {
      console.error("Consumer error:", error);

      channel.nack(msg, false, false);
    }
  });
};