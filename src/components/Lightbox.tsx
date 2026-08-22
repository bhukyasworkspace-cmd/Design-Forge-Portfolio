import { useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { WorkItem } from '@/lib/content'
import { useScrollLock } from '@/lib/hooks'
import { ArrowLeft, ArrowRight, Close } from './Icons'

export type LightboxState = { items: readonly WorkItem[]; index: number; context?: string } | null

/** Full-screen viewer with keyboard + swipe navigation. */
export default function Lightbox({
  state,
  onClose,
  onNavigate,
}: {
  state: LightboxState
  onClose: () => void
  onNavigate: (index: number) => void
}) {
  const open = state !== null
  useScrollLock(open)

  const step = useCallback(
    (delta: number) => {
      if (!state) return
      const next = (state.index + delta + state.items.length) % state.items.length
      onNavigate(next)
    },
    [state, onNavigate],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, step])

  const item = state?.items[state.index]

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="fixed inset-0 z-[95] flex flex-col bg-ink-950/94 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
        >
          {/* Chrome */}
          <div className="flex shrink-0 items-start justify-between gap-4 px-4 pt-4 sm:px-8 sm:pt-6">
            <div className="min-w-0">
              {state.context && <p className="eyebrow truncate">{state.context}</p>}
              <h2 className="mt-1.5 truncate font-display text-lg font-medium tracking-tight text-white sm:text-2xl">
                {item.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="glass grid size-11 shrink-0 place-items-center rounded-full text-white transition-colors hover:border-white/30"
            >
              <Close className="size-4" />
            </button>
          </div>

          {/* Stage */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 py-4 sm:px-16 sm:py-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={item.id}
                className="flex h-full w-full items-center justify-center"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                drag={state.items.length > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -70) step(1)
                  if (info.offset.x > 70) step(-1)
                }}
              >
                {item.type === 'image' && (
                  <img
                    src={item.src}
                    alt={item.title}
                    width={item.width}
                    height={item.height}
                    className="max-h-full max-w-full rounded-2xl object-contain shadow-[0_40px_120px_-30px_rgb(0_0_0/.9)]"
                    draggable={false}
                  />
                )}
                {item.type === 'video' && (
                  <video
                    key={item.src}
                    src={item.src}
                    poster={item.poster || undefined}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="max-h-full max-w-full rounded-2xl shadow-[0_40px_120px_-30px_rgb(0_0_0/.9)]"
                  />
                )}
                {item.type === 'embed' && (
                  <div className="aspect-video w-full max-w-5xl overflow-hidden rounded-2xl shadow-[0_40px_120px_-30px_rgb(0_0_0/.9)]">
                    <iframe
                      src={item.embed}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="size-full border-0"
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {state.items.length > 1 && (
              <>
                <NavButton side="left" onClick={() => step(-1)} />
                <NavButton side="right" onClick={() => step(1)} />
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 pb-5 sm:px-8 sm:pb-7">
            <p className="max-w-xl text-sm leading-relaxed text-white/45">
              {item.description || 'Click, drag or use the arrow keys to move through the set.'}
            </p>
            <span className="font-display text-xs tracking-[0.24em] text-white/40 tabular-nums">
              {String(state.index + 1).padStart(2, '0')} / {String(state.items.length).padStart(2, '0')}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function NavButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ArrowLeft : ArrowRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous' : 'Next'}
      className={`glass absolute top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full text-white transition-all duration-400 hover:border-white/30 hover:bg-white/10 sm:grid ${
        side === 'left' ? 'left-3' : 'right-3'
      }`}
    >
      <Icon className="size-4" />
    </button>
  )
}
