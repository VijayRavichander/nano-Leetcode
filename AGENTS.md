# AGENTS.md

## Cursor Cloud specific instructions

### Overview

LiteCode is a LeetCode-style coding platform built as a Turborepo monorepo with Bun workspaces. The main app is a Next.js 15 web app in `apps/web` backed by PostgreSQL via Prisma (`packages/db`).

### Runtime

- **Node.js 20.x** and **Bun 1.2.2** are required. Bun is installed at `~/.bun/bin/bun`.
- nvm default is set to Node 20. If you open a new shell, run `source ~/.nvm/nvm.sh` to pick up nvm.

### Database

- PostgreSQL 16 runs locally. Start it with `sudo pg_ctlcluster 16 main start` if it's not running.
- Database: `litecodedb`, user: `litecode`, password: `litecodedev` on `localhost:5432`.
- The environment variable `DATABASE_URL` may be injected from VM secrets pointing to a cloud Neon database. To use the local database, override it explicitly: `DATABASE_URL="postgresql://litecode:litecodedev@localhost:5432/litecodedb?schema=public"`.
- Prisma reads `DATABASE_URL` from `packages/db/.env`. That file is set up to point to the local database.

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

### Gotchas

- The only checked-in Prisma migration (`20260228170000_add_editorial_to_problem`) assumes tables already exist. On a fresh local database, use `prisma db push` instead of `prisma migrate deploy` to create the schema from scratch.
- The `DATABASE_URL` environment variable from VM secrets overrides the value in `packages/db/.env` at runtime. When running Prisma CLI or the dev server, explicitly set `DATABASE_URL` to the local value if the injected one points elsewhere.
- The dev server uses Turbopack (`next dev --turbopack`). The production build (`next build`) has a pre-existing issue rendering the `/_error` / `404` page. This does not affect local development.
