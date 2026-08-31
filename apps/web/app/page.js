import dynamic from 'next/dynamic'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import SectionLock from '../components/ui/SectionLock'
import PageBackdrop from '../components/ui/PageBackdrop'
import Hero from '../components/sections/Hero'
import ServiceSection, {
  ServicesHeader,
  ServicesCTA,
} from '../components/sections/ServiceSection'
import Journal from '../components/sections/Journal'

// Below-fold client sections load as their own chunks so the initial
// homepage JS stays smaller; they are still server-rendered (ssr default).
const AboutPractitioner = dynamic(() => import('../components/sections/AboutPractitioner'))
const Philosophy = dynamic(() => import('../components/sections/Philosophy'))

export const metadata = {
  title: 'AyurshuddhiWellness | Ayurvedic Wellness',
  description:
    'Authentic Ayurveda, Panchakarma, naturopathy and yoga in Greater Noida — personalised consultations and treatments rooted in ancient wisdom, refined for modern living.',
}

export default function HomePage() {
  return (
    <>
      {/* One photograph, fixed, behind every section below — which is why none
          of them paint a ground of their own. No scrim over it. */}
      <PageBackdrop />

      {/* One gesture per section, across the whole page. Each section below
          carries data-snap-section; the lock reads its stops off those. */}
      <SectionLock />
      <Navbar />
      <main>
        {/* 1 — Landing hero */}
        <Hero />

        {/* 2 — The three beliefs, as an editorial list (pinned slide) */}
        <Philosophy />

        {/* 3 — Your Practitioner (shared with /about, which owns the full story).
            Carries the "/#about" nav target on this page only. */}
        <AboutPractitioner exploreLink snap id="about" />

        {/* 4, 5, 6 — the three pillar services, one full screen each. Order is
            fixed: Ayurveda → Panchakarma → Yoga. The photograph alternates
            sides, so the eye crosses the page rather than running down one
            edge. The first carries the "/#services" nav target and the section
            heading; the last closes with the calls to action. */}
        <ServiceSection slug="ayurveda" id="services" header={<ServicesHeader />} />
        <ServiceSection slug="panchakarma" flip />
        <ServiceSection slug="yoga-pranayama-meditation" footer={<ServicesCTA />} />

        {/* 7 — Journal */}
        <Journal />
      </main>
      <Footer />
    </>
  )
}
