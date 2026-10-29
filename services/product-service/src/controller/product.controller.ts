import type { Request, Response } from "express";
import { getSampleProduct } from "../service/product.service.js";

export function getSampleProductController(
  _req: Request,
  res: Response,
): void {
  const product = getSampleProduct();
  res.status(200).json({ product });
}
