import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/sections/Hero'
import AboutV2Section from '../components/sections/AboutV2Section'
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

        {/* 2 — About: diagonal-split scroll-driven slideshow (v2) */}
        <AboutV2Section />

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
