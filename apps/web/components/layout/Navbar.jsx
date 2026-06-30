'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useScrolled } from '../../hooks/useScrolled'
import AnimatedLink from '../ui/AnimatedLink'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Journal', href: '#journal' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const scrolled = useScrolled(10)
  const [menuOpen, setMenuOpen] = useState(false)

  // Smooth-scroll to the target section when a nav link is clicked,
  // accounting for the sticky navbar height (~64px).
  const handleNavClick = useCallback(
    (e, href) => {
      // "Home" link scrolls to the very top
      if (href === '#home') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setMenuOpen(false)
        return
      }

      const id = href.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        e.preventDefault()
        const navHeight = 64
        const top = el.getBoundingClientRect().top + window.scrollY - navHeight
        window.scrollTo({ top, behavior: 'smooth' })
        setMenuOpen(false)
      }
    },
    [],
  )

  // Settle to a solid linen bar once scrolled (or when the mobile menu is open),
  // cross-fading background + border on the shared easing curve — like glass settling.
  const solid = scrolled || menuOpen

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        solid
          ? 'border-border bg-background shadow-sm'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-6 lg:px-12">
        {/* Logo */}
        <Link href="/" className="font-serif text-xl font-semibold text-foreground">
          AyurshuddhiWellness
        </Link>

        {/* Center nav — desktop */}
        <nav className="hidden gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-sans text-sm uppercase tracking-widest text-muted transition-colors duration-300 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA — desktop */}
        <AnimatedLink
          href="#contact"
          onClick={(e) => handleNavClick(e, '#contact')}
          className="hidden rounded-full bg-primary px-6 py-2.5 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover md:inline-flex md:items-center"
        >
          Book Now
        </AnimatedLink>

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
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-sans text-sm uppercase tracking-widest text-muted transition-colors duration-300 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <AnimatedLink
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover"
            >
              Book Now
            </AnimatedLink>
          </nav>
        </div>
      )}
    </header>
  )
}
