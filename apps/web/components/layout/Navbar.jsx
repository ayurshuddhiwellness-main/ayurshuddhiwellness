'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useScrolled } from '../../hooks/useScrolled'
import { useIntroPhase } from '../../hooks/useIntroSequence'
import { useActiveSection } from '../../hooks/useActiveSection'
import AnimatedLink from '../ui/AnimatedLink'
import { EASE } from '../ui/motion'

/* About lands on the homepage section, which carries its own "Explore Us" link
   onward to /about. Everything else goes straight to its page. */
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/services' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact', href: '/contact' },
]

// Module-level so the observer effect is not re-run on every render.
const SECTION_IDS = ['about', 'services', 'journal']

// Routes that should light up a nav item even though they are not the href.
const ROUTE_OWNERS = [
  { label: 'About', match: (p) => p === '/about' },
  { label: 'Blogs', match: (p) => p.startsWith('/blogs') || p === '/coming-soon' },
  { label: 'Contact', match: (p) => p === '/contact' },
]

export default function Navbar({ glass = false }) {
  const scrolled = useScrolled(10)
  const introPhase = useIntroPhase()
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const onHome = pathname === '/'
  const activeSection = useActiveSection(SECTION_IDS, onHome)

  /* Section links are left to the browser: a native hash jump honours the
     `scroll-behavior: smooth` already set on <html>, clears the sticky bar via
     each target's `scroll-mt-16`, and — unlike the intercepted scroll this
     replaced — leaves a shareable /#about URL behind.

     Only "Home" from the homepage still needs handling, since navigating to the
     route you are already on does nothing. */
  const handleNavClick = useCallback(
    (e, href) => {
      setMenuOpen(false)
      if (!onHome || href !== '/') return

      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [onHome],
  )

  // Escape closes the mobile menu — expected of any open overlay.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  /* Which item reads as current. On the homepage that is whichever section sits
     under the bar (falling back to Home at the top); elsewhere it is whichever
     item owns the route — /about lights About, a service detail page lights
     Services. */
  const isActive = useCallback(
    (label) => {
      if (onHome) {
        // Above every tracked section — you are at the top of the page.
        if (!activeSection) return label === 'Home'
        // Only About owns a homepage section now that Services links straight
        // to its page; the rest of the scroll belongs to no nav item.
        return label === 'About' && activeSection === 'about'
      }

      const owner = ROUTE_OWNERS.find((o) => o.match(pathname))
      if (owner) return owner.label === label

      // Everything else under the services catalogue — /services and each
      // service's own root-level route.
      return label === 'Services' && pathname !== '/'
    },
    [onHome, activeSection, pathname],
  )

  // Sends keyboard users past the nav without needing an id on every <main>.
  const skipToContent = (e) => {
    e.preventDefault()
    const main = document.querySelector('main')
    if (!main) return
    main.setAttribute('tabindex', '-1')
    main.focus()
    main.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Settle to a solid linen bar once scrolled (or when the mobile menu is open),
  // cross-fading background + border on the shared easing curve — like glass settling.
  const solid = scrolled || menuOpen

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        glass
          ? 'border-white/10 bg-background/10 backdrop-blur-md'
          : solid
            ? 'border-border bg-background shadow-sm'
            : 'border-transparent bg-transparent'
      }`}
    >
      {/* Invisible until tabbed to — lets keyboard users past the nav */}
      <a
        href="#main"
        onClick={skipToContent}
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-5 focus:py-2 focus:font-sans focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-6 lg:px-12">
        {/* Brand — the slot reserves its width from first paint so the nav
            links don't jump when the wordmark lands here from the hero. */}
        <Link
          href="/"
          aria-label="AyurshuddhiWellness — home"
          className="flex h-10 w-52 shrink-0 items-center"
        >
          {introPhase === 'navbar' && (
            <motion.div
              layoutId="brand-wordmark"
              transition={{ duration: 0.9, ease: EASE }}
            >
              <span
                aria-hidden="true"
                className="whitespace-nowrap font-serif text-lg leading-none"
              >
                <span
                  className={`font-bold tracking-[-0.02em] ${
                    glass ? 'text-background' : 'text-foreground'
                  }`}
                >
                  Ayurshuddhi
                </span>
                <span
                  className={`font-normal italic ${
                    glass ? 'text-background/80' : 'text-primary'
                  }`}
                >
                  Wellness
                </span>
              </span>
            </motion.div>
          )}
        </Link>

        {/* Center nav — desktop. Each link is a pill that lifts out of the bar
            on hover and presses back in on click; the current one stays held in
            sage so your position is always readable. */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.label)

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                aria-current={active ? 'page' : undefined}
                /* The current item is held in a sage wash with sage type and a
                   heavier weight — bg-card was too close to the linen bar to
                   read. color-mix rather than bg-primary/15, because the theme
                   colours are bare var() values and the /alpha syntax compiles
                   to nothing against them. */
                className={`rounded-full px-4 py-2 font-sans text-sm uppercase tracking-widest transition-[color,background-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-soft active:translate-y-0 active:scale-[0.97] motion-reduce:transition-colors motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 ${
                  glass
                    ? active
                      ? 'bg-white/25 font-medium text-white'
                      : 'text-white/70 hover:bg-white/15 hover:text-white'
                    : active
                      ? 'bg-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] font-medium text-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]'
                      : 'text-muted hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right — auth + CTA (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className={`rounded-full border px-5 py-2 font-sans text-sm font-medium transition-[color,background-color,border-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-soft active:translate-y-0 active:scale-[0.97] motion-reduce:transition-colors motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 ${
              glass
                ? 'border-white/30 text-white hover:bg-white/15'
                : 'border-border text-foreground hover:border-primary hover:text-primary'
            }`}
          >
            Login
          </Link>
          {/* Left deliberately flat — the primary CTA does not need to compete
              with the links now lifting around it. */}
          <AnimatedLink
            href="/book"
            className="rounded-full bg-primary px-6 py-2.5 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover md:inline-flex md:items-center"
          >
            Book Now
          </AnimatedLink>
        </div>

        {/* Hamburger — mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-foreground"
          >
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-border bg-background px-6 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.label)

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={active ? 'page' : undefined}
                  /* min-h-[44px] keeps these at the 44px touch target the
                     guidelines ask for on mobile. */
                  className={`flex min-h-[44px] items-center rounded-full px-4 font-sans text-sm uppercase tracking-widest transition-colors duration-300 ${
                    active
                      ? 'bg-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] font-medium text-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]'
                      : 'text-muted hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            {/* Auth + CTA (mobile) */}
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="inline-flex justify-center rounded-full border border-border px-6 py-2.5 font-sans text-sm font-medium text-foreground transition-colors duration-300 hover:border-primary hover:text-primary"
              >
                Login
              </Link>
              <AnimatedLink
                href="/book"
                onClick={() => setMenuOpen(false)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-6 py-2.5 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover"
              >
                Book Now
              </AnimatedLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
