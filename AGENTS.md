## Cursor Cloud specific instructions

### Overview

LiteCode is a LeetCode-style coding platform. Turborepo monorepo using Bun workspaces. See `SETUP.md` for full onboarding details.

| Service | Start command | Notes |
|---|---|---|
| Next.js web app | `bun run dev` (from repo root) | Runs on port 3000 via Turbopack |
| PostgreSQL | `sudo service postgresql start` | Must be running before the app |

### Key caveats

- **DATABASE_URL override**: The Cloud VM may inject a `DATABASE_URL` env var pointing to a remote Neon database. For local development, `packages/db/.env` should contain a local Postgres connection string (user `postgres`, database `litecode`, port 5432). Prisma reads the shell env var first; if the injected value causes issues, override it with `export DATABASE_URL=<local-connection-string>` before running Prisma or the dev server.
- **Prisma migrations**: The repo only has an incremental migration (`20260228170000_add_editorial_to_problem`) that assumes the full schema exists. For a fresh local database, use `bunx prisma db push --schema packages/db/prisma/schema.prisma` instead of `prisma migrate deploy`.
- **Dev auth bypass**: Set `NEXT_PUBLIC_DEV_AUTH_BYPASS="true"` in `apps/web/.env.local` to skip OAuth and auto-sign in as a dummy dev user. This is required for local development without OAuth credentials.
- **Build known issue**: `bun run build` may fail with `<Html> should not be imported outside of pages/_document` on the 404/error page. This is a pre-existing issue; the dev server (`bun run dev`) works fine.
- **Day-to-day commands**: `bun run lint`, `bun run check-types`, `bun run dev`, `bun run build` — all from repo root. See `SETUP.md` for full reference.
