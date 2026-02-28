import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/errors";

export const notFoundHandler = (
  _req: Request,
  res: Response
) => {
  res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  const message = error instanceof Error ? error.message : "Internal Server Error";
  console.error("Unhandled backend error:", error);
  res.status(500).json({ message });
};
