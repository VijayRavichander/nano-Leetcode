# `web`

`apps/web` is the main LiteCode product surface: a Next.js 15 application for interview-style coding practice. It combines the landing experience, problem discovery, a multi-pane solving workspace, authenticated submission history, profile analytics, feedback collection, and admin tooling for authoring problems.

## Product areas

- **Landing page**
  Presents LiteCode as a focused interview-prep product with a quieter editorial visual style.

- **Problem list**
  Renders the current catalog of coding challenges from PostgreSQL through Prisma.

- **Problem workspace**
  Hosts the core solving experience with resizable panels for the prompt, editor, results, editorial, notes, submissions, and AI assistance.

- **Profile**
  Shows recent submission history and a contribution-style heatmap of activity.

- **Admin**
  Supports creating new problems manually or from AI-generated drafts.

## Core capabilities

- **Code editing**
  Monaco powers the in-browser editor, with language-aware starter code loaded per problem.

- **Run and submit flows**
  The app sends visible-test-case runs and hidden-test-case submissions through Judge0-backed API routes, then stores submission records and performance metrics.

- **Authenticated practice**
  Better Auth handles user accounts, sessions, and protected API routes such as submissions, profile, chat, and contribution data.

- **AI assistance**
  The workspace includes a problem-aware chat pane that sends the active prompt, language, and current code to a model endpoint so responses stay grounded in the active problem.

- **Feedback delivery**
  The feedback route sends structured emails through Resend, includes request context, and applies anonymous rate limiting plus honeypot spam protection.

## Architecture notes

- The app uses the **App Router** and keeps most product surfaces in route groups under `app/(site)` and `app/(workspace)`.
- The solving experience is built around a **panel-based workspace layout** with client-side state stores for panel selection, code, execution state, and AI chat history.
- Shared persistence is provided by [`@repo/db`](../../packages/db/README.md), which exposes the Prisma client and generated database types.
- Shared visual primitives come from [`@repo/ui`](../../packages/ui), while app-specific composition lives inside `apps/web/components`.

## Important routes

- `/` for the landing page
- `/problem` for the problem catalog
- `/problem/[problemId]` for the coding workspace
- `/profile` for user activity and recent submissions
- `/signin` for authentication
- `/admin/add-problem` for content authoring

## API surface

The web app owns the main product API routes used by the frontend:

- problem lookup
- code run and submit workflows
- submission history and polling
- profile summary and contribution data
- authentication callbacks
- AI chat
- admin problem generation and creation
- feedback intake

## Design direction

The UI favors a restrained, editorial visual language over a generic dashboard style. The current system is documented in [`docs/design-system/litecode-design-system.md`](../../docs/design-system/litecode-design-system.md).
