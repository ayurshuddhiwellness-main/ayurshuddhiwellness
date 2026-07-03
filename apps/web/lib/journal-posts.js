// Placeholder journal content. Swap for a CMS later — the shape is what the
// listing and post pages consume (slug, title, excerpt, category, author, date).

export const CATEGORIES = [
  'All',
  'Ayurveda',
  'Panchakarma',
  'Yoga & Meditation',
  'Rituals',
]

export const POSTS = [
  {
    slug: 'dinacharya-daily-routine',
    title: 'Dinacharya: The Art of the Daily Routine',
    excerpt:
      'How aligning your day with nature’s rhythms — from the hour you wake to the way you eat — quietly rebuilds your health from the ground up.',
    category: 'Rituals',
    author: 'Dr. Meera Sharma',
    date: 'June 24, 2026',
    featured: true,
    imageLabel: 'Featured image',
  },
  {
    slug: 'understanding-your-dosha',
    title: 'Understanding Your Dosha',
    excerpt:
      'Vata, Pitta, Kapha — the three energies that shape your constitution, and why knowing yours changes everything about how you should live.',
    category: 'Ayurveda',
    author: 'Dr. Arjun Patel',
    date: 'June 18, 2026',
    imageLabel: 'Post image',
  },
  {
    slug: 'five-actions-panchakarma',
    title: 'The Five Actions of Panchakarma',
    excerpt:
      'A clear, unhurried look at the classical detoxification therapy — what each of the five actions does, and who it serves.',
    category: 'Panchakarma',
    author: 'Dr. Meera Sharma',
    date: 'June 11, 2026',
    imageLabel: 'Post image',
  },
  {
    slug: 'pranayama-modern-stress',
    title: 'Pranayama for Modern Stress',
    excerpt:
      'Three breathing practices you can fold into a working day to settle an overstimulated nervous system in minutes.',
    category: 'Yoga & Meditation',
    author: 'Anika Rao',
    date: 'June 4, 2026',
    imageLabel: 'Post image',
  },
  {
    slug: 'eating-with-the-seasons',
    title: 'Eating with the Seasons',
    excerpt:
      'Ritucharya — the Ayurvedic practice of shifting your diet as the seasons turn — and a simple framework for getting started.',
    category: 'Rituals',
    author: 'Dr. Arjun Patel',
    date: 'May 28, 2026',
    imageLabel: 'Post image',
  },
  {
    slug: 'ashwagandha-adaptogens',
    title: 'Ashwagandha and the Adaptogens',
    excerpt:
      'What centuries of Ayurvedic use and a growing body of modern research agree on when it comes to this quietly powerful root.',
    category: 'Ayurveda',
    author: 'Dr. Meera Sharma',
    date: 'May 21, 2026',
    imageLabel: 'Post image',
  },
  {
    slug: 'abhyanga-self-massage',
    title: 'Abhyanga: The Practice of Self-Massage',
    excerpt:
      'A few minutes of warm oil before your shower is one of the oldest — and most grounding — acts of daily self-care.',
    category: 'Panchakarma',
    author: 'Anika Rao',
    date: 'May 14, 2026',
    imageLabel: 'Post image',
  },
  {
    slug: 'meditation-as-medicine',
    title: 'Meditation as Medicine',
    excerpt:
      'Stillness is not the absence of doing — it is its own discipline, and in Ayurveda, a genuine therapy for body and mind.',
    category: 'Yoga & Meditation',
    author: 'Dr. Arjun Patel',
    date: 'May 7, 2026',
    imageLabel: 'Post image',
  },
]

export function getFeaturedPost() {
  return POSTS.find((p) => p.featured) ?? POSTS[0]
}

export function getGridPosts() {
  return POSTS.filter((p) => !p.featured)
}

export function getPostBySlug(slug) {
  return POSTS.find((p) => p.slug === slug)
}

export function getRelatedPosts(slug, count = 3) {
  return POSTS.filter((p) => p.slug !== slug).slice(0, count)
}
