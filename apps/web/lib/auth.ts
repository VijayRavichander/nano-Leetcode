import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@repo/db";
 
export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "mongodb",
    }),
    socialProviders: {
        google: {
            clientId: String(process.env.GOOGLE_CLIENT_ID) || "",
            clientSecret: String(process.env.GOOGLE_CLIENT_SECRET) || "",
        },
        github: {
            clientId: String(process.env.GITHUB_CLIENT_ID) || "",
            clientSecret: String(process.env.GITHUB_CLIENT_SECRET) || "",
        },
    },
    emailAndPassword: {
        enabled: true, 
    },
    advanced: {
        database: {
            generateId: false,
        },
    },
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";