import dynamic from 'next/dynamic'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/sections/Hero'
import RootedInTradition from '../components/sections/RootedInTradition'
import Journal from '../components/sections/Journal'

// Below-fold client sections load as their own chunks so the initial
// homepage JS stays smaller; they are still server-rendered (ssr default).
const AboutPractitioner = dynamic(() => import('../components/sections/AboutPractitioner'))
const PhilosophyPillars = dynamic(() => import('../components/sections/PhilosophyPillars'))

export const metadata = {
  title: 'AyurshuddhiWellness | Ayurvedic Wellness',
  description:
    'Authentic Ayurveda, Panchakarma, naturopathy and yoga in Greater Noida — personalised consultations and treatments rooted in ancient wisdom, refined for modern living.',
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* 1 — Landing hero */}
        <Hero />

        {/* 2 — Your Practitioner (shared with /about, which owns the full story).
            Carries the "/#about" nav target on this page only. */}
        <AboutPractitioner exploreLink id="about" />

        {/* 3 — Merged Philosophy + 3 Pillars (rising panel) */}
        <PhilosophyPillars />

        {/* 4 — Rooted in tradition / apothecary */}
        <RootedInTradition />

        {/* 5 — Journal */}
        <Journal />
      </main>
      <Footer />
    </>
  )
}
