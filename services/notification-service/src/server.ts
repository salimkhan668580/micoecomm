import express from 'express';
import notificationRoutes from './routes/notification.routes.js';

const app = express();
const port = Number(process.env.PORT) || 3006;

app.use(express.json());
app.get('/health', (_req, res) => {
  res.json({ service: 'notification-service', status: 'ok' });
});
app.use('/notifications', notificationRoutes);

app.listen(port, () => {
  console.log(`Notification service running on port ${port}`);
});
