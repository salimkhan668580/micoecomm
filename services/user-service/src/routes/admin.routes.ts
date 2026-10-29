import { Router } from "express";
import {
  adminLogin,
  verifyAdminToken,
} from "../controller/adminAuth.controller.js";
import { validateSchema } from "../middleware/zodSchemaParser.js";
import adminAuthZod from "../zod/adminAuth.zod.js";
import { iscMiddleware } from "../middleware/IscMiddleware.js";

const router = Router();

router.post(
  "/login",
  validateSchema(adminAuthZod.adminLoginSchema),
  adminLogin,
);
router.post(
  "/verify-token",
   iscMiddleware,
  validateSchema(adminAuthZod.verifyAdminTokenSchema),
  verifyAdminToken,
);

export default router;