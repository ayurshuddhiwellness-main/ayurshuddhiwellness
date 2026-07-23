# AyurShuddhi — Design System & Project State

Last updated: reflects state as of this conversation. Update this file whenever structure, tokens, or major sections change.

---

## Tech Stack

- Monorepo: Turborepo + npm workspaces
- Frontend: Next.js 15 (App Router) + React 19
- Styling: Tailwind CSS 3.4
- Fonts: Cormorant Garamond (serif) + Inter (sans-serif), loaded via `next/font`
- Animation: framer-motion
- Language: JavaScript (`.js`/`.jsx`) — no TypeScript currently
- Hosting: Vercel
- Backend (planned, not yet built): Firebase Auth + Firestore, Razorpay for payments, Resend for server-side email (not EmailJS — flagged as a risk for booking confirmations)

---

## Design Tokens

**Aesthetic direction:** "Quiet luxury / editorial apothecary." Restraint over flourish. Think Aesop, Kinfolk — generous whitespace, slow deliberate motion, no bounce/spring physics, no parallax, no auto-playing carousels.

### Colors
- Background (linen): `#FAF8F5`
- Text (slate): `#1E2220`
- Primary accent (sage green): `#3F5E50`
- Muted/secondary text: `#6B6B63` (warm gray)
- Border/divider: `#E5E0D8` (soft tan)
- Card/placeholder fill: `#E8E4DD`
- Error/validation tone (kept earthy, not harsh): `#B85C5C`

### Typography
- `font-serif`: Cormorant Garamond — all headlines (h1–h3), large editorial weight, regular (not bold) weight at large sizes
- `font-sans`: Inter — body text, nav, buttons, labels
- Eyebrow labels: uppercase, `tracking-[0.25em]`, text-sm, sage green
- Hero headline scale: `text-6xl` to `text-7xl` (desktop)

### Layout Principles
- Max content width ~1280px (`max-w-content`), generous horizontal padding
- Large section vertical padding: `py-24` to `py-32`
- Rounded corners: `rounded-full` for pill buttons, `rounded-2xl` for cards, `rounded-t-[2.5rem]` for "rising panel" sections
- Shadows: subtle only (`shadow-sm`), no heavy drop shadows
- Light mode only

### Animation
- Custom ease curve used everywhere: `[0.22, 1, 0.36, 1]` (quint-out, smooth deceleration)
- Standard pattern: `whileInView`, `once: true`, fade-up (`opacity 0→1`, `y: 16→0`), staggered children ~0.08–0.1s apart
- Button hover: scale to 1.02, arrow span nudges +3px on hover, 250ms ease-out; active/tap: scale 0.98
- Navbar scroll transition: background + border fade in, 400ms ease-out
- ALL animations must respect `prefers-reduced-motion` — fallback to instant final states, no motion/rotation/scale
- Animate only `transform`/`opacity` — never animate `width`/`height`/`margin` directly (causes layout shift)

### Known Responsive Bug Pattern (already fixed once, watch for recurrence)
Two-column grids must use `md:` (768px) breakpoint, NOT `lg:` (1024px) — using `lg:` leaves a broken zone roughly 768–1023px wide (common laptop window width) where mobile stacking hasn't released layout-wise but content still renders at desktop-card sizing. Always test at ~900–950px width specifically.

---

## Site Structure

### Homepage (`/apps/web/app/page.js`)
Current section order (post-restructure):
1. Navbar
2. Hero — "Ancient Wisdom. Modern Balance." + line-by-line headline reveal + stat counter (0→5,000+) + animated SVG botanical line-art motif (draws in via framer-motion `pathLength`)
3. About Section 1 reused — "Our Story" hero (imported from shared location, also used standalone on `/about`)
4. About Section 2 reused — scroll-triggered story, sticky image (real photos now) + 3 beats ("01 — The Roots", "02 — The Study", "03 — The Practice")
5. **Merged section** — "Our Philosophy" + "3 Pillars" combined into one rising panel (`rounded-t-[2.5rem]`, shadow, scroll-rise animation, 25vh buffer before it to prevent content bleed from Section 4 above)
6. "Rooted in tradition. Designed for your life." (apothecary/product section, asymmetric image+text layout)
7. Journal preview section ("Rooted in tradition. Written for the curious." + featured post card)
8. CTA banner ("Begin your wellness journey")
9. Footer

