import { z } from "zod";

const adminLoginSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

const verifyAdminTokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export default {
  adminLoginSchema,
  verifyAdminTokenSchema,
};
