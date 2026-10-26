import express from 'express';
import inventoryRoutes from './routes/inventory.routes.js';

const app = express();
const port = Number(process.env.PORT) || 3005;

app.use(express.json());
app.get('/health', (_req, res) => {
  res.json({ service: 'inventory-service', status: 'ok' });
});
app.use('/inventory', inventoryRoutes);

app.listen(port, () => {
  console.log(`Inventory service running on port ${port}`);
});
