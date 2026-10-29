import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ service: 'product-service', message: 'Product service is running' });
});



export default router;
