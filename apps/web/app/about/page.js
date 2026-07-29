import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
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
    <>
      {/* Fixed overlay — sits outside <main> so no section's overflow can
          clip it. Removes itself after one hold, once per session. */}
      <AboutIntro />
      <Navbar />
      <main>
        <AboutHero />
        <AboutPhilosophy />
        <AboutPractitioner />
        <AboutCTA />
      </main>
      <Footer />
    </>
  )
}
