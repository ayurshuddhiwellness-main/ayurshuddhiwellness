import { SERVICES } from '../lib/services'

/* The sitemap, derived rather than hand-written.

   public/sitemap.xml was maintained by hand and had drifted badly: it listed
   none of the nine root-level service routes — the deepest content on the site
   — while listing /blogs, which next.config.js redirects to /coming-soon (and
   /coming-soon was listed separately). Generating the service entries from the
   same catalogue that generates the routes is what stops that recurring.

   /profile is deliberately absent: it is an account page, not a landing page.

   lastModified is the build time. Every route here is statically prerendered,
   so a deploy genuinely is a new revision of all of them — and a build stamp
   can never go stale the way the frozen 2026-08-01 date it replaces had. */

const BASE = 'https://ayurshuddhiwellness.com'

export default function sitemap() {
  const lastModified = new Date()
  const entry = (path, changeFrequency, priority) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency,
    priority,
  })

  return [
    entry('/', 'weekly', 1.0),
    entry('/services', 'monthly', 0.9),
    entry('/book', 'monthly', 0.9),
    // The nine service pages, straight from the catalogue.
    ...SERVICES.map(({ slug }) => entry(`/${slug}`, 'monthly', 0.8)),
    entry('/about', 'monthly', 0.8),
    entry('/contact', 'monthly', 0.8),
    entry('/coming-soon', 'weekly', 0.4),
    entry('/login', 'yearly', 0.3),
    entry('/signup', 'yearly', 0.3),
  ]
}
