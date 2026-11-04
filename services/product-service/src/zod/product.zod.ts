
import { z } from "zod";

const productFields = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters")
    .max(150),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required"),

  categoryId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),

  subCatId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid subcategory ID")
    .optional()
    .nullable(),

  mrp: z
    .number()
    .positive("MRP must be greater than 0"),

  sellingPrice: z
    .number()
    .positive("Selling price must be greater than 0"),

  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative"),

  sku: z
    .string()
    .trim()
    .optional(),

  status: z
    .enum(["active", "inactive", "draft"])
    .default("active"),

}).strict();

export const productSchema = productFields.refine(
  (data) => data.sellingPrice <= data.mrp,
  {
    message: "Selling price cannot be greater than MRP",
    path: ["sellingPrice"],
  }
);

export const updateProductSchema = productFields
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one product field is required",
  })
  .refine(
    (data) =>
      data.mrp === undefined ||
      data.sellingPrice === undefined ||
      data.sellingPrice <= data.mrp,
    {
      message: "Selling price cannot be greater than MRP",
      path: ["sellingPrice"],
    },
  );

export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
