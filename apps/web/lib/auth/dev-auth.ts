import { db, type Session, type User } from "@repo/db";
import type { NextRequest } from "next/server";

export const DEV_AUTH_USER_ID = "00000000-0000-4000-8000-000000000001";

const DEV_AUTH_BYPASS_FLAG = "true";
const DEV_AUTH_DEFAULT_NAME = "Local Dev";
const DEV_AUTH_DEFAULT_EMAIL = "dev@litecode.local";

export type AppSession = {
  session: Session;
  user: User;
};

export function isDevAuthBypassEnabled() {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === DEV_AUTH_BYPASS_FLAG
  );
}

export function getDevAuthProfile() {
  return {
    name: process.env.NEXT_PUBLIC_DEV_AUTH_DUMMY_NAME || DEV_AUTH_DEFAULT_NAME,
    email: process.env.NEXT_PUBLIC_DEV_AUTH_DUMMY_EMAIL || DEV_AUTH_DEFAULT_EMAIL,
  };
}

export async function ensureDevAuthUser() {
  const now = new Date();
  const profile = getDevAuthProfile();

  return db.user.upsert({
    where: { id: DEV_AUTH_USER_ID },
    create: {
      id: DEV_AUTH_USER_ID,
      createdAt: now,
      updatedAt: now,
      email: profile.email,
      emailVerified: true,
      image: null,
      name: profile.name,
      type: "user",
    },
    update: {
      email: profile.email,
      image: null,
      name: profile.name,
      updatedAt: now,
    },
  });
}

export function buildDevSession(user: User, req?: NextRequest): AppSession {
  const now = new Date();

  return {
    session: {
      id: "dev-auth-session",
      createdAt: now,
      updatedAt: now,
      expiresAt: new Date("2099-01-01T00:00:00.000Z"),
      impersonatedBy: null,
      ipAddress: req?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
      token: "dev-auth-bypass",
      userAgent: req?.headers.get("user-agent") || null,
      userId: user.id,
    },
    user,
  };
}
