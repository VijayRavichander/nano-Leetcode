# Frontend Maintainability Overhaul

## Goals
- Reduce frontend complexity in problem/editor/submission flows.
- Replace ad-hoc API calls with a typed client layer.
- Split and simplify state management to reduce unnecessary rerenders.
- Remove unsafe typing patterns in core runtime UI modules.

## Scope
- `apps/web/app/problem/[problemId]/page.tsx`
- `apps/web/components/CodeEditor.tsx`
- `apps/web/components/ProblemDescription.tsx`
- `apps/web/components/submission/*`
- `apps/web/components/Navbar.tsx`
- `apps/web/lib/store/*`
- `apps/web/lib/api/*`
- `apps/web/lib/hooks/*`
- `apps/web/lib/problem/session.ts`

## Non-goals
- Backend execution and Judge0 orchestration redesign.
- Prisma schema changes.
- Product-level feature additions.
