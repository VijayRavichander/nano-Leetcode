"use client";

import { authClient } from "@/lib/auth-client";

const DEV_AUTH_USER_ID = "00000000-0000-4000-8000-000000000001";
const DEV_AUTH_DEFAULT_NAME = "Local Dev";
const DEV_AUTH_DEFAULT_EMAIL = "dev@litecode.local";

type AppClientSession = {
  data: {
    session: {
      userId: string;
    };
    user: {
      email: string;
      image: string | null;
      name: string;
    };
  } | null;
  error: unknown;
  isPending: boolean;
};

export function isDevAuthBypassEnabledClient() {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === "true"
  );
}

export function useAppSession(): AppClientSession {
  const session = authClient.useSession();

  if (!isDevAuthBypassEnabledClient()) {
    return {
      data: session.data
        ? {
            session: {
              userId: session.data.session.userId,
            },
            user: {
              email: session.data.user.email,
              image: session.data.user.image ?? null,
              name: session.data.user.name,
            },
          }
        : null,
      error: session.error,
      isPending: session.isPending,
    };
  }

  return {
    data: {
      session: {
        userId: DEV_AUTH_USER_ID,
      },
      user: {
        email: process.env.NEXT_PUBLIC_DEV_AUTH_DUMMY_EMAIL || DEV_AUTH_DEFAULT_EMAIL,
        image: null,
        name: process.env.NEXT_PUBLIC_DEV_AUTH_DUMMY_NAME || DEV_AUTH_DEFAULT_NAME,
      },
    },
    error: null,
    isPending: false,
  };
}
