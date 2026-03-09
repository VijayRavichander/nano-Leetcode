# `@repo/db`

`packages/db` is LiteCode’s persistence layer. It owns the Prisma schema, generated client boundary, and the operational scripts used to move and repair data.

## Responsibilities

- define the PostgreSQL schema in Prisma
- expose a shared Prisma client singleton for the monorepo
- provide generated database types to consuming packages
- hold one-off data migration and backfill scripts

## Data model

The current schema is centered on the product’s main workflows:

- **Users, sessions, accounts, verifications**
  Authentication and session persistence for Better Auth.

- **Problems**
  Coding challenges, including metadata, constraints, editorial content, visible and hidden test cases, language templates, and full execution scaffolding.

- **Submissions**
  Stored user attempts, Judge0 tokens, status, runtime, and memory metrics tied back to both users and problems.

This package is the source of truth for how LiteCode’s product entities relate to each other.

## Runtime contract

The package exports a shared Prisma client from `index.ts` and re-exports Prisma-generated types from `@prisma/client`.

That gives consumers a single place to import:

- `db`
- `prisma`
- generated model and enum types

The client is cached in development to avoid exhausting connections during hot reload.

## Operational scripts

### MongoDB to PostgreSQL migration

`scripts/migrate-mongo-to-postgres.ts` is a guarded migration path from the legacy MongoDB shape into the current PostgreSQL schema.

The script is designed to be conservative:

- it supports dry runs
- it writes snapshot artifacts
- it validates uniqueness and foreign-key assumptions before writes
- it can refuse to run against a non-empty target
- it verifies counts and relationship integrity after migration

### Editorial backfill

`scripts/backfill-editorials.ts` backfills markdown editorials for a curated set of stored problems. It is a targeted content-repair script rather than a general seeding mechanism.

## Boundaries

This package should stay focused on persistence concerns. Business logic that is specific to a route, page, or UI flow belongs in the consuming workspace, even if it reads or writes through `db`.
