import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { site } from '@/data/site'
import { asset } from '@/lib/content'
import { useCountUp, usePrefersReducedMotion } from '@/lib/hooks'
import { splitStat } from '@/lib/utils'
import { Reveal, RevealText } from '@/components/Reveal'
import SectionHeading from '@/components/SectionHeading'
import { Sparkle } from '@/components/Icons'

export default function About() {
  const imageRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-8%', '8%'])

  return (
    <section id="about" className="relative scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Get to know more" index="01" title="About" accent="me" />

        {/* ── Pull quote ───────────────────────────────────── */}
        <div className="mt-12 border-y border-white/[0.07] py-10 sm:py-12">
          <div className="flex items-start gap-5">
            <Sparkle className="mt-2 hidden size-5 shrink-0 text-ember-500 sm:block" />
            <RevealText
              text={site.quote}
              className="block max-w-4xl font-display text-[clamp(1.35rem,3.6vw,2.6rem)] font-light italic leading-[1.22] tracking-[-0.03em] text-white/85"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ── Portrait ───────────────────────────────────── */}
          <div className="lg:col-span-5">
            <Reveal direction="right">
              <div ref={imageRef} className="glass-tile overflow-hidden rounded-[1.75rem] p-1.5">
                <div className="relative aspect-4/5 overflow-hidden rounded-[1.4rem]">
                  <motion.img
                    src={asset(site.aboutImage)}
                    alt={`${site.name} at work`}
                    width={702}
                    height={1184}
                    loading="lazy"
                    style={{ y: imageY }}
                    className="absolute inset-[-8%] size-[116%] object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-950/90 via-transparent to-transparent" />
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-ink-950/55 px-4 py-3 backdrop-blur-xl">
                    <span className="text-[11.5px] font-light tracking-tight text-white/70">On set & at the desk</span>
                    <span className="font-body text-[10px] tracking-[0.2em] text-white/30">IND</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <Reveal delay={0.08}>
                <div className="glass-tile p-4">
                  <p className="eyebrow mb-2">Experience</p>
                  <p className="font-display text-lg font-extrabold tracking-[-0.03em] text-white">1+ Years</p>
                  <p className="mt-0.5 text-[11.5px] font-light text-white/40">Graphic & motion design</p>
                </div>
              </Reveal>
              <Reveal delay={0.14}>
                <div className="glass-tile p-4">
                  <p className="eyebrow mb-2">Education</p>
                  <p className="font-display text-lg font-extrabold tracking-[-0.03em] text-white">B.Tech</p>
                  <p className="mt-0.5 text-[11.5px] font-light text-white/40">AI &amp; Machine Learning</p>
                </div>
              </Reveal>
            </div>
          </div>

          {/* ── Copy ───────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <div className="space-y-5">
              {site.about.map((paragraph, i) => (
                <Reveal key={i} delay={0.08 + i * 0.1}>
                  <p className="max-w-2xl text-[14.5px] font-light leading-[1.85] text-white/50">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.05] sm:grid-cols-4">
              {site.stats.map((stat, i) => (
                <Stat key={stat.label} {...stat} delay={i * 0.08} />
              ))}
            </div>

            {/* Working principles */}
            <div className="mt-10 space-y-px overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.05]">
              {[
                ['Idea first', 'Every piece is built around one thing it has to say.'],
                ['Made for the feed', 'Checked at thumbnail size before it is called finished.'],
                ['Delivered whole', 'Graded, exported and named for the platform it is going to.'],
              ].map(([title, body], i) => (
                <Reveal key={title} delay={0.1 + i * 0.07}>
                  <div className="group flex items-start gap-4 bg-ink-900/80 px-5 py-4 transition-colors duration-500 hover:bg-ink-800/80">
                    <span className="mt-1 font-body text-[10px] tracking-[0.18em] text-ember-500 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-[13.5px] font-semibold tracking-tight text-white/90">{title}</p>
                      <p className="mt-0.5 text-[12.5px] font-light text-white/40">{body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────── */

function Stat({ value, label, sub, delay }: { value: string; label: string; sub: string; delay: number }) {
  const { prefix, number, suffix } = splitStat(value)
  const { ref, value: counted } = useCountUp(number)

  return (
    <Reveal delay={delay}>
      <div className="h-full bg-ink-900/80 p-5 transition-colors duration-500 hover:bg-ink-800/80">
        <p className="font-display text-[clamp(1.6rem,3.4vw,2.25rem)] font-extrabold tracking-[-0.05em] text-white tabular-nums">
          {prefix}
          <span ref={ref}>{counted}</span>
          <span className="text-ember-500">{suffix}</span>
        </p>
        <p className="mt-1 text-[12.5px] font-medium tracking-tight text-white/65">{label}</p>
        <p className="mt-0.5 text-[11px] font-light text-white/30">{sub}</p>
      </div>
    </Reveal>
  )
}
