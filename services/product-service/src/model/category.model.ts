import { model, Schema } from "mongoose";
import type { CreateCategoryInput } from "../zod/category.zod.js";

const categorySchema = new Schema<CreateCategoryInput>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export type Category = CreateCategoryInput;

const CategoryModel = model<Category>("Category", categorySchema);

export default CategoryModel;