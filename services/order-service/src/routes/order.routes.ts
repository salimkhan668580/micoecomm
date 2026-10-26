import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ service: 'order-service', message: 'Order service is running' });
});

export default router;
