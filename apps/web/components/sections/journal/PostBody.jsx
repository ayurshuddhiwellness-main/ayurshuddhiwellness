import { RevealGroup, RevealItem } from '../../ui/Reveal'

// Placeholder editorial content stands in for real post bodies for now.
export default function PostBody({ post }) {
  return (
    <section className="bg-background px-6 pb-16 lg:px-12">
      <RevealGroup className="mx-auto max-w-2xl" trigger="mount">
        <RevealItem>
          <p className="font-sans text-lg leading-loose text-foreground">
            {post.excerpt}
          </p>
        </RevealItem>

        <RevealItem className="mt-6">
          <p className="font-sans text-base leading-loose text-muted">
            In Ayurveda, health is not a fixed state to be reached but a balance
            to be tended — daily, gently, and with attention. The practices we
            return to here are not new; they are thousands of years old, refined
            across generations of careful observation. What modern life asks of
            us is simply to translate them into the rhythms of a contemporary
            day.
          </p>
        </RevealItem>

        <RevealItem className="mt-10">
          <blockquote className="border-l-2 border-primary pl-6 font-serif text-2xl font-normal italic leading-snug text-foreground">
            “Treat the person, not the symptom — for the body is a whole, and
            healing follows the whole.”
          </blockquote>
        </RevealItem>

        <RevealItem className="mt-10">
          <h2 className="font-serif text-2xl font-normal text-foreground">
            Beginning where you are
          </h2>
        </RevealItem>

        <RevealItem className="mt-4">
          <p className="font-sans text-base leading-loose text-muted">
            Start small. A single practice, held consistently, will reshape your
            wellbeing more than a dozen taken up and abandoned. Notice how your
            energy moves through the day, how your digestion responds to what and
            when you eat, how sleep arrives. These observations are the raw
            material of an Ayurvedic life.
          </p>
        </RevealItem>

        <RevealItem className="mt-6">
          <p className="font-sans text-base leading-loose text-muted">
            Over time, the routine stops feeling like discipline and begins to
            feel like care — a quiet conversation with your own constitution,
            returned to morning after morning. That is the work, and it is also
            the reward.
          </p>
        </RevealItem>
      </RevealGroup>
    </section>
  )
}
