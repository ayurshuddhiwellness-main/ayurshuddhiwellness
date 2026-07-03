import { notFound } from 'next/navigation'
import Navbar from '../../../components/layout/Navbar'
import Footer from '../../../components/layout/Footer'
import CTABanner from '../../../components/sections/CTABanner'
import PostHero from '../../../components/sections/journal/PostHero'
import PostBody from '../../../components/sections/journal/PostBody'
import RelatedPosts from '../../../components/sections/journal/RelatedPosts'
import { POSTS, getPostBySlug } from '../../../lib/journal-posts'

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} | AyurshuddhiWellness Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <>
      <Navbar />
      <main>
        <PostHero post={post} />
        <PostBody post={post} />
        <RelatedPosts slug={post.slug} />
        <CTABanner />
      </main>
      <Footer />
    </>
  )
}
