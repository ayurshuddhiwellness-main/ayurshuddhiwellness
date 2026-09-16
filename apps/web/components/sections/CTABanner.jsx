import { RevealGroup, RevealItem } from '../ui/Reveal'
import AnimatedLink from '../ui/AnimatedLink'
import SectionScrim from '../ui/SectionScrim'
import { HEADING, BODY, BTN_PRIMARY } from '../ui/surfaces'

/* The closing ask, shared by /services, /contact and /profile.

   It used to paint a full-bleed sage slab. Over the site photograph that is a
   large opaque block, so the band is gone and the section carries its weight
   through type and a single filled button instead.

   `href` previously defaulted to '#contact', which resolved only on pages that
   happen to render the footer's id="contact" — and pointed at a footer rather
   than anywhere useful. It now defaults to the contact page, which is what
   every caller actually meant.
*/
export default function CTABanner({
  heading = 'Begin your wellness journey.',
  body = 'Whether you seek balance through Ayurveda, purification through Panchakarma, or stillness through Yoga — your path starts here.',
  cta = 'Book a Consultation',
  href = '/contact',
}) {
  return (
    <section className="relative px-6 py-20 lg:px-12">
      <SectionScrim focus="center" />

      <RevealGroup className="relative z-10 mx-auto max-w-content text-center">
        <RevealItem>
          <h2 className={`${HEADING} text-3xl md:text-4xl`}>{heading}</h2>
        </RevealItem>

        <RevealItem className="mt-4">
          <p className={`mx-auto max-w-lg ${BODY} text-base`}>{body}</p>
        </RevealItem>

        <RevealItem className="mt-8">
          <AnimatedLink href={href} className={BTN_PRIMARY}>
            {cta}
          </AnimatedLink>
        </RevealItem>
      </RevealGroup>
    </section>
  )
}
