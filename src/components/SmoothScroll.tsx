import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { usePrefersReducedMotion } from '@/lib/hooks'

let lenis: Lenis | null = null

/** Scrolls to an element (or the top) through Lenis when it is running. */
export function scrollTo(target: string | number, offset = -80) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.35 })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' })
    return
  }
  document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Inertial scrolling for the whole app. Disabled when the OS asks for less motion. */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion()
  const { pathname } = useLocation()

  useEffect(() => {
    if (reduced) return
    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    })
    lenis = instance

    let frame = 0
    const raf = (time: number) => {
      instance.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      instance.destroy()
      lenis = null
    }
  }, [reduced])

  // Every route change starts at the top — hash links are handled separately.
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname])

  return <>{children}</>
}
