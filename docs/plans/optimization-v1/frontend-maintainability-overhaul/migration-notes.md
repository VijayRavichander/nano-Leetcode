# Migration Notes

## Store migration
- Old store exports (`useTab`, `useNavBarStore`, `useRunButtonState`, etc.) are replaced with:
  - `useProblemUIStore`
  - `useExecutionStore`
  - selector hooks from `useCodeStore`
- Consumers should avoid imperative getter calls from store methods in render paths.

## API access migration
- Avoid direct `axios` usage in feature components.
- Use `apps/web/lib/api/*` modules for all problem/editor/submission requests.

## Type migration
- Prefer models from `apps/web/lib/types/problem.ts` and `apps/web/lib/types/submission.ts`.
- Avoid `any` in runtime-facing components.
