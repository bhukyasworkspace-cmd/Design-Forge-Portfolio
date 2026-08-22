import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { site, marqueeWords, tools } from '@/data/site'
import { asset, totals } from '@/lib/content'
import { usePrefersReducedMotion } from '@/lib/hooks'
import { Button, ButtonLink } from '@/components/Button'
import Marquee from '@/components/Marquee'
import { ArrowRight, DaVinciMark, Download, socialIcons } from '@/components/Icons'
import { scrollTo } from '@/components/SmoothScroll'

const EASE = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '18%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 0])
  const portraitY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-12%'])

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 26, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 1, delay, ease: EASE },
  })

  return (
    <section ref={ref} id="home" className="relative isolate overflow-hidden pt-28 sm:pt-32">
      <motion.div style={{ y: contentY, opacity: fade }} className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* ── Copy ─────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <motion.div {...rise(0.05)} className="mb-7 flex flex-wrap items-center gap-2.5">
              <span className="glass inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[11.5px] font-medium tracking-tight text-white/70">{site.availability}</span>
              </span>
              <span className="hidden rounded-full border border-white/10 px-3.5 py-1.5 text-[11.5px] font-light tracking-tight text-white/45 sm:inline">
                {site.location}
              </span>
            </motion.div>

            <h1 className="font-display font-extrabold leading-[0.86] tracking-[-0.045em]">
              <motion.span {...rise(0.12)} className="block text-[clamp(2.35rem,7vw,5.1rem)] text-white">
                Designs that
              </motion.span>
              <motion.span {...rise(0.2)} className="block text-[clamp(2.35rem,7vw,5.1rem)] text-ember">
                stop the scroll
              </motion.span>
              <motion.span
                {...rise(0.28)}
                className="mt-2 block text-[clamp(1.25rem,3.4vw,2.35rem)] font-light italic leading-tight tracking-[-0.025em] text-white/40"
              >
                and hold the eye.
              </motion.span>
            </h1>

            <motion.p {...rise(0.38)} className="mt-7 max-w-xl text-[14.5px] font-light leading-[1.75] text-white/55 sm:text-[15px]">
              {site.intro}
            </motion.p>

            <motion.div {...rise(0.46)} className="mt-9 flex flex-wrap items-center gap-3">
              <Button onClick={() => scrollTo('#work')} icon={<ArrowRight className="size-4" />}>
                View the work
              </Button>
              <ButtonLink href={asset(site.resume)} variant="glass" icon={<Download className="size-4" />}>
                Résumé
              </ButtonLink>
            </motion.div>

            <motion.div {...rise(0.54)} className="mt-9 flex items-center gap-3">
              <span className="hidden text-[10px] font-light tracking-[0.24em] text-white/25 sm:block">FIND ME</span>
              <span className="hidden h-px w-8 bg-white/12 sm:block" />
              {site.socials.map((social) => {
                const Icon = socialIcons[social.label]
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target={social.url.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    aria-label={social.label}
                    className="glass glass-sheen group grid size-11 place-items-center rounded-2xl text-white/60 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:border-white/25 hover:text-white hover:shadow-[0_16px_34px_-16px_rgb(255_92_26/.8)]"
                  >
                    <Icon className="size-[18px] transition-transform duration-500 group-hover:scale-110" />
                  </a>
                )
              })}
            </motion.div>
          </div>

          {/* ── Portrait ─────────────────────────────────────── */}
          <motion.div
            style={{ y: portraitY }}
            initial={{ opacity: 0, scale: 0.94, filter: 'blur(14px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 0.24, ease: EASE }}
            className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none"
          >
            <div className="relative">
              <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(circle_at_50%_40%,rgb(255_92_26/.3),transparent_68%)] blur-2xl" />
              {!reduced && (
                <div className="pointer-events-none absolute -inset-5 -z-10 rounded-[2.6rem] border border-dashed border-white/[0.09] motion-safe:animate-[spin_38s_linear_infinite]" />
              )}

              <div className="glass-tile relative overflow-hidden rounded-[2rem] p-2">
                <div className="relative overflow-hidden rounded-[1.6rem]">
                  <img
                    src={asset(site.profileImage)}
                    alt={site.name}
                    width={1000}
                    height={1000}
                    className="aspect-4/5 w-full object-cover object-top"
                    fetchPriority="high"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/10 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgb(255_138_61/.22),transparent_55%)] mix-blend-screen" />

                  <div className="absolute inset-x-3 bottom-3">
                    <div className="glass glass-sheen flex items-center justify-between gap-3 rounded-2xl bg-ink-850/60 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate font-display text-[12.5px] font-bold uppercase tracking-[0.03em] text-white">
                          {site.name}
                        </p>
                        <p className="mt-0.5 text-[11px] font-light tracking-tight text-white/45">{site.role}</p>
                      </div>
                      <span className="shrink-0 font-display text-[11px] font-bold text-ember-400 tabular-nums">
                        {totals.items || '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <FloatChip className="-left-6 top-10 sm:-left-10" delay={0.9} tool={tools[0]} caption={tools[0].name} />
              <FloatChip className="-right-4 top-[38%] sm:-right-8" delay={1.05} tool={tools[3]} caption="Colour" />
              <FloatChip className="-left-8 bottom-24 sm:-left-14" delay={1.2} tool={tools[1]} caption="Motion" />
            </div>
          </motion.div>
        </div>

        {/* ── Spec bar ───────────────────────────────────────── */}
        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.05] sm:mt-16 lg:grid-cols-4"
        >
          {[
            { k: 'Role', v: site.role },
            { k: 'Based in', v: site.location },
            { k: 'Experience', v: '1+ years' },
            { k: 'Focus', v: 'Social & short-form' },
          ].map((item) => (
            <div key={item.k} className="bg-ink-900/80 px-5 py-4 transition-colors duration-500 hover:bg-ink-800/80">
              <dt className="eyebrow">{item.k}</dt>
              <dd className="mt-1.5 text-[13.5px] font-medium tracking-tight text-white/85">{item.v}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      {/* ── Marquee ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative mt-16 border-y border-white/[0.07] py-5 sm:mt-20"
      >
        <Marquee words={marqueeWords} speed={46} />
      </motion.div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────── */

function FloatChip({
  tool,
  caption,
  className,
  delay,
}: {
  tool: { short: string; color: string; mark?: 'davinci' }
  caption: string
  className?: string
  delay: number
}) {
  const reduced = usePrefersReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={`absolute hidden sm:block ${className}`}
    >
      <motion.div
        animate={reduced ? {} : { y: [0, -9, 0] }}
        transition={{ duration: 4.5 + delay, repeat: Infinity, ease: 'easeInOut' }}
        className="glass glass-sheen flex items-center gap-2.5 rounded-2xl bg-ink-850/75 px-3 py-2.5"
      >
        <span
          className="grid size-8 shrink-0 place-items-center rounded-xl font-display text-[12px] font-bold"
          style={{
            color: tool.color,
            background: `color-mix(in oklab, ${tool.color} 16%, transparent)`,
            boxShadow: `0 0 20px -6px ${tool.color}`,
          }}
        >
          {tool.mark === 'davinci' ? <DaVinciMark className="size-5" /> : tool.short}
        </span>
        <span className="pr-1 text-[11px] font-medium tracking-tight text-white/70">{caption}</span>
      </motion.div>
    </motion.div>
  )
}
