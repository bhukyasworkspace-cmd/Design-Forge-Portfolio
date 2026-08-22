import { useMemo, useState } from 'react'
import { allItems } from '@/lib/content'
import { usePrefersReducedMotion } from '@/lib/hooks'
import Lightbox, { type LightboxState } from '@/components/Lightbox'
import { Play } from '@/components/Icons'

/**
 * Two counter-scrolling rows of real work, straight from the folders.
 * Pauses on hover, opens the lightbox on click, and skips itself entirely
 * when there is nothing to show yet.
 */
export default function FeaturedStrip() {
  const [lightbox, setLightbox] = useState<LightboxState>(null)

  const rows = useMemo(() => {
    const pool = allItems.filter((i) => i.poster || i.type === 'image')
    if (pool.length === 0) return null
    // Round-robin across collections so one folder can't fill both rows.
    const bySlug = new Map<string, typeof pool>()
    for (const item of pool) {
      const list = bySlug.get(item.categorySlug) ?? []
      list.push(item)
      bySlug.set(item.categorySlug, list)
    }
    const mixed: typeof pool = []
    let depth = 0
    while (mixed.length < pool.length && depth < 60) {
      for (const list of bySlug.values()) if (list[depth]) mixed.push(list[depth])
      depth += 1
    }
    // Cap it: a marquee only needs enough tiles to fill two loops, and every
    // tile here is eager-loaded so none of them show up blank mid-scroll.
    const capped = mixed.slice(0, 16)
    const half = Math.ceil(capped.length / 2)
    const top = capped.slice(0, half)
    const bottom = capped.slice(half)
    return [top, bottom.length >= 2 ? bottom : top]
  }, [])

  if (!rows) return null

  return (
    <>
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="mx-auto mb-8 flex w-full max-w-7xl items-center gap-4 px-5 sm:px-8">
          <span className="eyebrow whitespace-nowrap">Recent frames</span>
          <span className="h-px flex-1 bg-linear-to-r from-white/12 to-transparent" />
          <span className="font-body text-[10.5px] tracking-[0.2em] text-white/25">LIVE FROM THE FOLDERS</span>
        </div>

        <div className="space-y-3">
          <StripRow items={rows[0]} speed={58} onOpen={(items, index) => setLightbox({ items, index, context: 'Recent work' })} />
          <StripRow items={rows[1]} speed={72} reverse onOpen={(items, index) => setLightbox({ items, index, context: 'Recent work' })} />
        </div>

        {/* Edge fades so the rows dissolve instead of stopping */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-ink-900 to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-ink-900 to-transparent sm:w-32" />
      </section>

      <Lightbox
        state={lightbox}
        onClose={() => setLightbox(null)}
        onNavigate={(index) => setLightbox((s) => (s ? { ...s, index } : s))}
      />
    </>
  )
}

/* ────────────────────────────────────────────────────────────── */

/** Tiles keep their true shape, so a banner reads wide and a story reads tall. */
function stripAspect(item: { width: number; height: number }) {
  const raw = item.width > 0 && item.height > 0 ? item.width / item.height : 16 / 10
  return Math.min(3.4, Math.max(0.56, raw)).toFixed(3)
}

function StripRow({
  items,
  speed,
  reverse = false,
  onOpen,
}: {
  items: typeof allItems
  speed: number
  reverse?: boolean
  onOpen: (items: typeof allItems, index: number) => void
}) {
  const reduced = usePrefersReducedMotion()

  const Track = ({ clone }: { clone?: boolean }) => (
    <div className="flex shrink-0 gap-3 pr-3" aria-hidden={clone}>
      {items.map((item, i) => (
        <button
          key={`${item.id}-${clone ? 'c' : 'o'}`}
          type="button"
          onClick={() => onOpen(items, i)}
          tabIndex={clone ? -1 : 0}
          aria-label={`View ${item.title}`}
          style={{ width: `calc(var(--strip-h) * ${stripAspect(item)})` }}
          className="group relative h-[var(--strip-h)] shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]"
        >
          <img
            src={item.poster || item.src}
            alt={item.title}
            loading={clone ? 'lazy' : 'eager'}
            decoding="async"
            className="size-full object-cover opacity-70 transition-all duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105 group-hover:opacity-100"
          />
          <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-950/90 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

          {item.type !== 'image' && (
            <span className="absolute left-2.5 top-2.5 grid size-6 place-items-center rounded-full bg-ink-950/70 text-white/90 backdrop-blur-md">
              <Play className="size-2.5" />
            </span>
          )}

          <span className="absolute inset-x-3 bottom-2.5 translate-y-1 text-left opacity-0 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
            <span className="block truncate text-[11.5px] font-medium tracking-tight text-white">{item.title}</span>
            <span className="block truncate text-[10px] font-light text-white/45">{item.category}</span>
          </span>
        </button>
      ))}
    </div>
  )

  return (
    <div className="group/row flex overflow-hidden [--strip-h:9.5rem] sm:[--strip-h:11rem] lg:[--strip-h:12.5rem]">
      <div
        className="flex min-w-max motion-safe:animate-[marquee_var(--speed)_linear_infinite] motion-safe:group-hover/row:[animation-play-state:paused]"
        style={{
          ['--speed' as string]: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
          animationPlayState: reduced ? 'paused' : undefined,
        }}
      >
        <Track />
        <Track clone />
      </div>
    </div>
  )
}
