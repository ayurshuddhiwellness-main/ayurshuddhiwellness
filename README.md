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
| `npm run format` | Format all files with Prettier |

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

- **Serif** (`font-serif`): Cormorant Garamond — all headlines (h1–h3), editorial copy
- **Sans-serif** (`font-sans`): Inter — body text, nav, buttons, labels

Both are loaded via `next/font/google` and exposed as CSS variables (`--font-cormorant`, `--font-inter`).

## Adding Shared UI Components

Export components from `packages/ui/index.js` and import them in any app using `@ayurshuddhi/ui`.
