import { memo } from 'react'

/**
 * The fixed atmosphere behind every page: drifting colour fields, a faint
 * technical grid, vignette and film grain. Purely decorative.
 */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-900">
      {/* Colour fields */}
      <div
        className="absolute -left-[18%] -top-[22%] h-[68vw] w-[68vw] rounded-full opacity-[0.55] blur-[120px] motion-safe:animate-[drift_26s_ease-in-out_infinite]"
        style={{ background: 'radial-gradient(circle, rgb(255 92 26 / .38), transparent 66%)' }}
      />
      <div
        className="absolute -right-[16%] top-[18%] h-[54vw] w-[54vw] rounded-full opacity-45 blur-[130px] motion-safe:animate-[drift_34s_ease-in-out_infinite_reverse]"
        style={{ background: 'radial-gradient(circle, rgb(139 92 246 / .34), transparent 66%)' }}
      />
      <div
        className="absolute bottom-[-24%] left-[24%] h-[58vw] w-[58vw] rounded-full opacity-35 blur-[140px] motion-safe:animate-[drift_30s_ease-in-out_infinite]"
        style={{ background: 'radial-gradient(circle, rgb(255 45 111 / .3), transparent 68%)' }}
      />

      {/* Technical grid */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(rgb(255 255 255 / .5) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .5) 1px, transparent 1px)',
          backgroundSize: '84px 84px',
          maskImage: 'radial-gradient(ellipse 90% 65% at 50% 0%, #000 15%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 65% at 50% 0%, #000 15%, transparent 80%)',
        }}
      />

      {/* Vignette keeps the centre readable */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 120% 90% at 50% 40%, transparent 20%, rgb(5 5 6 / .72) 72%, #050506 100%)' }}
      />

      {/* Grain */}
      <div
        className="absolute inset-[-50%] opacity-[0.13] mix-blend-overlay"
        style={{ backgroundImage: 'var(--grain-url)', backgroundSize: '180px 180px' }}
      />
    </div>
  )
}

export default memo(Backdrop)
