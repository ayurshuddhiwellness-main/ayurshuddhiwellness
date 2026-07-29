import { notFound } from 'next/navigation'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import ServiceDetail from '../../components/sections/ServiceDetail'
import { SERVICES, getService } from '../../lib/services'

/* Root-level service routes — /ayurveda, /panchakarma, and so on.

   Next gives static segments precedence over a dynamic one, so the existing
   /about, /services, /book, /login, /signup and /blogs routes still win. Any
   slug that is not a service 404s rather than rendering an empty shell. */

export const dynamicParams = false

export function generateStaticParams() {
  return SERVICES.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}

  return {
    title: `${service.title} | AyurshuddhiWellness`,
    description: service.intro,
    alternates: { canonical: `/${service.slug}` },
    openGraph: {
      title: `${service.title} | AyurshuddhiWellness`,
      description: service.intro,
      images: [service.image],
    },
  }
}

export default async function ServicePage({ params }) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  return (
    <>
      <Navbar />
      <main>
        <ServiceDetail service={service} />
      </main>
      <Footer />
    </>
  )
}
