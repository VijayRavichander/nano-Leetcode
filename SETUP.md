# Setup

This document is the onboarding baseline for any engineer or agent working in this repository. Follow it before making code changes.

## What this repo is

- Monorepo managed with Bun workspaces and Turborepo
- Main app: Next.js in `apps/web`
- Shared database package: Prisma in `packages/db`
- Package manager pinned in the repo: `bun@1.2.2`
- Node engine declared by the repo: `>=18`

Recommended local runtime:

- Node.js `20.x`
- Bun `1.2.2` or a compatible newer Bun if you know why you are deviating
- Postgres reachable through `DATABASE_URL`

## Before you write code

Do these first:

1. Install Node.js and Bun.
2. Create the required env files in the correct directories.
3. Provision the external services this app depends on.
4. Apply Prisma migrations to your database.
5. Generate the Prisma client.
6. Start the app and confirm the basic flows work.

Do not start feature work until step 5 is done. The app imports `@repo/db`, and that depends on the generated Prisma client being available.

## Repo layout

- `apps/web`: Next.js application
- `packages/db`: Prisma schema, Prisma client package, migration scripts

## Prerequisites

Install these on your machine:

- `git`
- `node` `20.x`
- `bun`
- a Postgres database, local or remote

## Env files

This repo currently uses two local env files.

### `packages/db/.env`

Put only database connection state here:

```env
DATABASE_URL=""
```

### `apps/web/.env.local`

Put all web-app and external service secrets here:

```env
BETTER_AUTH_SECRET=""
BETTER_AUTH_URL=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
JUDGE0_URL=""
JUDGE0_API_KEY=""
JUDGE0_HOST=""
OPENAI_API_KEY=""
RESEND_API_KEY=""
FEEDBACK_FROM_EMAIL=""
FEEDBACK_TO_EMAIL=""
NEXT_PUBLIC_DEV_AUTH_BYPASS="false"
NEXT_PUBLIC_DEV_AUTH_DUMMY_NAME="Local Dev"
NEXT_PUBLIC_DEV_AUTH_DUMMY_EMAIL="dev@litecode.local"
```

### Env placement summary

- `packages/db/.env`
  - `DATABASE_URL`
- `apps/web/.env.local`
  - `BETTER_AUTH_SECRET`
  - `BETTER_AUTH_URL`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`
  - `JUDGE0_URL`
  - `JUDGE0_API_KEY`
  - `JUDGE0_HOST`
  - `OPENAI_API_KEY`
  - `RESEND_API_KEY`
  - `FEEDBACK_FROM_EMAIL`
  - `FEEDBACK_TO_EMAIL`
  - `NEXT_PUBLIC_DEV_AUTH_BYPASS`
  - `NODE_ENV`

Notes:

- `DATABASE_URL` belongs in `packages/db/.env`, not in `apps/web/.env.local`.
- `BETTER_AUTH_SECRET` is listed in `turbo.json` as part of the repo's global env contract. Treat it as required for auth setup.
- Local development assumes the app runs on `http://localhost:3000`. That is hardcoded in `apps/web/lib/auth-client.ts`.
- If you change the local port, update `apps/web/lib/auth-client.ts` or auth flows will break.
- `NEXT_PUBLIC_DEV_AUTH_BYPASS="true"` enables the development dummy-user auth bypass when `NODE_ENV=development`.
- Do not commit real secrets to the repo.

## External services to provision

This is the list of external accounts, clients, and keys a new developer or agent should have before serious feature work.

### Required for all meaningful local development

- Postgres database
  - Needed by Prisma and Better Auth
  - Wired through `packages/db/.env`

- Better Auth secret
  - Set `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` in `apps/web/.env.local`

### Required if you touch login or protected flows

- Google OAuth client
  - Populate `GOOGLE_CLIENT_ID`
  - Populate `GOOGLE_CLIENT_SECRET`

- GitHub OAuth app/client
  - Populate `GITHUB_CLIENT_ID`
  - Populate `GITHUB_CLIENT_SECRET`

Repo detail:

- Auth is handled by Better Auth through `apps/web/app/api/auth/[...all]/route.ts`
- The browser auth client uses `http://localhost:3000` in development

## Database setup

After creating `packages/db/.env`, apply the checked-in Prisma migrations:

```bash
bunx prisma migrate deploy --schema packages/db/prisma/schema.prisma
```

Then generate the Prisma client:

```bash
bun run --cwd packages/db prisma:validate
bun run --cwd packages/db prisma:generate
```

This is the required generated client step before coding.

If the Prisma schema changes later, rerun:

```bash
bun run --cwd packages/db prisma:generate
```

## Day-to-day commands

From the repo root:

```bash
bun run dev
bun run build
bun run lint
bun run check-types
```

DB package commands:

```bash
bun run --cwd packages/db prisma:validate
bun run --cwd packages/db prisma:generate
```

## Cursor Cloud specific instructions

### Overview

LiteCode is a LeetCode-style coding platform built as a Turborepo monorepo with Bun workspaces. The main app is a Next.js 15 web app in `apps/web` backed by PostgreSQL via Prisma (`packages/db`).

### Runtime

- **Node.js 20.x** and **Bun 1.2.2** are required. Bun is installed at `~/.bun/bin/bun`.
- nvm default is set to Node 20. If you open a new shell, run `source ~/.nvm/nvm.sh` to pick up nvm.

### Database
- Prisma reads `DATABASE_URL` from `packages/db/.env`. Only use the neon database and not create a local database for yourself

### Env files

- `packages/db/.env` — contains `DATABASE_URL` for Prisma.
- `apps/web/.env.local` — contains auth secrets, API keys, and dev bypass flags. `NEXT_PUBLIC_DEV_AUTH_BYPASS="true"` skips OAuth login for local development.

### Day-to-day commands (from repo root)

See `SETUP.md` for the full list. Key commands:

- `bun run dev` — start Next.js dev server on port 3000
- `bun run lint` — ESLint across all packages
- `bun run check-types` — TypeScript type checking
- `bun run build` — production build (has a pre-existing `<Html>` import error on `/_error`; dev server works fine)
- `bun run --cwd packages/db prisma:generate` — regenerate Prisma client after schema changes
