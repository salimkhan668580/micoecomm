import inventoryService from "../service/inventory.service.js";
import { consumeMessage } from "../messaging/consumer.js";

type PaymentMessage = {
  event?: string;
  data?: {
    reservationId?: string;
  };
};

export const initPaymentConsumer = async () => {
  await consumeMessage("payment_queue", async (message: PaymentMessage) => {
    if (
      message.event !== "payment.success" &&
      message.event !== "payment.failed"
    ) {
      return;
    }

    const reservationId = message.data?.reservationId;
    if (!reservationId) {
      throw new Error(`${message.event} message is missing a reservation ID`);
    }

    if (message.event === "payment.success") {
      const reservation =
        await inventoryService.confirmStockReservation(reservationId);
      console.log("Stock reservation confirmed after payment:", reservation);
      return;
    }

    const reservation =
      await inventoryService.expireStockReservation(reservationId);
    console.log("Stock reservation expired after payment failure:", reservation);
  });
};