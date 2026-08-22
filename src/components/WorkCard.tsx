import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import type { WorkItem } from '@/lib/content'
import { usePrefersReducedMotion } from '@/lib/hooks'
import { Play } from './Icons'
import { cn } from '@/lib/utils'

/**
 * One piece of work. The image keeps its intrinsic aspect ratio so a masonry
 * column never reflows, and the title always sits underneath the frame.
 */
export type CardFrame = { width: number; height: number; letterboxed: boolean }

export default function WorkCard({
  item,
  index,
  onOpen,
  eager = false,
  frame,
}: {
  item: WorkItem
  index: number
  onOpen: () => void
  eager?: boolean
  /** Exact box from the justified layout. Without it the card sizes itself by ratio. */
  frame?: CardFrame
}) {
  const [loaded, setLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = usePrefersReducedMotion()

  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'end start'] })
  const parallax = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-4%', '4%'])

  const ratio = item.width && item.height ? item.width / item.height : 4 / 3
  const preview = item.poster || (item.type === 'image' ? item.src : '')

  // In justified mode the frame already matches the image, so the parallax
  // inset is dropped — nothing gets cropped at rest.
  const framed = frame !== undefined
  const frameStyle = framed ? { height: frame.height } : { aspectRatio: ratio }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.75, delay: Math.min(index, 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group/card"
      style={framed ? { width: frame.width } : undefined}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View ${item.title}`}
        onMouseEnter={() => videoRef.current?.play().catch(() => {})}
        onMouseLeave={() => videoRef.current?.pause()}
        className="block w-full text-left"
      >
        <div
          className={cn(
            'glass-tile relative w-full overflow-hidden',
            'group-hover/card:-translate-y-1.5 group-hover/card:border-white/20',
            'group-hover/card:shadow-[0_44px_90px_-40px_rgb(255_92_26/.55)]',
          )}
          style={frameStyle}
        >
          {/* Skeleton */}
          <div
            className={cn(
              'absolute inset-0 bg-linear-to-br from-white/[0.055] to-white/[0.015] transition-opacity duration-700',
              loaded ? 'opacity-0' : 'opacity-100',
            )}
          >
            <div className="shimmer-line absolute inset-x-0 top-1/2 h-px opacity-40" />
          </div>

          <motion.div className={cn('absolute', framed ? 'inset-0' : 'inset-[-4%]')} style={framed ? undefined : { y: parallax }}>
            {preview ? (
              <img
                src={preview}
                alt={item.title}
                width={item.width}
                height={item.height}
                loading={eager ? 'eager' : 'lazy'}
                decoding="async"
                onLoad={() => setLoaded(true)}
                className={cn(
                  'size-full transition-all duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)]',
                  frame?.letterboxed ? 'object-contain' : 'object-cover',
                  'group-hover/card:scale-[1.04]',
                  loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md',
                )}
              />
            ) : (
              <video
                ref={videoRef}
                src={item.src}
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedData={() => setLoaded(true)}
                className="size-full object-cover"
              />
            )}
          </motion.div>

          {/* Hover wash */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-950/85 via-ink-950/10 to-transparent opacity-70 transition-opacity duration-700 group-hover/card:opacity-95" />

          {/* Type badge */}
          {item.type !== 'image' && (
            <span className="glass absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/85">
              <Play className="size-2.5" />
              {item.type === 'embed' ? 'Watch' : 'Video'}
            </span>
          )}

          {/* Index */}
          <span className="absolute right-3 top-3 font-display text-[10px] tracking-[0.22em] text-white/40 tabular-nums transition-colors duration-500 group-hover/card:text-white/80">
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Reveal chip */}
          <span className="absolute bottom-3 left-3 translate-y-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-medium tracking-tight text-ink-950 opacity-0 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover/card:translate-y-0 group-hover/card:opacity-100">
            Open
          </span>
        </div>
      </button>

      {/* Caption — the file name, always visible */}
      <div className="mt-3 flex items-start justify-between gap-3 px-0.5">
        <div className="min-w-0">
          <h3 className="truncate text-[13.5px] font-medium tracking-tight text-white/85 transition-colors duration-400 group-hover/card:text-white">
            {item.title}
          </h3>
          {item.description && <p className="mt-0.5 truncate text-[11.5px] text-white/35">{item.description}</p>}
        </div>
        {item.tags.length > 0 && (
          <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] tracking-wide text-white/40">
            {item.tags[0]}
          </span>
        )}
      </div>
    </motion.div>
  )
}
