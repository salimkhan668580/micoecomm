import { model, Schema, type InferSchemaType } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export type SubCategory = InferSchemaType<typeof subCategorySchema>;

const SubCategoryModel = model<SubCategory>("SubCategory", subCategorySchema);

export default SubCategoryModel;