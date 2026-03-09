# `common`

`packages/common` is the repository’s shared contract package for framework-agnostic types and schemas.

## Purpose

This package exists to hold definitions that need to be reused across workspace boundaries without pulling in app-specific code. It is the right place for:

- shared TypeScript types
- Zod schemas used as cross-package contracts
- lightweight serialization-safe utilities tied to those contracts

It is not intended for React components, database clients, route handlers, or browser-only logic.

## Current status

The package is intentionally small today. Its public surface is limited and serves as a placeholder for shared contracts as the monorepo grows.

Current export:

- `common/types`

## Design guidance

When adding code here:

- keep the package runtime-light
- prefer pure data contracts over behavior
- avoid importing from `apps/web`
- avoid coupling shared types to Prisma or Next.js unless that dependency is explicitly part of the contract

In practice, this package should make other workspaces easier to depend on, not harder to untangle later.
