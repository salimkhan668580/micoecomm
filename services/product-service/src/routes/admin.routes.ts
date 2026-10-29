import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getCategoryController,
  updateCategoryController,
} from "../controller/admin.controller.js";
import { verifyAdminToken } from "../middleware/verifyAdminToken.js";
import { validateSchema } from "../middleware/zodSchemaParser.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../zod/category.zod.js";

const router = Router();

router.use(verifyAdminToken);

router.post(
  "/categories",
  validateSchema(createCategorySchema),
  createCategoryController
);

router.get("/categories", getCategoriesController);

router.get("/categories/:categoryId", getCategoryController);

router.patch(
  "/categories/:categoryId",
  validateSchema(updateCategorySchema),
  updateCategoryController
);

router.delete("/categories/:categoryId", deleteCategoryController);

export default router;