import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

const unauthorized = (res: Response) =>
  res.status(401).json({ message: "Authorization Error" });

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : undefined;

  if (!token) {
    unauthorized(res);
    return;
  }

  try {
    const publicKey = env.auth.clerkJwtPublicKey;
    if (!publicKey) {
      unauthorized(res);
      return;
    }

    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    }) as JwtPayload;

    if (typeof decoded?.sub !== "string" || !decoded.sub) {
      unauthorized(res);
      return;
    }

    req.userId = decoded.sub;
    next();
  } catch {
    unauthorized(res);
  }
};
