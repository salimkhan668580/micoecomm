import express from 'express';
import productRoutes from './routes/product.routes.js';

const app = express();
const port = Number(process.env.PORT) || 3002;

app.use(express.json());
app.get('/health', (_req, res) => {
  res.json({ service: 'product-service', status: 'ok' });
});
app.use('/products', productRoutes);

app.listen(port, () => {
  console.log(`Product service running on port ${port}`);
});
