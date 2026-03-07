import { createAuthClient } from "better-auth/react";

const getAuthBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl) {
    return configuredUrl;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return undefined;
};

const baseURL = getAuthBaseUrl();

export const authClient = createAuthClient(
  baseURL ? { baseURL } : {}
);
