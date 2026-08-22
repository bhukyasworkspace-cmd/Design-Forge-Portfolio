import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { site } from '@/data/site'
import { usePrefersReducedMotion } from '@/lib/hooks'

const SEEN_KEY = 'df-intro-seen'

/**
 * First-visit intro: a counter running to 100 behind a name reveal, then the
 * whole panel splits away. Skipped on repeat visits in the same tab and
 * whenever the OS asks for reduced motion.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion()
  // Held in a ref so an inline callback from the parent can't restart the intro.
  const done = useRef(onDone)
  done.current = onDone
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return sessionStorage.getItem(SEEN_KEY) !== '1'
    } catch {
      return true
    }
  })

  useEffect(() => {
    if (!open || reduced) {
      if (open) finish()
      else done.current()
      return
    }

    const start = performance.now()
    const duration = 1650
    let frame = 0
    let hold: ReturnType<typeof setTimeout>
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      setCount(Math.round(100 * (1 - Math.pow(1 - p, 3))))
      if (p < 1) frame = requestAnimationFrame(tick)
      else hold = setTimeout(finish, 520)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(hold)
    }

    function finish() {
      try {
        sessionStorage.setItem(SEEN_KEY, '1')
      } catch {
        /* private mode — the intro just plays again */
      }
      setOpen(false)
      done.current()
    }
  }, [open, reduced])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-ink-950"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.83, 0, 0.17, 1] }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-ink-950"
            exit={{ y: '-100%' }}
            transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1] }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-ink-950"
            exit={{ y: '100%' }}
            transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1] }}
          />

          <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="eyebrow mb-4">Portfolio</p>
              <h1 className="font-display text-[clamp(1.5rem,6.4vw,3.25rem)] font-extrabold uppercase tracking-[-0.035em] text-white">
                {site.name}
              </h1>
              <p className="mt-3 text-[11.5px] font-light tracking-[0.22em] text-white/35">
                {site.role.toUpperCase()}
              </p>
            </motion.div>

            <div className="h-px w-56 max-w-[70vw] overflow-hidden bg-white/10">
              <motion.div
                className="h-full origin-left bg-linear-to-r from-ember-400 to-flare-500"
                style={{ scaleX: count / 100 }}
              />
            </div>

            <span className="font-display text-xs tracking-[0.4em] text-white/40 tabular-nums">
              {String(count).padStart(3, '0')}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
