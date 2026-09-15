import Image from 'next/image'
import { RevealGroup, RevealItem } from '../ui/Reveal'
import AnimatedLink from '../ui/AnimatedLink'

/* ──────────────────────────────────────────────────────────────────────────
   The journal teaser, over the page photograph.

   Treated as the sibling of AboutPractitioner's over-media rendering, and
   deliberately so: light type on a graded local scrim, rounded-2xl, hairline
   white borders, the outlined pill for a secondary action. The linen bed this
   section used before is gone — the dark tokens need an almost opaque wash to
   clear 4.5:1 over this photograph, which is why the copy here was still hard
   to read with the bed in place. Light type on a dark scrim clears it while
   leaving the picture visible, the same trade ServiceSection documents.
   ────────────────────────────────────────────────────────────────────────── */

/* The featured post.

   THE BLOG IS NOT LIVE YET: next.config.js redirects both /blogs and
   /blogs/:slug to /coming-soon, so `href` below currently lands there. The
   label is "Sample post" for that reason — it is not a published article and
   must not be dressed as one.

   `image` is the honest part of a compromise. There is no blog imagery in
   public/ at all, and this section previously rendered a grey box reading
   "Blog post image". Rather than invent a URL, it borrows the one existing
   asset that is both text-free and editorially right for the subject:
   services/ayurveda.JPG — herbs, roots and a mortar on a dark ground. Two
   caveats worth knowing when a real image arrives: most of the other service
   photographs have their own titles burned into them (naturopathy.JPG says
   "NATUROPATHY" across the top), and this one is only 502x611, so it is soft
   on a 2x screen. Swapping all of this is a four-line edit here — nothing
   downstream reads these strings. */
const FEATURED = {
  label: 'Sample post',
  title: 'The Morning Ritual: How Dinacharya Transforms Your Day',
  href: '/blogs/dinacharya-daily-routine',
  image: '/images/services/ayurveda.JPG',
  alt: 'Ayurvedic herbs, roots, powders and oils arranged around a stone mortar and pestle',
}

/* Wide: the mirror of AboutPractitioner's scrim, because the copy is on the
   LEFT here and the card on the right. A radial pool does the work under the
   text; the linear layer tips the balance across the width and feathers away
   over the photograph's open right side. The card carries its own ground, so
   the scrim is not asked to light it. */
const SCRIM_WIDE =
  'radial-gradient(ellipse 50% 60% at 27% 50%, rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.27) 48%, transparent 78%),' +
  'linear-gradient(to left, transparent 0%, rgba(0,0,0,0.04) 34%, rgba(0,0,0,0.17) 62%, rgba(0,0,0,0.30) 100%)'

/* Narrow: the columns stack and the copy sits at the top with the card under
   it, so the weight runs down the frame and eases off where the card begins. */
const SCRIM_NARROW =
  'linear-gradient(to bottom, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0.40) 46%, rgba(0,0,0,0.26) 76%, rgba(0,0,0,0.20) 100%)'

// Masked away at the section's own top and bottom edges so the treatment never
// ends on a hard line against the section below. Same value AboutPractitioner
// uses — the two sections are meant to open and close identically.
const FEATHER = 'linear-gradient(to bottom, transparent 0%, #000 11%, #000 89%, transparent 100%)'

