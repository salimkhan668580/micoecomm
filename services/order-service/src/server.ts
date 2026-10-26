import express from 'express';
import orderRoutes from './routes/order.routes.js';

const app = express();
const port = Number(process.env.PORT) || 3003;

app.use(express.json());
app.get('/health', (_req, res) => {
  res.json({ service: 'order-service', status: 'ok' });
});
app.use('/orders', orderRoutes);

app.listen(port, () => {
  console.log(`Order service running on port ${port}`);
});
