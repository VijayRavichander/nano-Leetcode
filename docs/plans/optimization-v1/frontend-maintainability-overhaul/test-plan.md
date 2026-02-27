# Test Plan

## Automated checks
1. `bun run lint`
2. `bun run check-types`

## Critical flow validation
1. Open `/problem/[problemId]` and verify problem details render.
2. Confirm editor hydrates code from persisted state or default template.
3. Click `Reset` and verify code returns to template + testcase state clears.
4. Click `Run` and verify testcase status tabs update.
5. Click `Submit` and verify submission flow opens submissions tab.
6. Infinite scroll in submissions tab should fetch next page once per cursor.
7. Open submission modal and verify runtime/memory/code details.
8. Unauthorized API responses should lead to sign-in UX.

## Responsive checks
1. Desktop split pane resizes and content remains stable.
2. Mobile layout keeps problem/editor/submission sections usable.