export default function Journal() {
  return (
    /* The tint-and-hairline alternation this ran against the section above it
       is gone with the shared backdrop: there are no two surfaces left to tell
       apart, and the border only drew a line across the photograph. */
    <section
      id="journal"
      data-snap-section
      /* See RootedInTradition for why the viewport height is a minimum.
         overflow-x-hidden keeps the negatively-inset scrim from widening the
         document on narrow screens. */
      className="relative flex flex-col justify-center overflow-x-hidden px-6 py-24 motion-safe:min-h-screen lg:px-12"
    >
      {/* Two scrims rather than one, because the gradient's direction has to
          follow the layout — across the frame above md, down it below. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{ background: SCRIM_NARROW, maskImage: FEATHER, WebkitMaskImage: FEATHER }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{ background: SCRIM_WIDE, maskImage: FEATHER, WebkitMaskImage: FEATHER }}
      />

      {/* Six columns of copy against four of card (five below lg, where the
          columns themselves are too narrow to spare one), leaving 7 and 8 empty.
          This ran at md:gap-0 with a pr-20 on the left to compensate, which
          butted the two halves together; the gutter is now wide enough that
          the photograph runs between them, which is the relationship with the
          background the section had lost. */}
      <div className="relative z-10 mx-auto grid w-full max-w-content items-center gap-12 md:grid-cols-12 md:gap-8">
        {/* Left — the section's own copy */}
        <RevealGroup className="md:col-span-6">
          <RevealItem>
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-white/75 sm:text-sm">
              From the Blog
            </p>
          </RevealItem>

          <RevealItem>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight text-background [text-shadow:0_1px_3px_rgba(0,0,0,0.5),0_6px_30px_rgba(0,0,0,0.45)] sm:text-4xl lg:text-5xl">
              Rooted in tradition.
              <br />
              Written for the curious.
            </h2>
          </RevealItem>

          <RevealItem className="mt-6">
            <p className="max-w-md font-sans text-base leading-relaxed text-white/85 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
              Explore ancient Ayurvedic wisdom through modern stories — seasonal rituals, herbal
              spotlights, and guides to mindful living.
            </p>
          </RevealItem>

          <RevealItem className="mt-8 md:mt-10">
            {/* Outlined, not filled. This was a solid sage pill, which put a
                second primary button on the page competing with Book Now in
                the bar above it — and the journal is not the page's primary
                action. Same treatment as the header's Login for that reason. */}
            <AnimatedLink
              href="/blogs"
              arrow
              className="inline-flex items-center rounded-full border border-white/35 px-7 py-3 font-sans text-sm font-medium text-white transition-[color,background-color,border-color] duration-300 hover:border-white/60 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              Read more
            </AnimatedLink>
          </RevealItem>
        </RevealGroup>

        {/* Right — the featured post, as a compact editorial panel */}
        <RevealGroup className="md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
          <RevealItem>
            {/* Deep pine rather than linen, at the same tint the nav bar's
                veil uses, so the two translucent surfaces on this page are
                obviously the same material. The picture is the bright element
                in the panel; the panel itself stays quiet and lets the
                photograph behind it carry on reading. */}
            <article
              className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-white/20 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.8)] backdrop-blur-[2px] md:max-w-none"
              style={{ background: 'color-mix(in srgb, #16302E 48%, transparent)' }}
            >
              {/* 3:2 out of a 502x611 portrait source: `cover` scales it down
                  and keeps the middle band, which is where the bowl and the
                  mortar sit, so the crop loses only the outer scatter of
                  herbs. */}
              <div className="relative aspect-[3/2] w-full">
                <Image
                  src={FEATURED.image}
                  alt={FEATURED.alt}
                  fill
                  sizes="(min-width: 768px) 30vw, 88vw"
                  className="object-cover object-center"
                />

                {/* This asset is a studio still life on a flat slate ground,
                    which against a warm garden photograph reads as a cool grey
                    rectangle laid on top. The gradient settles its foot into
                    the panel's own tint, so the picture and the text below it
                    read as one piece rather than two stacked blocks. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                  style={{
                    background:
                      'linear-gradient(to top, color-mix(in srgb, #16302E 72%, transparent) 0%, transparent 100%)',
                  }}
                />
              </div>

              {/* The "Blog" bar that used to sit above the picture is gone: it
                  repeated the section's own eyebrow a few centimetres away and
                  was the louder of the two. */}
              <div className="p-5">
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-white/60">
                  {FEATURED.label}
                </p>

                <h3 className="mt-2 font-serif text-lg font-normal leading-snug text-background">
                  {FEATURED.title}
                </h3>

                {/* No excerpt: there is no post behind this to excerpt from,
                    and inventing one would be writing an article. */}
                <AnimatedLink
                  href={FEATURED.href}
                  arrow
                  scale={false}
                  className="mt-4 inline-flex items-center rounded-sm font-sans text-sm text-white/85 underline underline-offset-4 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  Read article
                </AnimatedLink>
              </div>
            </article>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  )
}
