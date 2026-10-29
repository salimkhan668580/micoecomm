import type { NextFunction, Request, Response } from "express";

export function iscMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const expectedKey = process.env.ISC_API_KEY;
  if (!expectedKey) {
    res.status(500).json({ message: "API service key is not configured" });
    return;
  }

  if (req.get("x-api-key") !== expectedKey) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  next();
}