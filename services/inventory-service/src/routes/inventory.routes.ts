import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ service: 'inventory-service', message: 'Inventory service is running' });
});

export default router;