Nav links: Home, About, Services, Journal, Contact

### About page (`/apps/web/app/about/page.js`)
Kept as standalone "legacy" page, full original content independent of homepage reuse:
1. Section 1 — page hero (same as homepage's reused version)
2. Section 2 — scroll story (same as homepage's reused version)
3. Section 3 — "Our Philosophy" (original standalone version, NOT merged with Pillars here — that merge only happened on the homepage copy)
4. Section 4 — "Meet the Practitioner" (credibility section: BAMS Certified / 15+ Years Practice / 500+ Clients Treated pill tags + practitioner portrait placeholder)
5. Section 5 — CTA banner (reused component)
6. Section 6 — Footer (reused component)

### Journal (`/apps/web/app/journal/`)
- `/journal` listing page: page header, featured post (large card), category filter (All/Ayurveda/Panchakarma/Yoga & Meditation/Rituals — client-side filtering with placeholder post array), post grid, newsletter signup, CTA banner, footer
- `/journal/[slug]` post page: hero (category tag, title, author/date), featured image, body content, related posts
- **KNOWN BUG (unresolved as of last check):** post page body content and related posts section render blank — only hero + featured image show before jumping straight to CTA banner. Needs fix.

### Auth (`/apps/web/app/login/` and `/apps/web/app/signup/`)
- Split-screen layout: left = atmospheric image + overlaid headline + SVG botanical motif (reused from About hero, white/cream stroke variant), right = form
- Form: labeled email/password fields, show/hide password toggle, "Forgot password?" link, sage green submit button, OR divider, Google OAuth button, terms/privacy fine print
- Signup adds: full name field, confirm password field
- No real auth wiring yet — client-side validation only, console.log on submit (Firebase Auth wiring is a future backend task)
- **KNOWN BUG (unresolved as of last check):** left image column is missing entirely on both `/login` and `/signup` — page renders as a single centered form column instead of the intended `md:grid-cols-2` split-screen. Needs fix.

---

## Reusable Components (confirm exact file paths/names when working in the repo — names below are descriptive, not necessarily exact)

- `Navbar` — sticky, scroll-transition background, used on every page
- `Footer` — dark sage/charcoal footer, 4-column layout (brand+social, quick links, services, contact), used on every page
- `CTABanner` — sage green full-width banner with heading/body/button, reused across homepage, About, Journal listing — copy is customized per page (e.g. About uses "Ready to meet us?")
- About Section 1 ("Our Story" hero) and Section 2 (scroll story) — extracted to be importable on both `/about` and `/` without duplicating logic

---

## Outstanding Bugs (as of last verification)

1. **Journal post page** (`/journal/[slug]/page.js`) — body content + related posts section not rendering (blank gap between featured image and CTA banner). Fix prompt already written, not yet confirmed fixed.
2. **Login/Signup pages** — left atmospheric image column entirely missing, pages render as single centered column instead of split-screen `md:grid-cols-2`. Fix prompt already written, not yet confirmed fixed.

---

## Workflow Notes

- User works in Claude Code (and sometimes Antigravity when Claude Code's usage limit is hit) for actual implementation — Claude (this assistant) writes precise prompts, user runs them, then Claude verifies visually via Claude in Chrome connected to `localhost:3000`.
- User has requested: keep all prompts and fixes minimal/direct, skip excessive self-verification/narration from the coding agent — just make the targeted fix.
- When context window usage is a concern, prefer fewer/more strategic verification screenshots over checking every animation frame-by-frame, unless something looks genuinely suspicious.
- User prioritizes clarity over creativity in communication; minimal jargon; summarize complex topics at the start.
