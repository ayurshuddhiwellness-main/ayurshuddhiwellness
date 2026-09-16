import SiteShell from '../../components/layout/SiteShell'
import AboutIntro from '../../components/sections/AboutIntro'
import AboutHero from '../../components/sections/AboutHero'
import AboutPhilosophy from '../../components/sections/AboutPhilosophy'
import AboutPractitioner from '../../components/sections/AboutPractitioner'
import AboutCTA from '../../components/sections/AboutCTA'

export const metadata = {
  title: 'About | AyurshuddhiWellness',
  description:
    'Wisdom passed down. Wellness made personal. The story behind AyurshuddhiWellness — ancient Ayurvedic science applied with care and precision.',
}

export default function AboutPage() {
  return (
    /* AboutIntro is a fixed overlay and must stay outside <main> so no
       section's overflow can clip it. It removes itself after one hold, once
       per session. */
    <SiteShell before={<AboutIntro />}>
      <AboutHero />
      <AboutPhilosophy />
      <AboutPractitioner />
      <AboutCTA />
    </SiteShell>
  )
}
