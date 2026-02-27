import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const DEFAULT_DATABASE_NAME = process.env.DATABASE_NAME || "litecode";

const resolveDatabaseUrl = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return undefined;
  }

  try {
    const parsed = new URL(databaseUrl);
    const hasMissingDatabasePath =
      (parsed.protocol === "mongodb:" || parsed.protocol === "mongodb+srv:") &&
      (!parsed.pathname || parsed.pathname === "/");

    if (hasMissingDatabasePath) {
      parsed.pathname = `/${DEFAULT_DATABASE_NAME}`;
      return parsed.toString();
    }

    return databaseUrl;
  } catch {
    // Preserve original value if URL parsing fails.
    return databaseUrl;
  }
};

const normalizedDatabaseUrl = resolveDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient(
    normalizedDatabaseUrl
      ? {
          datasources: {
            db: {
              url: normalizedDatabaseUrl,
            },
          },
        }
      : undefined
  );

export const db = prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export * from "@prisma/client";
