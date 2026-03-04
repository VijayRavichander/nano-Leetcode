import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import {
  buildDevSession,
  ensureDevAuthUser,
  isDevAuthBypassEnabled,
  type AppSession,
} from "@/lib/auth/dev-auth";

export async function getServerSession(req: NextRequest): Promise<AppSession | null> {
  const session = (await auth.api.getSession(req)) as AppSession | null;

  if (session) {
    return session;
  }

  if (!isDevAuthBypassEnabled()) {
    return null;
  }

  const user = await ensureDevAuthUser();
  return buildDevSession(user, req);
}
