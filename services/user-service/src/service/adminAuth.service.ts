import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AdminModel from "../models/Admin.models.js";
import type { AdminLoginInput } from "../zod/adminAuth.zod.js";

function authError(
  message: string,
  statusCode: number,
): Error & { statusCode: number } {
  return Object.assign(new Error(message), { statusCode });
}

export async function loginAdmin(input: AdminLoginInput) {
  const admin = await AdminModel.findOne({ email: input.email }).select(
    "+password",
  );

  if (!admin || !(await bcrypt.compare(input.password, admin.password))) {
    throw authError("Invalid email or password", 401);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw authError("Authentication is not configured", 500);
  }

  const token = jwt.sign(
    { sub: admin.id, role: admin.role },
    secret,
    { expiresIn: "1h" },
  );

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
}
