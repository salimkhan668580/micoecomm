import express from 'express';
import productRoutes from './routes/product.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { connectDB } from './db/dbConnect.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3002;

app.use(express.json());
app.get('/health', (_req, res) => {
  res.json({ service: 'product-service', status: 'ok' });
});
app.use('/products', productRoutes);
app.use('/products/admin', adminRoutes);

async function startServer(): Promise<void> {
  await connectDB();
  app.listen(port, () => {
    console.log(`Product service running on port ${port}`);
  });
}

void startServer().catch((error: unknown) => {
  console.error('Failed to start product service', error);
  process.exitCode = 1;
});
