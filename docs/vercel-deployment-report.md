# Vercel Deployment Report

## Scope

This report covers how to deploy the current `nano-leetcode` repository to Vercel as of March 7, 2026, based on the code and docs in this repo.

Repo facts verified for this report:

- Monorepo managed with Bun workspaces and Turborepo
- Main deployable app is Next.js in `apps/web`
- Shared database package is Prisma in `packages/db`
- Root package manager is `bun@1.2.2`
- Repo recommends Node `20.x`

## Executive Summary

This project is a reasonable Vercel candidate, but it is not deploy-ready without a small amount of deployment hardening.

The main requirements are:

1. Deploy only the `apps/web` Next.js app.
2. Configure all runtime secrets in Vercel project environment variables.
3. Generate the Prisma client during the build.
4. Point auth and OAuth callback URLs at the final Vercel domain.
5. Fix one code-level production issue before relying on previews or moving to a new custom domain: [`apps/web/lib/auth-client.ts`](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/lib/auth-client.ts) hardcodes the production origin to `https://litecode.vijayravichander.com`.

The repository also has a few deployment risks:

- `SETUP.md` is out of date for the build failure it mentions.
- Chat uses `DEEPINFRA_API_KEY`, but that variable is not documented in `SETUP.md`.
- `check-types` currently depends on generated `.next/types` files and fails if run before a Next build.
- Prisma migrations should not be run automatically against the shared Neon database described in repo docs.

## Current Architecture

### Web app

The deployed application is the Next.js app in [`apps/web`](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web).

Important scripts from [`apps/web/package.json`](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/package.json):

- `dev`: `next dev --turbopack --port 3000`
- `build`: `next build`
- `start`: `next start -p 3013`

### Shared packages

The web app imports workspace packages:

- `@repo/db`
- `@repo/ui`
- shared config packages

That means Vercel must build in a monorepo-aware way, not as a standalone single-folder app with no workspace access.

### Database layer

Prisma lives in [`packages/db/prisma/schema.prisma`](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/packages/db/prisma/schema.prisma) and reads `DATABASE_URL` from environment.

The Prisma client is re-exported from [`packages/db/index.ts`](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/packages/db/index.ts).

This means:

- `DATABASE_URL` must be present in Vercel
- Prisma client generation must succeed during install/build
- the deployed app needs direct network access to the Postgres instance

## Recommended Vercel Topology

## 1. Project layout in Vercel

Recommended approach:

- Import the full Git repository into Vercel
- Create one Vercel project for the `apps/web` app
- Set the Vercel Root Directory to `apps/web`

Why:

- Vercel handles Next.js best when the project points at the actual app directory
- the repo is a monorepo, but only one app needs to be deployed
- shared workspace packages can still be resolved from the repository checkout

## 2. Runtime version

Set Node.js to `20.x` in Vercel.

Reason:

- the repo recommends Node 20
- Bun `1.2.2` is already pinned in the root `packageManager`
- staying aligned with repo assumptions reduces runtime drift

## 3. Package manager

Use Bun.

Reason:

- the lockfile is `bun.lock`
- root `package.json` pins `bun@1.2.2`
- setup docs assume Bun for install and Prisma tasks

## Recommended Vercel Settings

These are the settings I would use first.

### Root Directory

`apps/web`

### Framework Preset

`Next.js`

### Node.js Version

`20.x`

### Install Command

Use one of these approaches.

Preferred if Vercel auto-installs successfully with Bun:

- leave Install Command empty and let Vercel detect Bun

Fallback if workspace install or Prisma generation is inconsistent:

```bash
cd ../.. && bun install --frozen-lockfile && bun run --cwd packages/db prisma:generate
```

### Build Command

Preferred explicit build command:

```bash
cd ../.. && bun run --cwd packages/db prisma:generate && bunx turbo run build --filter=web
```

Why this command:

- ensures Prisma client generation happens before the Next build
- builds only the `web` target rather than every workspace task unnecessarily
- runs from monorepo root where Turbo and the lockfile live

### Output Directory

Leave unset for Next.js unless Vercel asks for it.

## Required Environment Variables

Vercel environment variables replace the local split between `packages/db/.env` and `apps/web/.env.local`.

