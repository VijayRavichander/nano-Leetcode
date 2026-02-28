const parseOrigins = (value: string | undefined): string[] => {
  if (!value) {
    return ["http://localhost:3000", "https://litecode.vijayravichander.com"];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const parsePublicKey = (value: string | undefined): string => {
  if (!value) return "";
  return value.replace(/\\n/g, "\n").trim();
};

export const env = {
  port: Number(process.env.PORT || 3012),
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS),

  judge0: {
    url: process.env.JUDGE0_URL || "",
    apiKey: process.env.JUDGE0_API_KEY || "",
    host: process.env.JUDGE0_HOST || "",
  },

  auth: {
    clerkJwtPublicKey: parsePublicKey(process.env.CLERK_AUTH_JWT),
  },
};

export const requireEnv = (name: string, value: string) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};
