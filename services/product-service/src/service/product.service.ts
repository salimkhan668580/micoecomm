import mongoose from "mongoose";
import CategoryModel from "../model/category.model.js";
import ProductModel from "../model/product.model.js";
import SubCategoryModel from "../model/subCategory.model.js";
import type {
  ProductInput,
  UpdateProductInput,
} from "../zod/product.zod.js";

function productError(
  message: string,
  statusCode: number,
): Error & { statusCode: number } {
  return Object.assign(new Error(message), { statusCode });
}

function validateProductId(productId: string): void {
  if (!mongoose.isValidObjectId(productId)) {
    throw productError("Invalid product ID", 400);
  }
}

async function validateCategoryReferences(
  categoryId: string,
  subCatId?: string | null,
): Promise<void> {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw productError("Invalid category ID", 400);
  }

  if (!(await CategoryModel.exists({ _id: categoryId }))) {
    throw productError("Category not found", 404);
  }

  if (subCatId == null) {
    return;
  }
  if (!mongoose.isValidObjectId(subCatId)) {
    throw productError("Invalid subcategory ID", 400);
  }

  if (!(await SubCategoryModel.exists({ _id: subCatId, parentId: categoryId }))) {
    throw productError(
      "Subcategory not found or does not belong to the selected category",
      400,
    );
  }
}

export async function createProduct(input: ProductInput) {
  await validateCategoryReferences(input.categoryId, input.subCatId);
  return ProductModel.create(input);
}

export async function getProducts() {
  return ProductModel.find().sort({ createdAt: -1 });
}

export async function getProductById(productId: string) {
  validateProductId(productId);

  const product = await ProductModel.findById(productId);
  if (!product) {
    throw productError("Product not found", 404);
  }

  return product;
}

export async function updateProduct(
  productId: string,
  input: UpdateProductInput,
) {
  validateProductId(productId);

  const product = await ProductModel.findById(productId);
  if (!product) {
    throw productError("Product not found", 404);
  }

  const categoryId = input.categoryId ?? product.categoryId.toString();
  const subCatId =
    input.subCatId === undefined ? product.subCatId?.toString() : input.subCatId;
  await validateCategoryReferences(categoryId, subCatId);

  const mrp = input.mrp ?? product.mrp;
  const sellingPrice = input.sellingPrice ?? product.sellingPrice;
  if (sellingPrice > mrp) {
    throw productError("Selling price cannot be greater than MRP", 400);
  }

  Object.assign(product, input);
  await product.save();
  return product;
}

export async function deleteProduct(productId: string) {
  const product = await getProductById(productId);
  await product.deleteOne();
  return product;
}
