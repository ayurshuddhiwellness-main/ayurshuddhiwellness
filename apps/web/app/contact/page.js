import SiteShell from '../../components/layout/SiteShell'
import CTABanner from '../../components/sections/CTABanner'
import ContactForm from '../../components/sections/ContactForm'
import ContactInfo from '../../components/sections/ContactInfo'
import ContactTrust from '../../components/sections/ContactTrust'
import { RevealGroup, RevealItem } from '../../components/ui/Reveal'
import SectionScrim from '../../components/ui/SectionScrim'
import { EYEBROW, HEADING, BODY } from '../../components/ui/surfaces'

export const metadata = {
  title: 'Contact Us | AyurshuddhiWellness',
  description:
    'Get in touch with AyurshuddhiWellness. Book an Ayurvedic consultation, ask about our therapies, or visit our clinic in Greater Noida.',
}

export default function ContactPage() {
  return (
    <SiteShell>
      <>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative px-6 py-24 text-center md:py-32 lg:px-12">
          <SectionScrim focus="center" />

          <RevealGroup className="relative z-10 mx-auto max-w-content">
            <RevealItem>
              <p className={`mb-6 ${EYEBROW}`}>Get in Touch</p>
            </RevealItem>

            <RevealItem>
              <h1
                className={`mx-auto max-w-3xl ${HEADING} text-4xl leading-[1.1] sm:text-5xl md:text-6xl`}
              >
                We&rsquo;d Love to Hear From You
              </h1>
            </RevealItem>

            <RevealItem className="mt-8">
              <p className={`mx-auto max-w-xl ${BODY} text-lg`}>
                Whether you have a question about our therapies, want to book a consultation, or
                simply wish to learn more about Ayurveda — we&rsquo;re here for you.
              </p>
            </RevealItem>
          </RevealGroup>
        </section>

        {/* ── Form + details ───────────────────────────────────────────── */}
        <section className="relative px-6 pb-24 lg:px-12 lg:pb-32">
          <SectionScrim focus="left" />

          <div className="relative z-10 mx-auto grid max-w-content grid-cols-1 gap-16 md:grid-cols-2 md:gap-14">
            <div>
              <RevealGroup>
                <RevealItem>
                  <p className={`mb-8 ${EYEBROW}`}>Send a Message</p>
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
      </>
    </SiteShell>
  )
}
