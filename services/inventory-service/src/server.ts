import express from "express";
import inventoryRoutes from "./routes/inventory.routes.js";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/ConnectDB.js";
import { runMigrations } from "./db/migrate";


const app = express();
const port = Number(process.env.PORT) || 3005;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "inventory-service", status: "ok" });
});
app.use("/inventory", inventoryRoutes);

app.listen(port, async () => {
  console.log("Connecting to PostgreSQL database...", process.env.DATABASE_URL);
  await connectDB();
  await runMigrations();
  console.log(`Inventory service running on port ${port}`);
});