In Vercel, set these on the `web` project.

### Required for core app startup

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`

### Required for production auth with OAuth

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

### Required for code execution APIs

- `JUDGE0_URL`
- `JUDGE0_API_KEY`
- `JUDGE0_HOST`

### Required for AI-backed admin and chat features

- `OPENAI_API_KEY`
- `DEEPINFRA_API_KEY`

### Required for feedback email delivery

- `RESEND_API_KEY`
- `FEEDBACK_FROM_EMAIL`
- `FEEDBACK_TO_EMAIL`

### Development-only variables that should not be enabled in production

- `NEXT_PUBLIC_DEV_AUTH_BYPASS=false`
- do not set `NEXT_PUBLIC_DEV_AUTH_DUMMY_NAME`
- do not set `NEXT_PUBLIC_DEV_AUTH_DUMMY_EMAIL`

## Environment Variable Notes

### `BETTER_AUTH_URL`

Set this to the final external base URL, for example:

```env
BETTER_AUTH_URL=https://your-app.vercel.app
```

If you later attach a custom domain, update it to that domain.

### `DATABASE_URL`

Set this directly in Vercel. Do not rely on `packages/db/.env` in production.

### `FEEDBACK_FROM_EMAIL`

This must be a verified sender/domain in Resend for production, per [`apps/web/README.md`](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/README.md).

### `DEEPINFRA_API_KEY`

This is required by [`apps/web/app/api/chat/lib.ts`](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/app/api/chat/lib.ts), but it is currently undocumented in `SETUP.md`.

## Auth and Domain Requirements

## 1. Current hardcoded production origin

[`apps/web/lib/auth-client.ts`](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/lib/auth-client.ts) currently does this:

- uses `http://localhost:3000` in development
- uses `https://litecode.vijayravichander.com` in production

This is a deployment blocker for:

- preview deployments on Vercel
- production deployments to any other domain
- smooth cutover to a new Vercel custom domain

### Recommended fix

Replace the hardcoded production URL with an environment variable, typically something like:

- `NEXT_PUBLIC_APP_URL`

or derive it from Vercel-provided environment values where appropriate.

Without this change, the browser auth client will still target `litecode.vijayravichander.com` even if the app is deployed somewhere else.

## 2. OAuth callback URLs

For Google and GitHub OAuth, you will need to update provider settings to include the Vercel URL.

Typical values:

- production: `https://your-domain.com/api/auth/...`
- preview: either disable OAuth testing on previews or explicitly register preview callback URLs if your provider setup allows it

The exact callback path is governed by Better Auth's Next.js handler in [`apps/web/app/api/auth/[...all]/route.ts`](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/app/api/auth/[...all]/route.ts).

## Database and Prisma Strategy

## 1. Prisma client generation

This app depends on the generated Prisma client from `packages/db`.

Recommended:

- run `bun run --cwd packages/db prisma:generate` during the Vercel build

## 2. Prisma migrations

Do not automatically run `prisma migrate deploy` in Vercel for this repo if you are using the shared Neon database documented in [`SETUP.md`](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/SETUP.md).

Reason:

- repo instructions explicitly say migration deploy fails on the shared database because migration history is not aligned

Safer production policy:

- use an already prepared database
- manage schema changes out-of-band
- keep Vercel deployment limited to Prisma client generation

## Build and Verification Findings

I ran local verification from this workspace to identify likely deployment issues.

### 1. `bun run build`

Observed result:

- failed in this environment because Next tried to fetch Google Fonts during build and the sandbox could not resolve `fonts.googleapis.com`

Files involved:

- [`apps/web/app/layout.tsx`](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/app/layout.tsx)

What this means:

- this specific failure is environment-dependent
- Vercel usually has outbound network access, so this may not fail there
- however, the build currently depends on an external Google Fonts fetch at build time, which is a deployment reliability risk

Recommendation:

- prefer self-hosted fonts or `next/font/local` if you want deterministic builds

### 2. `bun run check-types`

Observed result:

- failed because [`apps/web/tsconfig.json`](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/tsconfig.json) includes `.next/types/**/*.ts`, but those generated files were not present

What this means:

- standalone type-checking before a successful Next build is currently unreliable
- if you add CI in Vercel or GitHub Actions, do not assume `bun run check-types` can run cleanly from a cold workspace without first generating `.next/types`

