# AGENTS.md

## Cursor Cloud specific instructions

### Setup reference

All setup steps, env file layout, and day-to-day commands are documented in `SETUP.md`. Follow that file first.

### Non-obvious gotchas

- **Bun on PATH**: After the update script runs, `~/.bun/bin/bun` is available. Ensure `export PATH="$HOME/.bun/bin:$PATH"` is set (the update script handles this via `source ~/.bashrc`).
- **Prisma migrate deploy will fail** on the shared Neon database because the schema is already populated without migration history. Just run `bun run --cwd packages/db prisma:generate` — do not run `prisma migrate deploy`.
- **`bun run build` has a pre-existing error** (`<Html>` import on `/_error`). This does not affect the dev server. Use `bun run dev` for development.
- **Dev auth bypass**: With `NEXT_PUBLIC_DEV_AUTH_BYPASS="true"`, OAuth credentials (Google/GitHub) are not required. The app creates a dummy "Local Dev" user automatically.
- **Node version**: The repo declares `>=18` in `engines` and recommends Node 20.x. Use `source ~/.nvm/nvm.sh && nvm use 20` if the shell defaults to another version.
