import { RevealGroup, RevealItem } from '../../ui/Reveal'
import PostCard from './PostCard'
import { getRelatedPosts } from '../../../lib/journal-posts'

export default function RelatedPosts({ slug }) {
  const related = getRelatedPosts(slug, 3)

  return (
    <section className="bg-background px-6 py-16 lg:px-12">
      <div className="mx-auto max-w-content">
        <RevealGroup>
          <RevealItem>
            <h2 className="font-serif text-3xl font-normal text-foreground">
              Keep reading
            </h2>
          </RevealItem>
        </RevealGroup>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {related.map((post) => (
            <RevealItem key={post.slug} className="h-full">
              <PostCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
