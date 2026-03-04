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
- `deploy`: server bootstrap and deployment notes

## Prerequisites

Install these on your machine:

- `git`
- `node` `20.x`
- `bun`
- a Postgres database, local or remote

Check versions:

```bash
node -v
bun -v
```

Install workspace dependencies from the repo root:

```bash
bun install
```

## Env files

This repo currently uses two local env files.

### `packages/db/.env`

Put only database connection state here:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
```

### `apps/web/.env.local`

Put all web-app and external service secrets here:

```env
BETTER_AUTH_SECRET="replace-with-a-long-random-string"
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
  - Set `BETTER_AUTH_SECRET` in `apps/web/.env.local`
  - Use a long random string

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

### Required if you touch code execution or submissions

- Judge0 credentials
  - Populate `JUDGE0_URL`
  - Populate `JUDGE0_API_KEY`
  - Populate `JUDGE0_HOST`

These are used by:

- `apps/web/app/api/run/route.ts`
- `apps/web/app/api/submit/route.ts`
- `apps/web/app/api/submissionstatus/utils.ts`


### Required if you touch feedback email

- Resend API key
  - Populate `RESEND_API_KEY`
- Verified sender/domain in Resend
  - Populate `FEEDBACK_FROM_EMAIL`
- Destination inbox
  - Populate `FEEDBACK_TO_EMAIL`

Used by:

- `apps/web/app/api/feedback/route.ts`

## OAuth client setup guidance

You should provision OAuth credentials before starting auth-related work.

Minimum local assumptions from this repo:

- local app origin: `http://localhost:3000`
- auth route lives under: `/api/auth/*`

When creating Google and GitHub clients, use the local app origin above and the Better Auth callback path used by the app's auth routes.

If you are also testing against a deployed environment, provision separate production credentials rather than reusing the local ones.

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

## First local boot

From the repo root:

```bash
bun install
bunx prisma migrate deploy --schema packages/db/prisma/schema.prisma
bun run --cwd packages/db prisma:generate
bun run dev
```

Expected local app URL:

```text
http://localhost:3000
```

## Minimum smoke test

Before starting a task, verify:

1. The web app loads on `http://localhost:3000`
2. Prisma client generation completed without errors
3. The database is reachable through `DATABASE_URL`
4. If you are working on auth, login providers are configured
5. If you are working on submissions, Judge0 credentials are configured
6. If you are working on feedback, Resend credentials are configured
7. If you are working on admin generation, OpenAI credentials are configured

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

## Troubleshooting

### App boots but auth is broken locally

Check:

- `apps/web/.env.local` exists
- `BETTER_AUTH_SECRET` is set
- Google and GitHub client IDs and secrets are present if you are testing social login
- you are running on port `3000`, or you updated `apps/web/lib/auth-client.ts`

### Type errors or runtime errors from `@repo/db`

Usually means the Prisma client has not been generated yet.

Run:

```bash
bun run --cwd packages/db prisma:generate
```

### Database connection failures

Check `packages/db/.env` and verify `DATABASE_URL` points to a reachable Postgres instance.

### Submission APIs fail

Check the Judge0 env values in `apps/web/.env.local`.

### Feedback email fails

Check:

- `RESEND_API_KEY`
- `FEEDBACK_FROM_EMAIL`
- `FEEDBACK_TO_EMAIL`
- sender/domain verification status in Resend

