import mongoose from "mongoose";
import CategoryModel from "../model/category.model.js";
import ProductModel from "../model/product.model.js";
import SubCategoryModel from "../model/subCategory.model.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../zod/category.zod.js";
import type {
  CreateSubCategoryInput,
  UpdateSubCategoryInput,
} from "../zod/Subcategory.zod.js";

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

function validateSubCategoryId(subCategoryId: string): void {
  if (!mongoose.isValidObjectId(subCategoryId)) {
    throw categoryError("Invalid subcategory ID", 400);
  }
}

async function ensureCategoryExists(categoryId: string): Promise<void> {
  validateCategoryId(categoryId);
  if (!(await CategoryModel.exists({ _id: categoryId }))) {
    throw categoryError("Parent category not found", 404);
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

export async function createSubCategory(input: CreateSubCategoryInput) {
  await ensureCategoryExists(input.parentId);
  return SubCategoryModel.create(input);
}

export async function getSubCategories() {
  return SubCategoryModel.find().sort({ createdAt: -1 });
}

export async function getSubCategoryById(subCategoryId: string) {
  validateSubCategoryId(subCategoryId);

  const subCategory = await SubCategoryModel.findById(subCategoryId);
  if (!subCategory) {
    throw categoryError("Subcategory not found", 404);
  }

  return subCategory;
}

export async function updateSubCategory(
  subCategoryId: string,
  input: UpdateSubCategoryInput,
) {
  validateSubCategoryId(subCategoryId);
  if (input.parentId) {
    await ensureCategoryExists(input.parentId);
  }

  const subCategory = await SubCategoryModel.findByIdAndUpdate(
    subCategoryId,
    { $set: input },
    { new: true, runValidators: true },
  );
  if (!subCategory) {
    throw categoryError("Subcategory not found", 404);
  }

  return subCategory;
}

export async function deleteSubCategory(subCategoryId: string) {
  const subCategory = await getSubCategoryById(subCategoryId);
  const hasProducts = await ProductModel.exists({ subCatId: subCategory._id });
  if (hasProducts) {
    throw categoryError(
      "Cannot delete a subcategory that is assigned to products",
      409,
    );
  }

  await subCategory.deleteOne();
  return subCategory;
}