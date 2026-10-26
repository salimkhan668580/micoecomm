import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import userRoutes from './routes/user.routes.js';
import { connectDB } from './db/dbConnect.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ service: 'user-service', status: 'ok' });
});

app.use('/users', userRoutes);



async function startServer(): Promise<void> {
  await connectDB();
  app.listen(port, () => {
    console.log(`User service running on port ${port}`);
  });
}

void startServer().catch((error: unknown) => {
  console.error('Failed to start user service', error);
  process.exitCode = 1;
});
