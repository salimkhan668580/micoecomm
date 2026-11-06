import { Router } from "express";
import inventoryController from "../controller/inventory.controller.js";
import { verifyAdminToken } from "../middleware/verifyAdminToken.js";
import { validateSchema } from "../middleware/zodSchemaParser.js";
import { reservationSchema } from "../zod/inventory.zod.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    service: "inventory-service",
    message: "Inventory service is running",
  });
});

router.use(verifyAdminToken);
router.post(
  "/reservations",
  validateSchema(reservationSchema),
  inventoryController.reserveStock,
);


router.get("/:productId", inventoryController.getInventory);

export default router;
