'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { EASE } from '../ui/motion'
import { STORY_BEATS } from '../../lib/about-content'
import styles from './AboutV2Section.module.css'

// ── Text style tokens (match original about-v2 design) ──────────
const EYEBROW = 'mb-5 font-sans text-[11px] uppercase tracking-[0.25em] text-primary'
const HEADLINE =
  'font-serif text-[clamp(2rem,5vw,4rem)] font-normal leading-tight text-foreground'
const BODY = 'mt-6 max-w-md font-sans text-base leading-relaxed text-muted'

const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

const SLIDES = STORY_BEATS

// ── Distinct image enter variants per slide ─────────────────────
function imageVariants(i, reduce) {
  if (reduce) return { hidden: { opacity: 0 }, visible: { opacity: 1 } }
  if (i === 2) return { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } }
  return { hidden: { opacity: 0, scale: i === 1 ? 1.08 : 1.06 }, visible: { opacity: 1, scale: 1 } }
}

// ── Text block with per-slide animation choreography ────────────
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

  // Slide 3: word-by-word "lighting" reveal
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
              {wi < words.length - 1 ? '\u00A0' : ''}
            </motion.span>
          ))}
        </h2>
        <motion.p variants={FADE_UP} className={BODY}>
          {slide.body}
        </motion.p>
      </motion.div>
    )
  }

  // Slides 1 & 2: block fade-up
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

// ── Main section component ──────────────────────────────────────
export default function AboutV2Section() {
  const wrapperRef = useRef(null)
  const imgRefs = useRef([])
  const reduce = useReducedMotion()

  // Scroll progress through the tall wrapper → active slide index
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })

  // Map [0, 1] progress → [0, SLIDES.length - 1]
  const rawIndex = useTransform(scrollYProgress, [0, 1], [0, SLIDES.length - 1])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const unsubscribe = rawIndex.on('change', (v) => {
      const rounded = Math.round(v)
      setCurrent((prev) => (prev !== rounded ? rounded : prev))
    })
    return unsubscribe
  }, [rawIndex])

  // Mouse parallax on the active slide's image (disabled under reduced motion)
  const currentRef = useRef(0)
  useEffect(() => {
    currentRef.current = current
  }, [current])

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
    <section
      ref={wrapperRef}
      id="about"
      className={styles.wrapper}
      // Height = one viewport per slide (first is free via sticky)
      style={{ height: `${SLIDES.length * 100}vh` }}
    >
      <div className={styles.stickyFrame}>
        {/* Background fill */}
        <div className="absolute inset-0 bg-background" />

        {/* Slides */}
        {SLIDES.map((slide, i) => {
          const active = i === current
          return (
            <motion.div
              key={slide.eyebrow}
              aria-hidden={!active}
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
              style={{ pointerEvents: active ? 'auto' : 'none' }}
              className={styles.slide}
            >
              {/* Text triangle — upper-left */}
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
            </motion.div>
          )
        })}

        {/* Slide indicators — right edge */}
        <div
          aria-hidden="true"
          className="absolute right-6 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-3"
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

        {/* Scroll hint — bottom center, fades after first slide */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: current === 0 ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-sans text-[10px] uppercase tracking-widest text-muted">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="h-4 w-px bg-primary/40"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
