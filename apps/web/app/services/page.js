import SiteShell from '../../components/layout/SiteShell'
import ServicesGrid from '../../components/sections/ServicesGrid'
import CTABanner from '../../components/sections/CTABanner'

export const metadata = {
  title: 'Services | AyurshuddhiWellness',
  description:
    'Care for every layer of you. Ayurveda, Naturopathy, Panchakarma, Nadi Pariksha, Agni Karma, Yoga and more — nine practices rooted in classical tradition.',
}

export default function ServicesPage() {
  return (
    <SiteShell>
      <ServicesGrid />
      <CTABanner />
    </SiteShell>
  )
}
