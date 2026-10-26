import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ service: 'notification-service', message: 'Notification service is running' });
});

export default router;
