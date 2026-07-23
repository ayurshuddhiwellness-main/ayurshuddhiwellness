import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import CTABanner from '../../components/sections/CTABanner'
import JournalHeader from '../../components/sections/journal/JournalHeader'
import FeaturedPost from '../../components/sections/journal/FeaturedPost'
import PostGrid from '../../components/sections/journal/PostGrid'
import Newsletter from '../../components/sections/journal/Newsletter'

export const metadata = {
  title: 'Blogs | AyurshuddhiWellness',
  description:
    'Stories of healing — reflections on Ayurvedic wisdom, seasonal rituals, and the quiet art of mindful living.',
}

export default function BlogsPage() {
  return (
    <>
      <Navbar />
      <main>
        <JournalHeader />
        <FeaturedPost />
        <PostGrid />
        <Newsletter />
        <CTABanner />
      </main>
      <Footer />
    </>
  )
}
