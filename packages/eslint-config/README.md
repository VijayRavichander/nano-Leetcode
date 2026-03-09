# `@repo/eslint-config`

`packages/eslint-config` contains the shared flat ESLint configurations used across the LiteCode monorepo.

## Goal

This package keeps linting behavior consistent across apps and packages while still allowing each workspace to opt into the config that matches its runtime and framework needs.

## Exports

- `@repo/eslint-config/base`
  Shared JavaScript and TypeScript defaults, Prettier compatibility, Turbo environment-variable checks, and repository-wide ignore rules.

- `@repo/eslint-config/next-js`
  Extends the base config with Next.js rules, Core Web Vitals guidance, and React Hooks coverage for the web app.

- `@repo/eslint-config/react-internal`
  Extends the base config with React and React Hooks rules for internal React packages that are not Next.js apps.

## Linting philosophy

The configs are tuned for monorepo development rather than maximal strictness at any cost.

- TypeScript recommended rules are enabled across the shared presets.
- Prettier conflicts are removed at the config layer.
- Turbo undeclared environment variable checks are included so workspace tasks stay explicit.
- `eslint-plugin-only-warn` keeps local iteration moving while still surfacing issues clearly.

## When to use which config

- Use `base` for non-React utilities and tooling packages.
- Use `next-js` for Next.js applications.
- Use `react-internal` for shared React libraries that do not need Next.js-specific rules.
