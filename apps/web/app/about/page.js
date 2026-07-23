import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import AboutHero from '../../components/sections/AboutHero'
import AboutStory from '../../components/sections/AboutStory'
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
      <Navbar />
      <main>
        <AboutHero />
        <AboutStory />
        <AboutPhilosophy />
        <AboutPractitioner />
        <AboutCTA />
      </main>
      <Footer />
    </>
  )
}
