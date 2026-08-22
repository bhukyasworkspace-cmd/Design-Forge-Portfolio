import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { getCategory, nextCategory, type WorkItem } from '@/lib/content'
import { Reveal, RevealText } from '@/components/Reveal'
import WorkCard from '@/components/WorkCard'
import JustifiedGallery from '@/components/JustifiedGallery'
import Lightbox, { type LightboxState } from '@/components/Lightbox'
import Footer from '@/components/Footer'
import { ArrowLeft, ArrowUpRight, Grid } from '@/components/Icons'
import { cn } from '@/lib/utils'

type Layout = 'adaptive' | 'uniform'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const category = getCategory(slug)
  const [active, setActive] = useState<string>('all')
  const [layout, setLayout] = useState<Layout>('adaptive')
  const [lightbox, setLightbox] = useState<LightboxState>(null)

  const sections = useMemo(
    () => (category ? (active === 'all' ? category.sections : category.sections.filter((s) => s.slug === active)) : []),
    [category, active],
  )

  if (!category) return <Navigate to="/" replace />

  const next = nextCategory(category.slug)

  const open = (items: WorkItem[], index: number, context: string) => setLightbox({ items, index, context })

  return (
    <>
      <main className="pt-28 sm:pt-32">
        {/* ── Header ─────────────────────────────────────────── */}
        <header className="relative overflow-hidden">
          {/* Blurred cover as atmosphere */}
          {category.cover && (
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[56vh]">
              <img
                src={category.cover}
                alt=""
                className="size-full scale-110 object-cover opacity-25 blur-3xl"
                style={{
                  maskImage: 'linear-gradient(to bottom, #000 0%, rgb(0 0 0 / .45) 55%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, rgb(0 0 0 / .45) 55%, transparent 100%)',
                }}
              />
            </div>
          )}

          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <Reveal>
              <Link
                to="/"
                className="group inline-flex items-center gap-2 text-[12.5px] text-white/40 transition-colors hover:text-white"
              >
                <ArrowLeft className="size-3.5 transition-transform duration-500 group-hover:-translate-x-1" />
                All collections
              </Link>
            </Reveal>

            <div className="mt-7 flex flex-wrap items-end justify-between gap-8">
              <div className="max-w-2xl">
                <Reveal delay={0.05}>
                  <span className="glass inline-flex rounded-full px-3.5 py-1.5 text-[10.5px] font-medium uppercase tracking-[0.18em] text-white/65">
                    {category.tagline}
                  </span>
                </Reveal>

                <h1 className="mt-5 font-display text-[clamp(2.6rem,9vw,6rem)] font-medium leading-[0.9] tracking-[-0.05em] text-white">
                  <RevealText text={category.title} />
                </h1>

                {category.description && (
                  <Reveal delay={0.16}>
                    <p className="mt-5 text-[15px] leading-relaxed text-white/45">{category.description}</p>
                  </Reveal>
                )}
              </div>

              <Reveal delay={0.2}>
                <div className="flex items-end gap-7">
                  <Metric value={category.count} label="Pieces" />
                  <Metric value={category.sections.length} label="Sections" />
                </div>
              </Reveal>
            </div>
          </div>
        </header>

        {/* ── Filters ────────────────────────────────────────── */}
        <div className="sticky top-[4.75rem] z-50 mt-12 px-5 sm:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-2">
            <div className="glass glass-sheen no-scrollbar flex flex-1 items-center gap-1 overflow-x-auto rounded-full p-1.5">
              <FilterChip label="All work" count={category.count} active={active === 'all'} onClick={() => setActive('all')} />
              {category.sections.map((section) => (
                <FilterChip
                  key={section.slug}
                  label={section.title}
                  count={section.count}
                  active={active === section.slug}
                  onClick={() => setActive(section.slug)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setLayout((l) => (l === 'adaptive' ? 'uniform' : 'adaptive'))}
              title={layout === 'adaptive' ? 'Switch to uniform grid' : 'Switch to adaptive rows'}
              aria-label={layout === 'adaptive' ? 'Switch to uniform grid' : 'Switch to adaptive rows'}
              className="glass glass-sheen hidden size-11 shrink-0 place-items-center rounded-full text-white/60 transition-colors hover:text-white sm:grid"
            >
              <Grid className={cn('size-4 transition-transform duration-500', layout === 'uniform' && 'rotate-45')} />
            </button>
          </div>
        </div>

        {/* ── Sections ───────────────────────────────────────── */}
        <div className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
          {sections.map((section, si) => (
            <section key={section.slug} className="mt-16 first:mt-14">
              <Reveal>
                <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.07] pb-4">
                  <div>
                    {section.breadcrumb.length > 1 && (
                      <p className="eyebrow mb-2">{section.breadcrumb.slice(0, -1).join(' · ')}</p>
                    )}
                    <h2 className="font-display text-[clamp(1.35rem,3vw,2.1rem)] font-medium tracking-[-0.035em] text-white">
                      {section.title}
                    </h2>
                    {section.description && <p className="mt-2 max-w-xl text-[13.5px] text-white/40">{section.description}</p>}
                  </div>
                  <span className="font-display text-[11px] tracking-[0.24em] text-white/25 tabular-nums">
                    {String(section.count).padStart(2, '0')} ITEMS
                  </span>
                </div>
              </Reveal>

              {layout === 'adaptive' ? (
                <JustifiedGallery
                  items={section.items}
                  eagerCount={si === 0 ? 4 : 0}
                  onOpen={(i) => open(section.items, i, `${category.title} · ${section.title}`)}
                />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((item, i) => (
                    <WorkCard
                      key={item.id}
                      item={{ ...item, width: 16, height: 10 }}
                      index={i}
                      eager={si === 0 && i < 3}
                      onOpen={() => open(section.items, i, `${category.title} · ${section.title}`)}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* ── Next collection ───────────────────────────────── */}
        {next && next.slug !== category.slug && (
          <div className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
            <Link to={`/work/${next.slug}`} className="group block">
              <motion.div
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="glass-tile relative overflow-hidden p-8 transition-all duration-700 group-hover:border-white/22 sm:p-12"
              >
                {next.cover && (
                  <img
                    src={next.cover}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover opacity-15 transition-all duration-[1.3s] group-hover:scale-105 group-hover:opacity-30"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-r from-ink-950 via-ink-950/70 to-transparent" />

                <div className="relative flex flex-wrap items-center justify-between gap-6">
                  <div>
                    <p className="eyebrow">Next collection</p>
                    <p className="mt-3 font-display text-[clamp(1.8rem,5vw,3.4rem)] font-medium leading-none tracking-[-0.045em] text-white">
                      {next.title}
                    </p>
                    <p className="mt-3 text-[13px] text-white/40">
                      {next.count} pieces · {next.sections.length} sections
                    </p>
                  </div>
                  <span className="glass grid size-14 place-items-center rounded-full text-white transition-all duration-600 ease-[cubic-bezier(.16,1,.3,1)] group-hover:rotate-45 group-hover:bg-ember-500 group-hover:text-ink-950">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </motion.div>
            </Link>
          </div>
        )}
      </main>

      <Footer />

      <Lightbox
        state={lightbox}
        onClose={() => setLightbox(null)}
        onNavigate={(index) => setLightbox((s) => (s ? { ...s, index } : s))}
      />
    </>
  )
}

/* ────────────────────────────────────────────────────────────── */

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-none tracking-[-0.05em] text-white tabular-nums">
        {String(value).padStart(2, '0')}
      </p>
      <p className="mt-1.5 text-[11px] uppercase tracking-[0.18em] text-white/35">{label}</p>
    </div>
  )
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[12.5px] font-medium tracking-tight transition-colors duration-300',
        active ? 'text-ink-950' : 'text-white/50 hover:text-white',
      )}
    >
      {active && (
        <motion.span
          layoutId="filter-pill"
          className="absolute inset-0 rounded-full bg-linear-to-r from-ember-400 to-ember-500"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
      <span className="relative">
        {label}
        <span className={cn('ml-1.5 tabular-nums', active ? 'text-ink-950/55' : 'text-white/25')}>{count}</span>
      </span>
    </button>
  )
}
