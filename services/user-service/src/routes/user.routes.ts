import { Router } from 'express';
import { getMe, login, register, updateMe } from '../controller/userAuth.controller.js';
import { isLoggedIn } from '../middleware/isUserLoggedIn.js';
import { validateSchema } from '../middleware/zodSchemaParser.js';
import userAuthZod from '../zod/userRegister.zod.js';


const router = Router();

router.get('/', (_req, res) => {
  res.json({ service: 'user-service', message: 'User service is running' });
});


router.post('/auth/register', validateSchema(userAuthZod.registerSchema), register);
router.post('/auth/login', validateSchema(userAuthZod.loginSchema), login);
router.get('/me', isLoggedIn, getMe);
router.patch('/me', isLoggedIn, validateSchema(userAuthZod.updateMeSchema), updateMe);

export default router;
