import { Router } from "express";
import {
  createCategoryController,
  createSubCategoryController,
  deleteCategoryController,
  deleteSubCategoryController,
  getCategoriesController,
  getCategoryController,
  getSubCategoriesController,
  getSubCategoryController,
  updateCategoryController,
  updateSubCategoryController,
} from "../controller/admin.controller.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getProductsController,
  updateProductController,
} from "../controller/product.controller.js";
import { verifyAdminToken } from "../middleware/verifyAdminToken.js";
import { validateSchema } from "../middleware/zodSchemaParser.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../zod/category.zod.js";
import {
  createSubCategorySchema,
  updateSubCategorySchema,
} from "../zod/Subcategory.zod.js";
import {
  productSchema,
  updateProductSchema,
} from "../zod/product.zod.js";

const router = Router();

router.use(verifyAdminToken);


// =====================category routes========================
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


// ===================subcategory routes========================
router.post(
  "/subcategories",
  validateSchema(createSubCategorySchema),
  createSubCategoryController,
);

router.get("/subcategories", getSubCategoriesController);

router.get("/subcategories/:subCategoryId", getSubCategoryController);

router.patch(
  "/subcategories/:subCategoryId",
  validateSchema(updateSubCategorySchema),
  updateSubCategoryController,
);

router.delete("/subcategories/:subCategoryId", deleteSubCategoryController);



// =========================Admin product route=======================
router.post(
  "/products",
  validateSchema(productSchema),
  createProductController,
);

router.get("/products", getProductsController);

router.get("/products/:productId", getProductController);

router.patch(
  "/products/:productId",
  validateSchema(updateProductSchema),
  updateProductController,
);

router.delete("/products/:productId", deleteProductController);

export default router;