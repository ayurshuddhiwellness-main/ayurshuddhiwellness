import { RevealGroup, RevealItem } from '../../ui/Reveal'

export default function PostHero({ post }) {
  return (
    <section className="bg-background px-6 pt-20 pb-12 lg:px-12">
      <RevealGroup className="mx-auto max-w-3xl text-center">
        <RevealItem>
          <span className="inline-flex rounded-full bg-primary px-3 py-1 font-sans text-xs font-medium uppercase tracking-widest text-white">
            {post.category}
          </span>
        </RevealItem>
        <RevealItem className="mt-6">
          <h1 className="font-serif text-4xl font-normal leading-tight text-foreground md:text-5xl">
            {post.title}
          </h1>
        </RevealItem>
        <RevealItem className="mt-6">
          <div className="flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8E4DD] font-serif text-sm text-foreground"
            >
              {post.author.split(' ').slice(-1)[0][0]}
            </span>
            <span className="font-sans text-sm text-foreground">{post.author}</span>
            <span className="text-muted">·</span>
            <span className="font-sans text-sm text-muted">{post.date}</span>
          </div>
        </RevealItem>
        <RevealItem className="mt-10">
          <div className="flex aspect-[16/9] items-center justify-center rounded-2xl bg-[#E8E4DD]">
            <span className="font-sans text-sm text-muted">Featured image</span>
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  )
}
