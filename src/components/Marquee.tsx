import { Sparkle } from './Icons'

/**
 * Infinite scrolling word strip. The track is duplicated so the -50%
 * keyframe loops seamlessly; `aria-hidden` on the clone keeps it out of
 * the accessibility tree.
 */
export default function Marquee({
  words,
  reverse = false,
  speed = 42,
  className = '',
  tone = 'outline',
}: {
  words: readonly string[]
  reverse?: boolean
  speed?: number
  className?: string
  tone?: 'outline' | 'solid'
}) {
  const Track = ({ clone }: { clone?: boolean }) => (
    <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={clone}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="flex items-center gap-8">
          <span
            className={
              tone === 'solid'
                ? 'font-display text-[clamp(1.75rem,5vw,3.75rem)] font-medium tracking-tight text-white/90'
                : 'font-display text-[clamp(1.75rem,5vw,3.75rem)] font-medium tracking-tight text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/.32)]'
            }
          >
            {word}
          </span>
          <Sparkle className="size-3 shrink-0 text-ember-500" />
        </span>
      ))}
    </div>
  )

  return (
    <div className={`mask-fade-x relative flex overflow-hidden ${className}`}>
      <div
        className="flex min-w-max motion-safe:animate-[marquee_var(--speed)_linear_infinite]"
        style={{
          ['--speed' as string]: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        <Track />
        <Track clone />
      </div>
    </div>
  )
}
