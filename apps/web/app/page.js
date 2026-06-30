import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/sections/Hero'
import AboutHero from '../components/sections/AboutHero'
import AboutStory from '../components/sections/AboutStory'
import PhilosophyPillars from '../components/sections/PhilosophyPillars'
import RootedInTradition from '../components/sections/RootedInTradition'
import Journal from '../components/sections/Journal'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* 1 — Landing hero */}
        <Hero />

        {/* 2 — About: Our Story hero (stat counter + botanical SVG) */}
        <AboutHero />

        {/* 3 — About: Scroll-triggered story (sticky image + 3 beats) */}
        <AboutStory />

        {/* 4 — Merged Philosophy + 3 Pillars (rising panel) */}
        <PhilosophyPillars />

        {/* 5 — Rooted in tradition / apothecary */}
        <RootedInTradition />

        {/* 6 — Journal */}
        <Journal />
      </main>
      <Footer />
    </>
  )
}
