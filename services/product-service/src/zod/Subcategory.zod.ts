import { z } from "zod";

export const createSubCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Subcategory name must be at least 2 characters")
    .max(100, "Subcategory name is too long"),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),

  parentId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid parent category ID"),

  isActive: z.boolean().optional().default(true),
});

export type CreateSubCategoryInput = z.infer<
  typeof createSubCategorySchema
>;