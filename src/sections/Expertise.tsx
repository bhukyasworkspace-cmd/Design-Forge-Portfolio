import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { skills, tools, type Tool } from '@/data/site'
import { useSpotlight } from '@/lib/hooks'
import { Reveal } from '@/components/Reveal'
import SectionHeading from '@/components/SectionHeading'
import { DaVinciMark, SkillIcon } from '@/components/Icons'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Disciplines as an index + detail panel rather than a wall of equal cards:
 * hovering or focusing a row swaps the panel, so the section rewards
 * exploration instead of just listing credentials.
 */
export default function Expertise() {
  const [index, setIndex] = useState(0)
  const active = skills[index]

  return (
    <section id="expertise" className="relative scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="What I do"
          index="02"
          title="Creative"
          accent="expertise"
          description="Eight disciplines that carry a project from the first moodboard to the graded, platform-ready export."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {/* ── Index ──────────────────────────────────────── */}
          <Reveal direction="right" className="lg:col-span-5">
            <ul className="glass-tile overflow-hidden p-1.5">
              {skills.map((skill, i) => {
                const current = i === index
                return (
                  <li key={skill.title}>
                    <button
                      type="button"
                      onMouseEnter={() => setIndex(i)}
                      onFocus={() => setIndex(i)}
                      onClick={() => setIndex(i)}
                      aria-current={current}
                      className="relative flex w-full items-center gap-3.5 rounded-2xl px-3.5 py-3 text-left transition-colors duration-300"
                    >
                      {current && (
                        <motion.span
                          layoutId="skill-active"
                          className="absolute inset-0 rounded-2xl bg-white/[0.07] ring-1 ring-white/10"
                          transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                        />
                      )}

                      <span
                        className={cn(
                          'relative font-body text-[10px] tracking-[0.16em] tabular-nums transition-colors duration-300',
                          current ? 'text-ember-500' : 'text-white/25',
                        )}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      <span
                        className={cn(
                          'relative grid size-9 shrink-0 place-items-center rounded-xl border transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]',
                          current
                            ? 'border-ember-500/45 bg-ember-500/12 text-ember-400 shadow-[0_10px_26px_-14px_rgb(255_92_26/.95)]'
                            : 'border-white/10 bg-white/[0.04] text-white/45',
                        )}
                      >
                        <SkillIcon name={skill.icon} className="size-[18px]" />
                      </span>

                      <span className="relative min-w-0 flex-1">
                        <span
                          className={cn(
                            'block truncate text-[13.5px] font-medium tracking-tight transition-colors duration-300',
                            current ? 'text-white' : 'text-white/60',
                          )}
                        >
                          {skill.title}
                        </span>
                        <span className="block truncate text-[11px] font-light text-white/30">{skill.level}</span>
                      </span>

                      <span className="relative hidden w-16 shrink-0 sm:block">
                        <span className="block h-[3px] overflow-hidden rounded-full bg-white/8">
                          <motion.span
                            className="block h-full origin-left rounded-full bg-linear-to-r from-ember-400 to-flare-500"
                            animate={{ scaleX: current ? skill.strength / 100 : 0.14 }}
                            transition={{ duration: 0.7, ease: EASE }}
                          />
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </Reveal>

          {/* ── Detail panel ───────────────────────────────── */}
          <Reveal direction="left" delay={0.1} className="lg:col-span-7">
            <div className="glass-tile relative h-full overflow-hidden p-6 sm:p-8">
              <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[radial-gradient(circle,rgb(255_92_26/.2),transparent_65%)] blur-2xl" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.title}
                  initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="relative flex h-full flex-col"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid size-14 shrink-0 place-items-center rounded-2xl border border-ember-500/35 bg-ember-500/10 text-ember-400 shadow-[0_16px_40px_-20px_rgb(255_92_26/.95)]">
                      <SkillIcon name={active.icon} className="size-6" />
                    </div>
                    <div className="text-right">
                      <p className="font-display text-[2.5rem] font-extrabold leading-none tracking-[-0.05em] text-white/12 tabular-nums">
                        {String(index + 1).padStart(2, '0')}
                      </p>
                    </div>
                  </div>

                  <h3 className="mt-6 font-display text-[clamp(1.5rem,3.4vw,2.35rem)] font-extrabold leading-tight tracking-[-0.04em] text-white">
                    {active.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] font-light tracking-tight text-ember-400/90">{active.blurb}</p>

                  <p className="mt-5 max-w-xl text-[14px] font-light leading-[1.8] text-white/50">{active.detail}</p>

                  <div className="mt-7 flex flex-wrap gap-1.5">
                    {active.deliverables.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11.5px] font-light tracking-tight text-white/60"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                    <div className="flex-1">
                      <div className="mb-2 flex items-baseline justify-between">
                        <span className="eyebrow">Proficiency</span>
                        <span className="font-display text-[13px] font-bold text-white tabular-nums">
                          {active.strength}
                          <span className="text-white/30">/100</span>
                        </span>
                      </div>
                      <div className="h-[5px] overflow-hidden rounded-full bg-white/8">
                        <motion.div
                          className="h-full origin-left rounded-full bg-linear-to-r from-ember-400 via-ember-500 to-flare-500"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: active.strength / 100 }}
                          transition={{ duration: 1, ease: EASE }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        {/* ── Tools ──────────────────────────────────────────── */}
        <div className="mt-14">
          <div className="mb-6 flex items-center gap-4">
            <h3 className="whitespace-nowrap font-display text-[13px] font-bold uppercase tracking-[0.08em] text-white/85">
              Tools I run daily
            </h3>
            <span className="h-px flex-1 bg-linear-to-r from-white/12 to-transparent" />
            <span className="font-body text-[10.5px] tracking-[0.2em] text-white/25 tabular-nums">
              {String(tools.length).padStart(2, '0')}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {tools.map((tool, i) => (
              <ToolTile key={tool.name} tool={tool} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────── */

function ToolTile({ tool, delay }: { tool: Tool; delay: number }) {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>()

  return (
    <Reveal delay={delay}>
      <div
        ref={ref}
        onPointerMove={onPointerMove}
        className="glass-tile group relative h-full overflow-hidden p-5 hover:-translate-y-1.5 hover:border-white/20"
      >
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{ background: `radial-gradient(circle at 25% 0%, ${tool.color}22, transparent 62%)` }}
        />

        <div
          className="relative mb-5 grid size-14 place-items-center overflow-hidden rounded-2xl border transition-all duration-600 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
          style={{
            color: tool.color,
            borderColor: `color-mix(in oklab, ${tool.color} 42%, transparent)`,
            background: `linear-gradient(150deg, ${tool.tint}, color-mix(in oklab, ${tool.tint} 60%, transparent))`,
            boxShadow: `0 0 0 1px rgb(255 255 255 / .05) inset, 0 14px 34px -18px ${tool.color}`,
          }}
        >
          <span className="absolute inset-0 bg-[linear-gradient(140deg,rgb(255_255_255/.22),transparent_45%)]" />
          {tool.mark === 'davinci' ? (
            <DaVinciMark className="relative size-9" />
          ) : (
            <span className="relative font-display text-xl font-extrabold tracking-[-0.02em]">{tool.short}</span>
          )}
        </div>

        <h4 className="text-[14px] font-semibold leading-tight tracking-tight text-white">{tool.name}</h4>
        <p className="mt-1 text-[12px] font-light text-white/40">{tool.use}</p>

        <div className="mt-4 flex items-center gap-2">
          <span className="size-1 rounded-full" style={{ background: tool.color }} />
          <span className="text-[10.5px] font-light uppercase tracking-[0.14em] text-white/35">{tool.level}</span>
        </div>
      </div>
    </Reveal>
  )
}
