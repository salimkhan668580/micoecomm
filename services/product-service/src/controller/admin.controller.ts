import type { NextFunction, Request, Response } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../service/admin.service.js";

function handleCategoryError(
  error: unknown,
  res: Response,
  next: NextFunction,
): void {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    res.status(409).json({ message: "Category slug already exists" });
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
    handleCategoryError(error, res, next);
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
    handleCategoryError(error, res, next);
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
    handleCategoryError(error, res, next);
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
    handleCategoryError(error, res, next);
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
    handleCategoryError(error, res, next);
  }
}