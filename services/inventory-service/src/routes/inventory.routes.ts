import { Router } from "express";
import db from "../db/ConnectDB";
import { consumeMessage } from "../messaging/consumer";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    service: "inventory-service",
    message: "Inventory service is running",
  });
});

router.post("/add", async (req, res) => {
  try {
    // const { product_id, quantity } = req.body;
    console.log("Starting inventory consumer...");

    //     const result = await db.query(
    //   `INSERT INTO inventory (product_id, quantity)
    //    VALUES ($1, $2)
    //    RETURNING *`,
    //   [product_id, quantity]
    // );

    return res.status(201).json({
      message: "Inventory item added successfully",
    });
  } catch (error) {
    console.error("Error adding inventory item:", error);
    res.status(500).json({ error: "Failed to add inventory item" });
  }
});

export default router;
