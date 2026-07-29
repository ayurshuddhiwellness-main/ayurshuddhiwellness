import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import CTABanner from '../../components/sections/CTABanner'
import ContactForm from '../../components/sections/ContactForm'
import ContactInfo from '../../components/sections/ContactInfo'
import ContactTrust from '../../components/sections/ContactTrust'
import { RevealGroup, RevealItem } from '../../components/ui/Reveal'

export const metadata = {
  title: 'Contact Us | AyurshuddhiWellness',
  description:
    'Get in touch with AyurshuddhiWellness. Book an Ayurvedic consultation, ask about our therapies, or visit our clinic in Greater Noida.',
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="bg-background px-6 py-24 text-center lg:px-12 md:py-32">
          <RevealGroup className="mx-auto max-w-content">
            <RevealItem>
              <p className="mb-6 font-sans text-sm uppercase tracking-[0.25em] text-primary">
                Get in Touch
              </p>
            </RevealItem>

            <RevealItem>
              <h1 className="mx-auto max-w-3xl font-serif text-5xl font-normal leading-[1.1] text-foreground md:text-6xl">
                We&rsquo;d Love to Hear From You
              </h1>
            </RevealItem>

            <RevealItem className="mt-8">
              <p className="mx-auto max-w-xl font-sans text-lg leading-relaxed text-muted">
                Whether you have a question about our therapies, want to book a
                consultation, or simply wish to learn more about Ayurveda —
                we&rsquo;re here for you.
              </p>
            </RevealItem>
          </RevealGroup>
        </section>

        {/* ── Form + details ───────────────────────────────────────────── */}
        <section className="bg-background px-6 pb-24 lg:px-12 lg:pb-32">
          <div className="mx-auto grid max-w-content grid-cols-1 gap-16 md:grid-cols-2 md:gap-14">
            <div>
              <RevealGroup>
                <RevealItem>
                  <p className="mb-8 font-sans text-xs uppercase tracking-[0.25em] text-primary">
                    Send a Message
                  </p>
                </RevealItem>
              </RevealGroup>
              <ContactForm />
            </div>

            <ContactInfo />
          </div>
        </section>

        <ContactTrust />

        <CTABanner
          heading="Ready to Start Your Healing Journey?"
          body="Book a consultation today and take the first step towards balanced wellness."
          cta="Book a Consultation"
          href="/book"
        />
      </main>
      <Footer />
    </>
  )
}
