import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.models.js";
import type {
  LoginInput,
  RegisterInput,
  UpdateMeInput,
} from "../zod/userRegister.zod.js";

function authError(
  message: string,
  statusCode: number,
): Error & { statusCode: number } {
  return Object.assign(new Error(message), { statusCode });
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

export async function registerUser(input: RegisterInput) {
  try {
    const user = await UserModel.create({
      ...input,
      role: "user",
    });

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  } catch (error: unknown) {
    if (isDuplicateKeyError(error)) {
      throw authError("Email already exists", 409);
    }

    throw error;
  }
}

export async function loginUser(input: LoginInput) {
  const user = await UserModel.findOne({
    email: input.email,
  }).select("+password");

  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw authError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
}

export async function getUserById(userId: string) {
  const user = await UserModel.findById(userId).select("name email phone role");
  if (!user) {
    throw authError("User not found", 404);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export async function updateUserById(userId: string, input: UpdateMeInput) {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw authError("User not found", 404);
    }

    if (input.name !== undefined) user.name = input.name;
    if (input.email !== undefined) user.email = input.email;
    if (input.phone !== undefined) user.phone = input.phone;

    await user.save();

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
  } catch (error: unknown) {
    if (isDuplicateKeyError(error)) {
      throw authError("Email already exists", 409);
    }

    throw error;
  }
}