## Feedback Email

The landing-page feedback button sends email through Resend from the Next.js app route at `app/api/feedback/route.ts`.

Required environment variables:

- `RESEND_API_KEY`
- `FEEDBACK_FROM_EMAIL`
- `FEEDBACK_TO_EMAIL`

Notes:

- `FEEDBACK_FROM_EMAIL` must be a verified sender or domain in Resend for production.
- `onboarding@resend.dev` is useful for Resend testing, not production delivery.
- Anonymous feedback protection is process-local in-memory throttling plus a honeypot field, not a distributed global rate limit.
