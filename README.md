# LiteCode

LiteCode is a LeetCode-style interview practice platform built as a Bun + Turborepo monorepo. The main app is a Next.js 15 workspace with a multi-pane coding environment, Judge0-powered code execution, Better Auth sign-in, Prisma/Postgres persistence, profile activity tracking, and AI-assisted practice flows.

## What it does

- Browse a curated set of interview problems.
- Solve problems inside a resizable multi-panel workspace.
- Run code against visible test cases and submit against hidden test cases.
- Review submission history, runtime, and memory metrics.
- Track recent activity on a profile heatmap.
- Use an AI assistant for hints and debugging help.
- Create new problems from the admin panel, including AI-generated drafts.

## Stack

- `Next.js 15` with the App Router
- `React 19`
- `TypeScript`
- `Bun` workspaces
- `Turborepo`
- `Prisma` + `PostgreSQL`
- `Better Auth`
- `Judge0` for code execution
- `OpenAI` for admin problem generation
- `DeepInfra` via the AI SDK for in-workspace chat
- `Resend` for feedback email delivery

## Monorepo layout

```text
.
|-- apps/
|   `-- web/                 # Main Next.js application
|-- packages/
|   |-- db/                  # Prisma schema, client, seed, migration scripts
|   |-- ui/                  # Shared UI primitives
|   |-- common/              # Shared types/helpers
|   |-- eslint-config/       # Shared ESLint config
|   `-- typescript-config/   # Shared TypeScript config
|-- docs/
|   |-- design-system/
|   `-- vercel-deployment-report.md
|-- SETUP.md
`-- turbo.json
```

## Quick start

### Prerequisites

- `Node.js 20.x`
- `Bun 1.2.2`
- A reachable PostgreSQL database

For the full setup contract and repo notes, see [`SETUP.md`](./SETUP.md).
