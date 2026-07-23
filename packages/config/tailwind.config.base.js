/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
        },
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        card: 'var(--color-card)',
      },
      fontFamily: {
        serif: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '8xl': ['6rem', { lineHeight: '1.05' }],
        '7xl': ['4.5rem', { lineHeight: '1.08' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
      },
      maxWidth: {
        content: '1280px',
      },
      spacing: {
        section: '6rem',
        'section-lg': '8rem',
      },
      borderRadius: {
        card: '1rem',
      },
      boxShadow: {
        soft: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
      },
      letterSpacing: {
        eyebrow: '0.12em',
        nav: '0.08em',
      },
    },
  },
  plugins: [],
}

module.exports = tailwindConfig
