import { model, Schema, type InferSchemaType } from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["Admin", "SubAdmin"],
      required: true,
    },
  },
  { timestamps: true },
);

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

export type Admin = InferSchemaType<typeof adminSchema>;

const AdminModel = model<Admin>("Admin", adminSchema);

export default AdminModel;
