'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { EASE } from '../../ui/motion'
import PostCard from './PostCard'
import { CATEGORIES, getGridPosts } from '../../../lib/journal-posts'

const GRID_POSTS = getGridPosts()

export default function PostGrid() {
  const [active, setActive] = useState('All')
  const posts =
    active === 'All' ? GRID_POSTS : GRID_POSTS.filter((p) => p.category === active)

  return (
    <section className="bg-background px-6 py-16 lg:px-12">
      <div className="mx-auto max-w-content">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = cat === active
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full px-5 py-2 font-sans text-sm transition-colors duration-300 ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'border border-border text-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: EASE, delay: (i % 3) * 0.1 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
