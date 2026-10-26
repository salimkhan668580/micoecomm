import type { NextFunction, Request, Response } from "express";
import {
  getUserById,
  loginUser,
  registerUser,
  updateUserById,
} from "../service/userAuth.service.js";

function respondWithProfileError(
  error: unknown,
  res: Response,
  next: NextFunction,
): void {
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

export async function register(
  req: Request,
  res: Response,
) {
  try {
    const result = await registerUser(req.body);
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });
    res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: "User registration failed", error });
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
){
  try {
    const result = await loginUser(req.body);
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });
    res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: "User login failed", error });
  }
}

export async function getMe(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await getUserById(res.locals.auth.sub);
    res.status(200).json({ user });
  } catch (error: unknown) {
    respondWithProfileError(error, res, next);
  }
}

export async function updateMe(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await updateUserById(res.locals.auth.sub, req.body);
    res.status(200).json({ user });
  } catch (error: unknown) {
    respondWithProfileError(error, res, next);
  }
}