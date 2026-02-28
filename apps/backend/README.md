# backend

Production-style Express backend with layered structure:
- `src/config`: environment configuration
- `src/routes`: route composition
- `src/controllers`: HTTP handlers
- `src/services`: external integrations/domain services
- `src/middleware`: auth and error handling
- `src/lib`: shared helpers and DB wiring

To install dependencies:

```bash
bun install
```

To run in development:

```bash
bun run dev
```

Typecheck:

```bash
bun run check-types
```

This project was created using `bun init` in bun v1.2.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
