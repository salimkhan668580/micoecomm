import express from 'express';
import paymentRoutes from './routes/payment.routes.js';

const app = express();
const port = Number(process.env.PORT) || 3004;

app.use(express.json());
app.get('/health', (_req, res) => {
  res.json({ service: 'payment-service', status: 'ok' });
});
app.use('/payments', paymentRoutes);

app.listen(port, () => {
  console.log(`Payment service running on port ${port}`);
});
