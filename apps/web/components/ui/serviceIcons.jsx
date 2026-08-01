/* ──────────────────────────────────────────────────────
   Line marks for each service, keyed by slug.

   These live apart from lib/services.js because that data file carries no JSX,
   and apart from any one section because the homepage's three pillars and the
   full /services catalogue both draw from the same set.

   The icons sit on the sage back face of a ServiceCard, so they inherit white
   from their container rather than carrying the primary colour themselves.
   ────────────────────────────────────────────────────── */

const iconProps = {
  width: 40,
  height: 40,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
}

export const SERVICE_ICONS = {
  ayurveda: (
    // Leaf
    <svg {...iconProps}>
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 20 4 20 4s0 4.5-2 10.1A7 7 0 0 1 11 20z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  ),
  naturopathy: (
    // Sun
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  panchakarma: (
    // Water drop
    <svg {...iconProps}>
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  'nadi-pariksha': (
    // Pulse trace
    <svg {...iconProps}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  'tongue-diagnosis': (
    // Tongue
    <svg {...iconProps}>
      <path d="M12 3c-3.9 0-6 2.4-6 5.9 0 5 2.4 12.1 6 12.1s6-7.1 6-12.1C18 5.4 15.9 3 12 3z" />
      <path d="M12 7.5v11" />
    </svg>
  ),
  'rakht-mokshan': (
    // Leech + drop
    <svg {...iconProps}>
      <path d="M4 21c0-6.5 3.2-11 7.5-12.1 2.7-.7 4.5.8 4.5 2.9 0 2.2-2.1 3.4-3.8 2.5" />
      <path d="M19 2.5c1.3 1.8 2 2.9 2 3.9a2 2 0 0 1-4 0c0-1 .7-2.1 2-3.9z" />
    </svg>
  ),
  'agni-karma': (
    // Flame
    <svg {...iconProps}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  ),
  'yoga-pranayama-meditation': (
    // Lotus
    <svg {...iconProps}>
      <path d="M12 20c0-4-3.5-7.5-7.5-7.5S12 5 12 5s7.5 3 7.5 7.5S12 20 12 20z" />
      <path d="M12 20c0-4 3.5-7.5 7.5-7.5" />
      <path d="M12 20c0-4-3.5-7.5-7.5-7.5" />
      <path d="M12 5c-1.5 2-2 4.5-2 7" />
      <path d="M12 5c1.5 2 2 4.5 2 7" />
    </svg>
  ),
  'stress-management': (
    // Crescent moon
    <svg {...iconProps}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
}
