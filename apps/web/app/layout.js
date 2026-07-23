import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import MotionProvider from '../components/ui/MotionProvider'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'AyurshuddhiWellness | Ayurvedic Wellness',
  description:
    'Rooted in ancient wisdom. Refined for modern living. Explore AyurshuddhiWellness\'s curated range of Ayurvedic wellness products.',
  openGraph: {
    title: 'AyurshuddhiWellness | Ayurvedic Wellness',
    description: 'Rooted in ancient wisdom. Refined for modern living.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
