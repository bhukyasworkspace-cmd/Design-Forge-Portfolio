import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { categories, totals, type WorkCategory } from '@/lib/content'
import { useSpotlight } from '@/lib/hooks'
import { Reveal } from '@/components/Reveal'
import SectionHeading from '@/components/SectionHeading'
import { ArrowUpRight, Grid } from '@/components/Icons'

export default function Work() {
  return (
    <section id="work" className="relative scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Browse my recent"
          index="03"
          title="Selected"
          accent="work"
          description="Every collection below is a folder on disk. Add a file, and it appears here — no code, no rebuilding the page by hand."
          action={
            totals.items > 0 ? (
              <div className="glass flex items-center gap-4 rounded-full px-5 py-3">
                <Grid className="size-4 text-ember-400" />
                <span className="text-[12.5px] tracking-tight text-white/60">
                  <span className="font-medium text-white tabular-nums">{totals.items}</span> pieces ·{' '}
                  <span className="font-medium text-white tabular-nums">{totals.sections}</span> sections
                </span>
              </div>
            ) : undefined
          }
        />

        {categories.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {categories.map((category, i) => (
              <CategoryCard
                key={category.slug}
                category={category}
                index={i}
                // Give the grid rhythm: every third card runs full width.
                wide={categories.length > 2 && i % 3 === 0}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────── */

function CategoryCard({ category, index, wide }: { category: WorkCategory; index: number; wide: boolean }) {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>()
  // A few frames from inside the collection, shown as a stack on hover.
  const peek = category.sections.flatMap((s) => s.items).filter((i) => i.poster || i.type === 'image').slice(1, 4)

  return (
    <motion.div
      initial={{ opacity: 0, y: 46 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.85, delay: (index % 3) * 0.09, ease: [0.16, 1, 0.3, 1] }}
      className={wide ? 'md:col-span-2' : ''}
    >
      <Link to={`/work/${category.slug}`} className="group block h-full">
        <div
          ref={ref}
          onPointerMove={onPointerMove}
          className={`spotlight glass-tile relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-2 group-hover:border-white/22 group-hover:shadow-[0_60px_120px_-50px_rgb(255_92_26/.6)] ${
            wide ? 'aspect-16/10 sm:aspect-21/9' : 'aspect-4/3 sm:aspect-16/11'
          }`}
        >
          {/* Cover */}
          {category.cover ? (
            <img
              src={category.cover}
              alt=""
              loading={index < 2 ? 'eager' : 'lazy'}
              decoding="async"
              className="absolute inset-0 size-full object-cover opacity-55 transition-all duration-[1.3s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.07] group-hover:opacity-80"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-white/[0.06] to-transparent" />
          )}

          <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/55 to-ink-950/15 transition-opacity duration-700 group-hover:from-ink-950/95" />

          {/* Header row */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5 sm:p-6">
            <span className="glass rounded-full px-3 py-1.5 text-[10.5px] font-medium uppercase tracking-[0.16em] text-white/70">
              {category.tagline}
            </span>
            <span className="glass grid size-10 place-items-center rounded-full text-white transition-all duration-600 ease-[cubic-bezier(.16,1,.3,1)] group-hover:rotate-45 group-hover:border-white/35 group-hover:bg-ember-500 group-hover:text-ink-950">
              <ArrowUpRight className="size-4" />
            </span>
          </div>

          {/* Body */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-display text-[clamp(1.5rem,3.6vw,2.6rem)] font-medium leading-none tracking-[-0.04em] text-white">
                  {category.title}
                </h3>
                <p className="mt-2.5 max-w-md text-[13px] leading-relaxed text-white/45 transition-colors duration-500 group-hover:text-white/65">
                  {category.description}
                </p>
              </div>
              <span className="hidden shrink-0 text-right font-display text-[clamp(2rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.05em] text-white/12 tabular-nums transition-colors duration-500 group-hover:text-white/25 sm:block">
                {String(category.count).padStart(2, '0')}
              </span>
            </div>

            {/* Section chips + a peek at what is inside */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {category.sections.slice(0, 3).map((section) => (
                <span
                  key={section.slug}
                  className="rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1 text-[10.5px] font-light tracking-tight text-white/55 backdrop-blur-md transition-colors duration-500 group-hover:border-white/20"
                >
                  {section.title}
                  <span className="ml-1.5 text-white/30 tabular-nums">{section.count}</span>
                </span>
              ))}
              {category.sections.length > 3 && (
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10.5px] font-light text-white/35">
                  +{category.sections.length - 3}
                </span>
              )}

              <span className="ml-auto flex -space-x-2.5 opacity-0 transition-all duration-600 ease-[cubic-bezier(.16,1,.3,1)] group-hover:opacity-100">
                {peek.map((item, n) => (
                  <span
                    key={item.id}
                    className="size-9 overflow-hidden rounded-lg border border-white/15 bg-ink-900 shadow-[0_8px_20px_-8px_rgb(0_0_0/.9)] transition-transform duration-600 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0"
                    style={{ transform: `translateX(${(peek.length - n) * 8}px)` }}
                  >
                    <img src={item.poster || item.src} alt="" loading="lazy" className="size-full object-cover" />
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function EmptyState() {
  return (
    <Reveal>
      <div className="glass-tile mt-14 p-8 sm:p-12">
        <h3 className="font-display text-xl font-medium tracking-tight text-white">No work loaded yet</h3>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/45">
          Drop your files into the folders below and they will appear here automatically — the folder name becomes the
          collection title, the sub-folder becomes the section, and the file name becomes the caption.
        </p>
        <pre className="mt-6 overflow-x-auto rounded-2xl border border-white/8 bg-ink-950/70 p-5 text-[12px] leading-relaxed text-white/55">
{`public/portfolio/
  01 Posters/
    Original Creations/
      Neon Fest.jpg
  02 Thumbnails/
    Original Creations/
    Recreated Work/`}
        </pre>
      </div>
    </Reveal>
  )
}
