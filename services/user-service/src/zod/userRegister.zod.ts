
import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .email("Invalid email address")
    .trim()
    .toLowerCase(),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(
      (password) => Buffer.byteLength(password, "utf8") <= 72,
      "Password must be at most 72 bytes",
    ),
});

const loginSchema = z.object({
  email: z
    .email("Invalid email address")
    .trim()
    .toLowerCase(),

  password: z.string().min(1, "Password is required"),
});

const updateMeSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
    email: z.email("Invalid email address").trim().toLowerCase().optional(),
    phone: z.string().trim().min(10, "Phone number must be at least 10 characters").optional(),
  })
  .strict()
  .refine((input) => Object.keys(input).length > 0, {
    message: "At least one profile field is required",
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateMeInput = z.infer<typeof updateMeSchema>;

export default {
  registerSchema,
  loginSchema,
  updateMeSchema,
};
