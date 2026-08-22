import type { SVGProps } from 'react'
import type { IconKey } from '@/data/site'

type P = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.35,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/* ── Skill icons ──────────────────────────────────────────────── */
const Layers = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
    <path d="m3 12 9 4.5L21 12" opacity=".65" />
    <path d="m3 16.5 9 4.5 9-4.5" opacity=".35" />
  </svg>
)

const Poster = (p: P) => (
  <svg {...base} {...p}>
    <rect x="4" y="2.75" width="16" height="18.5" rx="2" />
    <path d="M7.5 7.5h6M7.5 11h9M7.5 14.5h9M7.5 18h4.5" opacity=".7" />
    <circle cx="16.75" cy="7.5" r="1.6" />
  </svg>
)

const Motion = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2.5 15.5c3-9 6.5-9 9.5 0s6.5 9 9.5 0" />
    <circle cx="12" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
    <path d="M2.5 20.5h19" opacity=".35" />
  </svg>
)

const Thumbnail = (p: P) => (
  <svg {...base} {...p}>
    <rect x="2.25" y="4.75" width="19.5" height="14.5" rx="2.5" />
    <path d="m10.25 9.75 4.75 2.6-4.75 2.65V9.75Z" fill="currentColor" stroke="none" />
    <path d="M2.25 16.25h19.5" opacity=".3" />
  </svg>
)

const Grade = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.75" />
    <path d="M12 3.25v17.5" opacity=".5" />
    <path d="M12 3.25A8.75 8.75 0 0 1 12 20.75Z" fill="currentColor" stroke="none" opacity=".85" />
    <circle cx="12" cy="12" r="2.6" />
  </svg>
)

const Camera = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.7l1.1-1.9a1.4 1.4 0 0 1 1.2-.7h5a1.4 1.4 0 0 1 1.2.7L16.8 6h1.7A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-8Z" />
    <circle cx="12" cy="12.25" r="3.5" />
  </svg>
)

const Handshake = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="8.5" cy="7" r="2.9" />
    <path d="M2.75 20.25a5.75 5.75 0 0 1 11.5 0" />
    <circle cx="17" cy="9.25" r="2.35" opacity=".6" />
    <path d="M16.4 15.1a4.6 4.6 0 0 1 4.85 4.4" opacity=".6" />
  </svg>
)

const Megaphone = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 9.25h3.25L16 4.75v14.5L7.25 14.75H4a1.25 1.25 0 0 1-1.25-1.25v-3a1.25 1.25 0 0 1 1.25-1.25Z" />
    <path d="M7.25 14.75v3.5a1.75 1.75 0 0 0 3.5 0v-1.7" opacity=".65" />
    <path d="M19.25 9.5a3.75 3.75 0 0 1 0 5" opacity=".8" />
    <path d="M21.25 7a7 7 0 0 1 0 10" opacity=".45" />
  </svg>
)

const skillIcons: Record<IconKey, (p: P) => React.ReactElement> = {
  layers: Layers,
  poster: Poster,
  motion: Motion,
  thumbnail: Thumbnail,
  grade: Grade,
  camera: Camera,
  handshake: Handshake,
  megaphone: Megaphone,
}

export function SkillIcon({ name, ...props }: { name: IconKey } & P) {
  const Component = skillIcons[name] ?? Layers
  return <Component {...props} />
}

/* ── Brand marks ──────────────────────────────────────────────── */

/**
 * DaVinci Resolve — the three-petal colour wheel. Each petal is the same
 * teardrop rotated 120° around the centre with its tip pointing inward:
 * blue at the top, yellow lower-left, red lower-right.
 */
