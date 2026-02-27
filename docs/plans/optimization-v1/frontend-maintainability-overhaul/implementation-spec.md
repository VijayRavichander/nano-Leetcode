# Implementation Spec

## 1. Typed Domain Contracts
- Added `apps/web/lib/types/problem.ts` for problem/editor-facing models.
- Added `apps/web/lib/types/submission.ts` for run/submission/list/status models.

## 2. API Layer Standardization
- Added shared API client in `apps/web/lib/api/client.ts`.
- Added domain APIs:
  - `apps/web/lib/api/problem.ts`
  - `apps/web/lib/api/execution.ts`
  - `apps/web/lib/api/submission.ts`
- Unified result shape: `ApiResult<T>` with `ok` discriminant.

## 3. Store Redesign
- `apps/web/lib/store/codeStore.ts`
  - Persisted code + language state only.
  - Added selector hooks (`useCurrentCode`, `useCurrentSlug`, `useCodeForSlug`).
- Added `apps/web/lib/store/executionStore.ts`
  - Non-persisted execution state (`isRunning`, testcase results by slug).
- Replaced UI store with `useProblemUIStore` in `apps/web/lib/store/uiStore.ts`.

## 4. Problem Page Decomposition
- Added `apps/web/lib/problem/session.ts` to initialize slug/problem/code session state.
- Added `apps/web/lib/hooks/useProblemData.ts` for problem loading + state bootstrap.
- Added `apps/web/lib/hooks/useResizablePane.ts` for split-pane resize behavior.
- Added `apps/web/components/problem/ProblemWorkspaceLayout.tsx` for page layout composition.
- Updated `apps/web/app/problem/[problemId]/page.tsx` to orchestration-only page component.

## 5. Submission/Editor/UI Refactor
- Typed and refactored:
  - `apps/web/components/CodeEditor.tsx`
  - `apps/web/components/ProblemDescription.tsx`
  - `apps/web/components/submission/SubmissionResult.tsx`
  - `apps/web/components/submission/SubmissionTab.tsx`
  - `apps/web/components/submission/submissionCard.tsx`
  - `apps/web/components/submission/SubmissionDetailsModal.tsx`
  - `apps/web/components/Navbar.tsx`
  - `apps/web/components/ActionDropDown.tsx`
  - `apps/web/components/Problems.tsx`

## 6. Contract and Key Stability Improvements
- Replaced array index keys with deterministic keys where feasible.
- Removed targeted `any`/`@ts-ignore` patterns in problem/editor/submission flows.
