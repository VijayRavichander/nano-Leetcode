# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

LiteCode is a LeetCode-clone monorepo (Turborepo + Bun) with a single Next.js 15 app (`apps/web`) and shared packages (`packages/db`, `packages/ui`, `packages/common`, `packages/eslint-config`, `packages/typescript-config`).

### Prerequisites

- **Bun 1.2.2** — specified by `packageManager` in root `package.json`
- **PostgreSQL 16** — required for `@repo/db` (Prisma ORM)
- **Node.js >= 18** — required by engines field

### Key commands

| Task | Command |
|---|---|
| Install deps | `bun install` |
| Generate Prisma client | `bun run --cwd packages/db prisma:generate` |
| Push schema to DB | `npx prisma db push --schema packages/db/prisma/schema.prisma` |
| Dev server | `bun run dev` (runs Next.js on port 3000 via Turbopack) |
| Lint | `bun run lint` |
| Type check | `bun run check-types` |
| Format | `bun run format` |

### Environment variables

The web app reads env vars from `apps/web/.env`. Required:
- `DATABASE_URL` — PostgreSQL connection string
- `BETTER_AUTH_SECRET` — any random string for auth sessions

Optional (features degrade gracefully without them):
- `JUDGE0_URL`, `JUDGE0_API_KEY`, `JUDGE0_HOST` — for code execution (Run/Submit)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth sign-in
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` — GitHub OAuth sign-in
- `OPENAI_API_KEY` — admin problem generation
- `RESEND_API_KEY`, `FEEDBACK_FROM_EMAIL`, `FEEDBACK_TO_EMAIL` — feedback emails

### Non-obvious notes

- The sign-in page UI only implements Google OAuth; email/password is enabled server-side (`lib/auth.ts`) but the sign-in page (`app/(site)/signin/page.tsx`) does not expose it.
- PostgreSQL must be running before `bun run dev` — the Prisma client connects on startup.
- After `bun install`, you must run `bun run --cwd packages/db prisma:generate` before the app can import `@prisma/client`.
- There are no automated test suites in this repo; validation is done via lint + type-check.
- The `turbo.json` lockfile warnings (`Unable to calculate transitive closures`) are cosmetic and do not affect functionality.
