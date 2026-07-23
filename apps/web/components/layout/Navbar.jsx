'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useScrolled } from '../../hooks/useScrolled'
import AnimatedLink from '../ui/AnimatedLink'

// Homepage sections use "/#id" so the links work from any route: on the
// homepage they smooth-scroll; elsewhere they navigate home and jump. "Blogs"
// is its own page.
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar({ glass = false }) {
  const scrolled = useScrolled(10)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const onHome = pathname === '/'

  // On the homepage, intercept in-page targets and smooth-scroll (accounting
  // for the ~64px sticky bar). Elsewhere, let the Link navigate normally.
  const handleNavClick = useCallback(
    (e, href) => {
      setMenuOpen(false)
      if (!onHome) return

      if (href === '/') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (href.startsWith('/#')) {
        const el = document.getElementById(href.slice(2))
        if (el) {
          e.preventDefault()
          const top = el.getBoundingClientRect().top + window.scrollY - 64
          window.scrollTo({ top, behavior: 'smooth' })
        }
      }
    },
    [onHome],
  )

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
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-6 lg:px-12">
        {/* Logo */}
        <Link
          href="/"
          className={`font-serif text-xl font-semibold ${glass ? 'text-background' : 'text-foreground'}`}
        >
          AyurshuddhiWellness
        </Link>

        {/* Center nav — desktop */}
        <nav className="hidden gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`font-sans text-sm uppercase tracking-widest transition-colors duration-300 ${
                glass
                  ? 'text-background/60 hover:text-background'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right — auth + CTA (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className={`rounded-full border px-5 py-2 font-sans text-sm font-medium transition-colors duration-300 ${
              glass
                ? 'border-background/30 text-background hover:bg-background/10'
                : 'border-border text-foreground hover:border-primary hover:text-primary'
            }`}
          >
            Login
          </Link>
          <AnimatedLink
            href="/#contact"
            onClick={(e) => handleNavClick(e, '/#contact')}
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
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-sans text-sm uppercase tracking-widest text-muted transition-colors duration-300 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
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
                href="/#contact"
                onClick={(e) => handleNavClick(e, '/#contact')}
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover"
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
