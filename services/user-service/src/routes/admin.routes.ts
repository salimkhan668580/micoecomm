import { Router } from "express";
import { adminLogin } from "../controller/adminAuth.controller.js";
import { validateSchema } from "../middleware/zodSchemaParser.js";
import adminAuthZod from "../zod/adminAuth.zod.js";

const router = Router();

router.post(
  "/login",
  validateSchema(adminAuthZod.adminLoginSchema),
  adminLogin,
);

export default router;