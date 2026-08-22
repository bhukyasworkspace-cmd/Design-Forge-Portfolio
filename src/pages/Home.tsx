import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '@/sections/Hero'
import FeaturedStrip from '@/sections/FeaturedStrip'
import About from '@/sections/About'
import Expertise from '@/sections/Expertise'
import Work from '@/sections/Work'
import Contact from '@/sections/Contact'
import Footer from '@/components/Footer'
import SectionRail from '@/components/SectionRail'
import { scrollTo } from '@/components/SmoothScroll'

const RAIL = [
  { id: 'home', label: 'Intro' },
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]

export default function Home() {
  const location = useLocation()

  // Arriving from a nav click on a sub-page: jump to the requested section.
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo
    if (!target) return
    const timer = setTimeout(() => scrollTo(`#${target}`), 260)
    window.history.replaceState({}, '')
    return () => clearTimeout(timer)
  }, [location.state])

  return (
    <>
      <SectionRail sections={RAIL} />
      <main>
        <Hero />
        <FeaturedStrip />
        <About />
        <Expertise />
        <Work />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
