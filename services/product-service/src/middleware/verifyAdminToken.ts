import axios from "axios";
import type { NextFunction, Request, Response } from "express";
import api from "../helper/api.js";

type AdminData = {
  role: string;
  [key: string]: unknown;
};

declare global {
  namespace Express {
    interface Request {
      admin?: AdminData;
    }
  }
}

function getRequestToken(req: Request): string | undefined {
  const authorization = req.get("authorization");
  const bearerMatch = authorization?.match(/^Bearer\s+(.+)$/i);
  if (bearerMatch) {
    return bearerMatch[1];
  }

  return req
    .get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("token="))
    ?.slice("token=".length);
}

function isAdminData(data: unknown): data is AdminData {
  return (
    typeof data === "object" &&
    data !== null &&
    "role" in data &&
    typeof data.role === "string"
  );
}

export async function verifyAdminToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = getRequestToken(req);
  if (!token) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const userServiceUrl = process.env.USER_SERVICE_URL;
  if (!userServiceUrl) {
    res.status(500).json({ message: "User service URL is not configured" });
    return;
  }

  try {
    const response = await api.post<unknown>(
      `${userServiceUrl}/admin/verify-token`,
      { token },
    );
    const responseData = response.data;
    const adminData =
      typeof responseData === "object" &&
      responseData !== null &&
      "admin" in responseData
        ? responseData.admin
        : responseData;

    if (!isAdminData(adminData)) {
      res.status(502).json({ message: "Invalid response from user service" });
      return;
    }

    if (adminData.role !== "Admin") {
      res.status(403).json({ message: "Admin access required" });
      return;
    }

    req.admin = adminData;
    next();
  } catch (error: unknown) {
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 ||
        error.response?.status === 403 ||
        error.response?.status === 404)
    ) {
      res
        .status(401)
        .json({ message: "Invalid or expired authentication token" });
      return;
    }

    next(error);
  }
}
