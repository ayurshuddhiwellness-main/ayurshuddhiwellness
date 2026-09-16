import dynamic from 'next/dynamic'
import SiteShell from '../components/layout/SiteShell'
import SectionLock from '../components/ui/SectionLock'
import Hero from '../components/sections/Hero'
import ServiceSection, { ServicesHeader, ServicesCTA } from '../components/sections/ServiceSection'
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
    /* The photograph, the bar and the footer all come from the shell now.
       One gesture per section is this page's alone: each section below carries
       data-snap-section and the lock reads its stops off those. */
    <SiteShell before={<SectionLock />}>
      <>
        {/* 1 — Landing hero */}
        <Hero />

        {/* 2 — The three beliefs, as an editorial list (pinned slide) */}
        <Philosophy />

        {/* 3 — Your Practitioner (shared with /about, which owns the full story).
            Carries the "/#about" nav target on this page only. `summary` is
            what gets the short version of the biography here; the long one
            lives on /about. */}
        <AboutPractitioner exploreLink snap summary id="about" />

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
      </>
    </SiteShell>
  )
}
