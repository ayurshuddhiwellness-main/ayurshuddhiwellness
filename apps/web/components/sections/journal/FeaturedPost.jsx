import Link from 'next/link'
import { RevealGroup, RevealItem } from '../../ui/Reveal'
import { getFeaturedPost } from '../../../lib/journal-posts'

export default function FeaturedPost() {
  const post = getFeaturedPost()

  return (
    <section className="bg-white px-6 py-16 lg:px-12">
      <RevealGroup className="mx-auto max-w-content">
        <RevealItem>
          <Link
            href={`/blogs/${post.slug}`}
            className="group block overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:shadow-soft"
          >
            {/* Wide hero image */}
            <div className="flex aspect-[21/9] items-center justify-center bg-[#E8E4DD]">
              <span className="font-sans text-sm text-muted">{post.imageLabel}</span>
            </div>

            {/* Text below image */}
            <div className="p-8 md:p-10">
              <span className="inline-flex rounded-full bg-primary px-3 py-1 font-sans text-xs font-medium uppercase tracking-widest text-white">
                {post.category}
              </span>
              <h2 className="mt-5 max-w-3xl font-serif text-3xl font-normal leading-tight text-foreground md:text-4xl">
                {post.title}
              </h2>
              <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-muted">
                {post.excerpt}
              </p>

              {/* Author + date */}
              <div className="mt-6 flex items-center gap-3">
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
            </div>
          </Link>
        </RevealItem>
      </RevealGroup>
    </section>
  )
}
