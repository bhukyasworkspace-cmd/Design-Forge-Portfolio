import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { site } from '@/data/site'
import { categories } from '@/lib/content'
import { useActiveSection, useScrollLock } from '@/lib/hooks'
import { scrollTo } from './SmoothScroll'
import { ArrowUpRight, Close } from './Icons'
import { cn } from '@/lib/utils'

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]

// Stable identity — a fresh array here would restart the section observer on every render.
const LINK_IDS = LINKS.map((l) => l.id)

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const isHome = pathname === '/'
  const active = useActiveSection(LINK_IDS)

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40))
  useScrollLock(menuOpen)
  useEffect(() => setMenuOpen(false), [pathname])

  const go = (id: string) => {
    setMenuOpen(false)
    if (isHome) scrollTo(`#${id}`)
    else navigate('/', { state: { scrollTo: id } })
  }

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[75] flex justify-center px-4 pt-4 sm:px-6 sm:pt-5">
        <motion.nav
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'pointer-events-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-full px-4 py-2 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] sm:px-5',
            scrolled || !isHome ? 'glass glass-sheen' : 'border border-transparent',
          )}
        >
          {/* Name lockup */}
          <Link to="/" className="group flex min-w-0 shrink items-baseline gap-2" aria-label={`${site.name} — home`}>
            <span className="truncate font-display text-[13.5px] font-bold uppercase tracking-[0.02em] text-white sm:text-[15px]">
              {site.name}
            </span>
            <span className="hidden shrink-0 text-[10px] font-light uppercase tracking-[0.24em] text-white/35 lg:inline">
              {site.role}
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden shrink-0 items-center gap-0.5 md:flex">
            {LINKS.map((link) => {
              const current = isHome && active === link.id
              return (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => go(link.id)}
                    className={cn(
                      'relative rounded-full px-3.5 py-2 text-[12.5px] font-medium tracking-tight transition-colors duration-300',
                      current ? 'text-white' : 'text-white/50 hover:text-white/90',
                    )}
                  >
                    {current && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/[0.08] ring-1 ring-white/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={`mailto:${site.email}`}
              className="group hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-[12.5px] font-semibold tracking-tight text-ink-950 transition-all duration-400 hover:bg-ember-500 sm:flex"
            >
              Hire me
              <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-white/25 md:hidden"
            >
              <span className="flex flex-col items-center gap-[5px]">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
              </span>
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[80] flex flex-col bg-ink-950/94 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-center justify-between px-6 pt-6">
              <span className="eyebrow">{site.name}</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="grid size-10 place-items-center rounded-full border border-white/12 text-white"
              >
                <Close className="size-4" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-1 px-6 pb-16">
              {LINKS.map((link, i) => (
                <motion.button
                  key={link.id}
                  type="button"
                  onClick={() => go(link.id)}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-baseline justify-between border-b border-white/8 py-4 text-left"
                >
                  <span className="font-display text-3xl font-bold tracking-[-0.03em] text-white">{link.label}</span>
                  <span className="font-body text-[11px] tracking-[0.2em] text-white/25">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </motion.button>
              ))}

              {categories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38, duration: 0.6 }}
                  className="mt-8"
                >
                  <p className="eyebrow mb-3">Collections</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <Link key={c.slug} to={`/work/${c.slug}`} className="glass rounded-full px-4 py-2 text-[13px] text-white/80">
                        {c.title}
                        <span className="ml-2 text-white/30">{c.count}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.a
                href={`mailto:${site.email}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.46, duration: 0.6 }}
                className="mt-8 flex items-center justify-between rounded-2xl bg-white px-5 py-4 font-semibold tracking-tight text-ink-950"
              >
                Start a project
                <ArrowUpRight className="size-4" />
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