export const DaVinciMark = (p: P) => {
  // Tip at the origin, circular body hanging straight down.
  const petal = 'M0 5C4 11 12 17 12 25a12 12 0 1 1-24 0c0-8 8-14 12-20Z'
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <defs>
        <linearGradient id="dv-blue" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#7FD9F7" />
          <stop offset="0.45" stopColor="#22A7E8" />
          <stop offset="1" stopColor="#CFEAF2" />
        </linearGradient>
        <linearGradient id="dv-yellow" x1="0.15" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#F2F3B8" />
          <stop offset="0.4" stopColor="#D9E021" />
          <stop offset="1" stopColor="#E9D617" />
        </linearGradient>
        <linearGradient id="dv-red" x1="0.2" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#F7B7A8" />
          <stop offset="0.45" stopColor="#EF3B5B" />
          <stop offset="1" stopColor="#F2682F" />
        </linearGradient>
      </defs>
      <g transform="translate(12 12) scale(0.315)">
        <path d={petal} fill="url(#dv-blue)" transform="rotate(180)" />
        <path d={petal} fill="url(#dv-yellow)" transform="rotate(60)" />
        <path d={petal} fill="url(#dv-red)" transform="rotate(-60)" />
      </g>
    </svg>
  )
}

/** Full app-icon treatment: dark tile with the spectrum edge, for the tools grid. */
export const DaVinciTile = (p: P) => (
  <svg viewBox="0 0 64 64" fill="none" {...p}>
    <defs>
      <linearGradient id="dv-edge" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#5FD6C2" />
        <stop offset="0.28" stopColor="#3FA9F5" />
        <stop offset="0.55" stopColor="#EF3B5B" />
        <stop offset="0.8" stopColor="#F2A03D" />
        <stop offset="1" stopColor="#D9E021" />
      </linearGradient>
    </defs>
    <rect x="1.5" y="1.5" width="61" height="61" rx="18" stroke="url(#dv-edge)" strokeWidth="3" />
    <rect x="6" y="6" width="52" height="52" rx="14.5" fill="#28343F" />
    <DaVinciMark x="12" y="12" width="40" height="40" />
  </svg>
)

/* ── UI icons ─────────────────────────────────────────────────── */
export const ArrowUpRight = (p: P) => (
  <svg {...base} strokeWidth={1.6} {...p}>
    <path d="M7 17 17 7M8.5 7H17v8.5" />
  </svg>
)

export const ArrowRight = (p: P) => (
  <svg {...base} strokeWidth={1.6} {...p}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
)

export const ArrowLeft = (p: P) => (
  <svg {...base} strokeWidth={1.6} {...p}>
    <path d="M20 12H4M10 6l-6 6 6 6" />
  </svg>
)

export const Close = (p: P) => (
  <svg {...base} strokeWidth={1.6} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const Play = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
  </svg>
)

export const Download = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5" />
    <path d="M4.5 17.5v1.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-1.5" opacity=".7" />
  </svg>
)

export const Mail = (p: P) => (
  <svg {...base} {...p}>
    <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="2.5" />
    <path d="m3.5 7.5 7.4 5.2a2 2 0 0 0 2.2 0l7.4-5.2" />
  </svg>
)

export const Instagram = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
  </svg>
)

export const LinkedIn = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9.75h4v11.25H3V9.75Zm6.5 0h3.83v1.54h.05c.53-.95 1.84-1.96 3.79-1.96 4.05 0 4.8 2.5 4.8 5.76v5.91h-4v-5.24c0-1.25-.02-2.86-1.83-2.86-1.84 0-2.12 1.36-2.12 2.77v5.33h-4V9.75Z" />
  </svg>
)

export const Sparkle = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2.5c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z" />
  </svg>
)

export const Grid = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3.25" y="3.25" width="7" height="7" rx="1.6" />
    <rect x="13.75" y="3.25" width="7" height="7" rx="1.6" />
    <rect x="3.25" y="13.75" width="7" height="7" rx="1.6" />
    <rect x="13.75" y="13.75" width="7" height="7" rx="1.6" />
  </svg>
)

export const socialIcons: Record<string, (p: P) => React.ReactElement> = {
  Instagram,
  LinkedIn,
  Email: Mail,
}
