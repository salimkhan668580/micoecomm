import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export type AuthClaims = JwtPayload & {
  sub: string;
  role: "user" | "admin";
};

function isAuthClaims(payload: string | JwtPayload): payload is AuthClaims {
  return (
    typeof payload !== "string" &&
    typeof payload.sub === "string" &&
    (payload.role === "user" || payload.role === "admin")
  );
}

export function isLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.token;
  if (typeof token !== "string" || token.length === 0) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ message: "Authentication is not configured" });
    return;
  }

  try {
    const payload = jwt.verify(token, secret);
    if (!isAuthClaims(payload)) {
      res.status(401).json({ message: "Invalid authentication token" });
      return;
    }

    res.locals.auth = payload;
    next();
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid or expired authentication token" });
      return;
    }

    next(error);
  }
}