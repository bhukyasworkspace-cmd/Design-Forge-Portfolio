import { useActiveSection } from '@/lib/hooks'
import { scrollTo } from './SmoothScroll'
import { cn } from '@/lib/utils'

/**
 * Fixed vertical index on the right edge — shows where you are in the page
 * and jumps between sections. Hidden on anything narrower than a desktop.
 */
export default function SectionRail({ sections }: { sections: { id: string; label: string }[] }) {
  const ids = sections.map((s) => s.id)
  const active = useActiveSection(ids)

  return (
    <nav
      aria-label="Section navigation"
      className="pointer-events-none fixed right-5 top-1/2 z-[65] hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex"
    >
      {sections.map((section, i) => {
        const current = active === section.id
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollTo(`#${section.id}`)}
            className="pointer-events-auto group flex items-center gap-3"
            aria-current={current ? 'true' : undefined}
          >
            <span
              className={cn(
                'whitespace-nowrap rounded-full bg-ink-950/80 px-2.5 py-1 font-body text-[10px] tracking-[0.2em] opacity-0 backdrop-blur-md transition-all duration-400',
                'translate-x-2 group-hover:translate-x-0 group-hover:opacity-100',
                current ? 'text-white' : 'text-white/55',
              )}
            >
              {String(i + 1).padStart(2, '0')} {section.label.toUpperCase()}
            </span>
            <span className="relative flex h-px w-6 items-center justify-end">
              <span
                className={cn(
                  'block h-px transition-all duration-600 ease-[cubic-bezier(.16,1,.3,1)]',
                  current ? 'w-6 bg-ember-500' : 'w-3 bg-white/25 group-hover:w-5 group-hover:bg-white/50',
                )}
              />
            </span>
          </button>
        )
      })}
    </nav>
  )
}
