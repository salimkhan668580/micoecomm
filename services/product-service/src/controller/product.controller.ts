import type { NextFunction, Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../service/product.service.js";

function handleProductError(
  error: unknown,
  res: Response,
  next: NextFunction,
): void {
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

export async function createProductController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await createProduct(req.body);
    res.status(201).json({ product });
  } catch (error: unknown) {
    handleProductError(error, res, next);
  }
}

export async function getProductsController(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const products = await getProducts();
    res.status(200).json({ products });
  } catch (error: unknown) {
    handleProductError(error, res, next);
  }
}

export async function getProductController(
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await getProductById(req.params.productId);
    res.status(200).json({ product });
  } catch (error: unknown) {
    handleProductError(error, res, next);
  }
}

export async function updateProductController(
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await updateProduct(req.params.productId, req.body);
    res.status(200).json({ product });
  } catch (error: unknown) {
    handleProductError(error, res, next);
  }
}

export async function deleteProductController(
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await deleteProduct(req.params.productId);
    res.status(200).json({ product });
  } catch (error: unknown) {
    handleProductError(error, res, next);
  }
}
