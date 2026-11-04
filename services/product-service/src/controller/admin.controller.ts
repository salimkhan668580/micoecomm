import type { NextFunction, Request, Response } from "express";
import {
  createCategory,
  createSubCategory,
  deleteCategory,
  deleteSubCategory,
  getCategories,
  getCategoryById,
  getSubCategories,
  getSubCategoryById,
  updateCategory,
  updateSubCategory,
} from "../service/admin.service.js";

function handleAdminError(
  error: unknown,
  res: Response,
  next: NextFunction,
  entityName: "Category" | "Subcategory" = "Category",
): void {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    res.status(409).json({ message: `${entityName} slug already exists` });
    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  next(error);
}

export async function createCategoryController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const category = await createCategory(req.body);
    res.status(201).json({ category });
  } catch (error: unknown) {
    handleAdminError(error, res, next);
  }
}

export async function getCategoriesController(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const categories = await getCategories();
    res.status(200).json({ categories });
  } catch (error: unknown) {
    handleAdminError(error, res, next);
  }
}

export async function getCategoryController(
  req: Request<{ categoryId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const category = await getCategoryById(req.params.categoryId);
    res.status(200).json({ category });
  } catch (error: unknown) {
    handleAdminError(error, res, next);
  }
}

export async function updateCategoryController(
  req: Request<{ categoryId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const category = await updateCategory(req.params.categoryId, req.body);
    res.status(200).json({ category });
  } catch (error: unknown) {
    handleAdminError(error, res, next);
  }
}

export async function deleteCategoryController(
  req: Request<{ categoryId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const category = await deleteCategory(req.params.categoryId);
    res.status(200).json({ category });
  } catch (error: unknown) {
    handleAdminError(error, res, next);
  }
}

export async function createSubCategoryController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const subCategory = await createSubCategory(req.body);
    res.status(201).json({ subCategory });
  } catch (error: unknown) {
    handleAdminError(error, res, next, "Subcategory");
  }
}

export async function getSubCategoriesController(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const subCategories = await getSubCategories();
    res.status(200).json({ subCategories });
  } catch (error: unknown) {
    handleAdminError(error, res, next, "Subcategory");
  }
}

export async function getSubCategoryController(
  req: Request<{ subCategoryId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const subCategory = await getSubCategoryById(req.params.subCategoryId);
    res.status(200).json({ subCategory });
  } catch (error: unknown) {
    handleAdminError(error, res, next, "Subcategory");
  }
}

export async function updateSubCategoryController(
  req: Request<{ subCategoryId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const subCategory = await updateSubCategory(
      req.params.subCategoryId,
      req.body,
    );
    res.status(200).json({ subCategory });
  } catch (error: unknown) {
    handleAdminError(error, res, next, "Subcategory");
  }
}

export async function deleteSubCategoryController(
  req: Request<{ subCategoryId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const subCategory = await deleteSubCategory(req.params.subCategoryId);
    res.status(200).json({ subCategory });
  } catch (error: unknown) {
    handleAdminError(error, res, next, "Subcategory");
  }
}