### 3. `SETUP.md` drift

`SETUP.md` says `bun run build` has a pre-existing `<Html>` import error on `/_error`.

I did not observe that error in this workspace. The actual build failure encountered here was the Google Fonts fetch failure instead.

Conclusion:

- deployment documentation in the repo has drifted and should be updated

## Vercel Deployment Procedure

## Phase 1: Pre-deployment fixes

Before connecting the repo to Vercel, make these code and docs updates:

1. Replace the hardcoded production URL in [`apps/web/lib/auth-client.ts`](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/lib/auth-client.ts) with an environment-based value.
2. Add `DEEPINFRA_API_KEY` to setup and deployment docs.
3. Optionally harden fonts in [`apps/web/app/layout.tsx`](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/app/layout.tsx) to avoid build-time external fetch dependency.
4. Optionally fix the `check-types` workflow so it does not require pre-existing `.next/types` output.

## Phase 2: Vercel project creation

1. Import the repository into Vercel.
2. Create a project for the `web` app.
3. Set Root Directory to `apps/web`.
4. Set Node.js version to `20.x`.
5. Ensure Bun is detected as the package manager.
6. Add the environment variables listed above for Production, Preview, and Development as needed.

## Phase 3: Build configuration

If Vercel auto-detection is insufficient, set:

Install Command:

```bash
cd ../.. && bun install --frozen-lockfile && bun run --cwd packages/db prisma:generate
```

Build Command:

```bash
cd ../.. && bun run --cwd packages/db prisma:generate && bunx turbo run build --filter=web
```

## Phase 4: Domain and auth setup

1. Deploy to the default `*.vercel.app` domain first.
2. Set `BETTER_AUTH_URL` to that exact deployed URL.
3. Update Google and GitHub OAuth app settings to include the correct callback/base URLs.
4. Validate sign-in flows.
5. Only after auth works, attach the custom domain.
6. Update `BETTER_AUTH_URL` again if the production domain changes.

## Phase 5: Post-deploy validation

After the first deployment, validate:

1. Landing page renders successfully.
2. Problem pages load data correctly from Postgres.
3. Better Auth session creation works.
4. Google login works.
5. GitHub login works.
6. Judge0-backed run/submit APIs work.
7. Feedback email sends through Resend.
8. Admin problem generation works with `OPENAI_API_KEY`.
9. Chat works with `DEEPINFRA_API_KEY`.

## Risks and Mitigations

### Risk: hardcoded auth origin breaks previews

Impact:

- sign-in can silently point to the wrong domain

Mitigation:

- move browser auth base URL to env-backed configuration

### Risk: Prisma generate omitted from build

Impact:

- deployment can fail at compile time or runtime when `@repo/db` is imported

Mitigation:

- explicitly run `bun run --cwd packages/db prisma:generate` in Vercel build steps

### Risk: shared database migration policy is unsafe

Impact:

- automatic migration step can fail deployments or damage the expected shared DB state

Mitigation:

- do not run `prisma migrate deploy` automatically in Vercel for this repo

### Risk: production features depend on undocumented envs

Impact:

- chat or other feature areas fail only after deployment

Mitigation:

- document and set `DEEPINFRA_API_KEY`

### Risk: build depends on external font fetch

Impact:

- intermittent build failures

Mitigation:

- self-host fonts or use local font assets

## Overall Assessment

Current status:

- deployable to Vercel with configuration work
- not cleanly production-ready without at least one code fix for auth origin handling

Confidence level:

- medium

Reason for medium instead of high:

- the core app structure matches Vercel well
- but auth domain handling, Prisma generation, and env documentation need cleanup
- local build verification was partially limited by sandbox network restrictions

## Recommended Next Actions

1. Fix [`apps/web/lib/auth-client.ts`](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/lib/auth-client.ts) to use env-based origin resolution.
2. Add a repo-level Vercel deployment doc or keep this file as the canonical deployment guide.
3. Decide whether preview deployments should support OAuth or remain non-auth test environments.
4. Add a deterministic Prisma generation step to Vercel build settings.
5. Clean up `SETUP.md` so local and deployment instructions match the current codebase.
