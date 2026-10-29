import mongoose from "mongoose";
import CategoryModel from "../model/category.model.js";
import SubCategoryModel from "../model/subCategory.model.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../zod/category.zod.js";

function categoryError(
  message: string,
  statusCode: number,
): Error & { statusCode: number } {
  return Object.assign(new Error(message), { statusCode });
}

function validateCategoryId(categoryId: string): void {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw categoryError("Invalid category ID", 400);
  }
}

export async function createCategory(input: CreateCategoryInput) {
  return CategoryModel.create(input);
}

export async function getCategories() {
  return CategoryModel.find().sort({ createdAt: -1 });
}

export async function getCategoryById(categoryId: string) {
  validateCategoryId(categoryId);

  const category = await CategoryModel.findById(categoryId);
  if (!category) {
    throw categoryError("Category not found", 404);
  }

  return category;
}

export async function updateCategory(
  categoryId: string,
  input: UpdateCategoryInput,
) {
  validateCategoryId(categoryId);

  const category = await CategoryModel.findByIdAndUpdate(
    categoryId,
    { $set: input },
    { new: true, runValidators: true },
  );
  if (!category) {
    throw categoryError("Category not found", 404);
  }

  return category;
}

export async function deleteCategory(categoryId: string) {
  validateCategoryId(categoryId);

  const category = await CategoryModel.findById(categoryId);
  if (!category) {
    throw categoryError("Category not found", 404);
  }

  const hasSubcategories = await SubCategoryModel.exists({
    parentId: category._id,
  });
  if (hasSubcategories) {
    throw categoryError(
      "Cannot delete a category that has subcategories",
      409,
    );
  }

  await category.deleteOne();
  return category;
}