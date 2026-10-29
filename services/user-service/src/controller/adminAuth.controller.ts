import type { NextFunction, Request, Response } from "express";
import {
  loginAdmin,
  verifyAdminToken as getAdminFromToken,
} from "../service/adminAuth.service.js";

export async function adminLogin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await loginAdmin(req.body);
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });
    res.status(200).json({
      token: result.token,
      admin: result.admin,
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      typeof error.statusCode === "number" &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    next(error);
  }
}

export async function verifyAdminToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const admin = await getAdminFromToken(req.body.token);
    res.status(200).json({ admin });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      typeof error.statusCode === "number" &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    next(error);
  }
}