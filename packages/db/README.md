# db

## Prisma

```bash
bun run prisma:validate
bun run prisma:generate
```

## MongoDB -> Neon Postgres migration

Migration script:
`packages/db/scripts/migrate-mongo-to-postgres.ts`

Required env vars:

```bash
export MIGRATION_SOURCE_MONGODB_URI='mongodb+srv://...'
export MIGRATION_SOURCE_MONGODB_DB='litecode'
export DATABASE_URL='postgresql://...'
```

Dry-run (default, writes nothing):

```bash
bun run migrate:mongo-to-postgres --dry-run
```

Execute migration:

```bash
bun run migrate:mongo-to-postgres --execute --batch-size=200
```

Safety defaults:
- writes an immutable snapshot manifest and per-collection dumps in `migration-artifacts/mongo-to-postgres`
- validates source uniqueness and foreign-key relationships before any target writes
- refuses to run if target PostgreSQL tables are not empty (unless `--require-empty-target=false`)
- verifies post-migration row counts and FK integrity
