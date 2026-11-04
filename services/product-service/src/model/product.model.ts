import { model, Schema, type InferSchemaType } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCatId: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      default: null,
    },
    mrp: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    sku: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  { timestamps: true },
);

export type Product = InferSchemaType<typeof productSchema>;

const ProductModel = model<Product>("Product", productSchema);

export default ProductModel;