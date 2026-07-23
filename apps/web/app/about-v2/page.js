'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import { EASE } from '../../components/ui/motion'
import { STORY_BEATS } from '../../lib/about-content'
import styles from './about-v2.module.css'

// Shared About story beats + real founder photography (distinct per slide).
// Swap `image` in lib/about-content.js to change photos in one place.
const SLIDES = STORY_BEATS

const FOOTER_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Book Now', href: '/#contact' },
]

const EYEBROW = 'mb-5 font-sans text-[11px] uppercase tracking-[0.25em] text-primary'
const HEADLINE =
  'font-serif text-[clamp(2.5rem,6vw,5rem)] font-normal leading-tight text-foreground'
const BODY = 'mt-6 max-w-md font-sans text-base leading-relaxed text-muted'

const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

// Distinct image enter per slide: scale-in for 1 & 2, horizontal slide for 3.
function imageVariants(i, reduce) {
  if (reduce) return { hidden: { opacity: 0 }, visible: { opacity: 1 } }
  if (i === 2) return { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } }
  return { hidden: { opacity: 0, scale: i === 1 ? 1.08 : 1.06 }, visible: { opacity: 1, scale: 1 } }
}

function TextBlock({ slide, index, active, reduce }) {
  if (reduce) {
    return (
      <div>
        <p className={EYEBROW}>{slide.eyebrow}</p>
        <h2 className={HEADLINE}>{slide.headline}</h2>
        <p className={BODY}>{slide.body}</p>
      </div>
    )
  }

  // Slide 3 (2→3): word-by-word "lighting" reveal instead of a simple fade.
  if (index === 2) {
    const words = slide.headline.split(' ')
    return (
      <motion.div
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
        initial="hidden"
        animate={active ? 'visible' : 'hidden'}
      >
        <motion.p variants={FADE_UP} className={EYEBROW}>
          {slide.eyebrow}
        </motion.p>
        <h2 className={HEADLINE}>
          {words.map((w, wi) => (
            <motion.span key={wi} variants={FADE_UP} className="inline-block">
              {w}
              {wi < words.length - 1 ? ' ' : ''}
            </motion.span>
          ))}
        </h2>
        <motion.p variants={FADE_UP} className={BODY}>
          {slide.body}
        </motion.p>
      </motion.div>
    )
  }

  // Slides 1 & 2: block fade-up. Slide 2 (1→2) arrives staggered after the image.
  const delay = index === 1 ? 0.25 : 0.05
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, ease: EASE, delay: active ? delay : 0 }}
    >
      <p className={EYEBROW}>{slide.eyebrow}</p>
      <h2 className={HEADLINE}>{slide.headline}</h2>
      <p className={BODY}>{slide.body}</p>
    </motion.div>
  )
}

export default function AboutV2Page() {
  const [current, setCurrent] = useState(0)
  const currentRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const touchStartY = useRef(0)
  const imgRefs = useRef([])
  const reduce = useReducedMotion()
  const reduceRef = useRef(false)

  useEffect(() => {
    reduceRef.current = reduce
  }, [reduce])

  // Lock page scroll — full-screen wheel-driven experience.
  useEffect(() => {
    const html = document.documentElement
    const prevHtml = html.style.overflow
    const prevBody = document.body.style.overflow
    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prevHtml
      document.body.style.overflow = prevBody
    }
  }, [])

  // Advance/reverse with a debounce flag (ref, not state — avoids stale
  // closures in the window-level handlers registered once).
  const goTo = useCallback((dir) => {
    if (isAnimatingRef.current) return
    const next = Math.min(Math.max(currentRef.current + dir, 0), SLIDES.length - 1)
    if (next === currentRef.current) return
    currentRef.current = next
    isAnimatingRef.current = true
    setCurrent(next)
    setTimeout(() => {
      isAnimatingRef.current = false
    }, reduceRef.current ? 400 : 1000)
  }, [])

  // Wheel / keyboard / touch navigation
  useEffect(() => {
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < 5) return
      goTo(e.deltaY > 0 ? 1 : -1)
    }
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        goTo(1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        goTo(-1)
      }
    }
    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY
    }
    const onTouchEnd = (e) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY
      if (delta > 50) goTo(1)
      else if (delta < -50) goTo(-1)
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [goTo])

  // Mouse parallax on the active slide's image (right side) — direct DOM writes
  // via refs, no re-renders. Disabled entirely under reduced motion.
  useEffect(() => {
    if (reduce) return
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      const el = imgRefs.current[currentRef.current]
      if (el) el.style.transform = `translate(${x}px, ${y}px) scale(1.06)`
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduce])

  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      {/* Navbar — fixed overlay */}
      <div className="fixed inset-x-0 top-0 z-50">
        <Navbar />
      </div>

      {/* Slides */}
      {SLIDES.map((slide, i) => {
        const active = i === current
        return (
          <motion.section
            key={slide.eyebrow}
            aria-hidden={!active}
            initial={false}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
            style={{ pointerEvents: active ? 'auto' : 'none' }}
            className={`${styles.slide} z-10`}
          >
            {/* Text triangle — upper-left. Width capped to stay left of the seam. */}
            <div className={`${styles.textTriangle} bg-background`}>
              <div className="absolute left-[6%] top-[22%] max-w-[34%]">
                <TextBlock slide={slide} index={i} active={active} reduce={reduce} />
              </div>
            </div>

            {/* Image triangle — lower-right */}
            <div className={styles.imageTriangle}>
              <motion.div
                className="h-full w-full"
                variants={imageVariants(i, reduce)}
                initial="hidden"
                animate={active ? 'visible' : 'hidden'}
                transition={{ duration: reduce ? 0 : 0.9, ease: EASE }}
              >
                <div
                  ref={(el) => {
                    imgRefs.current[i] = el
                  }}
                  className={`relative h-full w-full ${styles.parallax}`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    sizes="100vw"
                    className="object-cover object-[70%_center]"
                    priority={i === 0}
                  />
                </div>
              </motion.div>
            </div>
          </motion.section>
        )
      })}

      {/* Slide indicators — right edge */}
      <div
        aria-hidden="true"
        className="fixed right-6 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-3"
      >
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`block transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              i === current
                ? 'h-6 w-0.5 bg-primary'
                : 'h-1.5 w-1.5 rounded-full border border-primary/50'
            }`}
          />
        ))}
      </div>

      {/* Fixed footer bar */}
      <footer className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/80 px-8 py-4 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="font-sans text-xs uppercase tracking-widest text-muted">
            © 2026 AyurshuddhiWellness — Ancient Wisdom. Modern Balance.
          </p>
          <div className="flex gap-6">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-sans text-xs uppercase tracking-widest text-muted transition-colors duration-300 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
