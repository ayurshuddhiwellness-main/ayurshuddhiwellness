import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import ProfileHeader from '../../components/sections/ProfileHeader'
import ProfileInfo from '../../components/sections/ProfileInfo'
import ProfilePrakriti from '../../components/sections/ProfilePrakriti'
import ProfileBookings from '../../components/sections/ProfileBookings'
import CTABanner from '../../components/sections/CTABanner'

/* The page itself stays a server component so `metadata` can be exported —
   Next refuses that export from a 'use client' module. Every section below is
   a client component, which is where the animation (and later the Firebase
   Auth state) lives. Data is mock; see lib/profile-mock.js. */

export const metadata = {
  title: 'My Profile | AyurshuddhiWellness',
  description:
    'Manage your wellness journey — your details, your Prakriti assessment, and your appointments with AyurshuddhiWellness.',
}

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <main>
        <ProfileHeader />
        <ProfileInfo />
        <ProfilePrakriti />
        <ProfileBookings />
        <CTABanner />
      </main>
      <Footer />
    </>
  )
}
