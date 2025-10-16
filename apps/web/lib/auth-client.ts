import { createAuthClient } from "better-auth/react";

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://litecode.vijayravichander.com" 
  : "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: BASE_URL,
});