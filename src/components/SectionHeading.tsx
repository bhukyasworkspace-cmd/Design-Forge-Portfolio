import { Reveal, RevealText } from './Reveal'

/** The shared section header: index, eyebrow, big title with an accent word. */
export default function SectionHeading({
  eyebrow,
  index,
  title,
  accent,
  description,
  align = 'left',
  action,
}: {
  eyebrow: string
  index?: string
  title: string
  accent?: string
  description?: string
  align?: 'left' | 'center'
  action?: React.ReactNode
}) {
  const centered = align === 'center'

  return (
    <div className={centered ? 'flex flex-col items-center text-center' : 'flex flex-wrap items-end justify-between gap-6'}>
      <div className={centered ? 'max-w-2xl' : 'max-w-2xl'}>
        <Reveal>
          <div className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
            {index && <span className="font-display text-[11px] tracking-[0.3em] text-ember-500 tabular-nums">{index}</span>}
            <span className="h-px w-7 bg-linear-to-r from-ember-500 to-transparent" />
            <span className="eyebrow">{eyebrow}</span>
          </div>
        </Reveal>

        <h2 className="mt-4 font-display text-[clamp(2.25rem,6.4vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.045em] text-white">
          <RevealText text={title} />
          {accent && (
            <>
              {' '}
              <RevealText text={accent} className="text-ember" delay={0.12} />
            </>
          )}
        </h2>

        {description && (
          <Reveal delay={0.18}>
            <p className="mt-5 text-[15px] leading-relaxed text-white/45">{description}</p>
          </Reveal>
        )}
      </div>

      {action && <Reveal delay={0.24}>{action}</Reveal>}
    </div>
  )
}
