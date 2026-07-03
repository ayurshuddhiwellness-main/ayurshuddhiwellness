import Link from 'next/link'

// Shared card for the grid and the related-posts row. CSS-only hover lift so it
// stays a server component; the fade-up reveal is supplied by the parent.
export default function PostCard({ post }) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group block h-full overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-[#E8E4DD]">
        <span className="font-sans text-sm text-muted">{post.imageLabel}</span>
      </div>
      <div className="p-6">
        <span className="font-sans text-xs uppercase tracking-widest text-primary">
          {post.category}
        </span>
        <h3 className="mt-2 font-serif text-lg font-normal leading-snug text-foreground">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 font-sans text-sm leading-relaxed text-muted">
          {post.excerpt}
        </p>
        <p className="mt-4 font-sans text-xs text-muted">{post.date}</p>
      </div>
    </Link>
  )
}
