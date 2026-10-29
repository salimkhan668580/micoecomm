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

export async function verifyAdminToken(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw authError("Authentication is not configured", 500);
  }

  let payload: string | jwt.JwtPayload;
  try {
    payload = jwt.verify(token, secret);
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw authError("Invalid or expired authentication token", 401);
    }

    throw error;
  }

  if (
    typeof payload === "string" ||
    typeof payload.sub !== "string" ||
    (payload.role !== "Admin" && payload.role !== "SubAdmin")
  ) {
    throw authError("Invalid authentication token", 401);
  }

  const admin = await AdminModel.findById(payload.sub).select(
    "name email role",
  );
  if (!admin) {
    throw authError("Admin not found", 404);
  }

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };
}
