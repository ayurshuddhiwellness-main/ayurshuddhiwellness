# AyurShuddhi — Website Monorepo

Turborepo + npm workspaces monorepo for the AyurShuddhi Ayurvedic wellness brand website.

## Structure

```
ayurshuddhiwellness/
├── apps/
│   └── web/                 # Main marketing site (Next.js 15)
├── packages/
│   ├── config/              # Shared Tailwind + ESLint base configs
│   └── ui/                  # Shared React component library (scaffold)
├── turbo.json
└── package.json
```

## Getting Started

### Prerequisites
- Node.js >= 20
- npm >= 10

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

This starts all apps via Turborepo. The web app runs at **http://localhost:3000**.

### Other scripts

| Command | Description |
|---|---|
| `npm run build` | Build all apps for production |
| `npm run lint` | Lint all packages |
| `npm test` | Run unit tests (Node's built-in runner — no extra dependency) |
| `npm run format` | Format all files with Prettier |

### Tests

Unit tests live in `apps/web/tests/` and cover the pure modules in
`apps/web/lib/` — slot generation and holds, input validation, clinic-time
parsing, and payment signature verification. They use `node:test`, which ships
with the Node 20+ this repo already requires, so there is no test framework to
install.

`apps/web/lib/package.json` exists only to mark that directory as ESM so Node
can load those modules directly; the test files use `.mjs` for the same reason.

### Environment variables

| Variable | Purpose |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Service-account JSON (or use `GOOGLE_APPLICATION_CREDENTIALS`) |
| `RESEND_API_KEY` | Transactional email. Unset = emails are logged and skipped |
| `RAZORPAY_KEY_SECRET` | Required in production; payment verification returns 503 without it |
| `PAYMENTS_DUMMY_MODE` | Set to `true` to accept dummy signatures in production. Never set this on a live site |
| `RATE_LIMIT_TRUSTED_HOPS` | Number of proxies between your edge and the client. See `lib/rate-limit.js` — the default suits a platform that overwrites `x-forwarded-for` (e.g. Vercel); set to `1` if yours appends |

### Firebase

`firebase.json` targets `firestore.rules` and `firestore.indexes.json`. Deploy
both with:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

The composite index on `bookings (service_id, status)` is required — the
availability check queries both fields together.

## Design System

### Color Tokens (CSS variables in `apps/web/app/globals.css`)

| Token | Value | Usage |
|---|---|---|
| `--color-background` | `#FAF8F5` | Page background (warm linen) |
| `--color-foreground` | `#1E2220` | Primary text (dark slate) |
| `--color-primary` | `#3F5E50` | Buttons, accents (muted sage) |
| `--color-primary-hover` | `#344F43` | Button hover state |
| `--color-muted` | `#6B6B63` | Secondary text, eyebrow labels |
| `--color-border` | `#E5E0D8` | Dividers, card borders |
| `--color-card` | `#F5F2EC` | Card/section backgrounds |

### Typography

- **Serif** (`font-serif`): Playfair Display — all headlines (h1–h3), editorial copy
- **Sans-serif** (`font-sans`): Inter — body text, nav, buttons, labels

Both are loaded via `next/font/google` and exposed as CSS variables (`--font-display`, `--font-inter`).

## Adding Shared UI Components

Export components from `packages/ui/index.js` and import them in any app using `@ayurshuddhi/ui`.
