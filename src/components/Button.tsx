import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Magnetic from './Magnetic'
import { cn } from '@/lib/utils'

type Common = {
  children: ReactNode
  icon?: ReactNode
  variant?: 'solid' | 'glass' | 'ghost'
  className?: string
  magnetic?: boolean
}

const styles = {
  solid:
    'text-ink-950 bg-linear-to-r from-ember-400 via-ember-500 to-flare-500 shadow-[0_14px_40px_-12px_rgb(255_92_26/.65)] hover:shadow-[0_18px_54px_-10px_rgb(255_92_26/.8)]',
  glass: 'glass glass-sheen text-white hover:border-white/25',
  ghost: 'text-white/70 hover:text-white border border-white/10 hover:border-white/25',
} as const

function Inner({ children, icon, variant = 'solid', className }: Common) {
  return (
    <span
      className={cn(
        'group/btn relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]',
        styles[variant],
        className,
      )}
    >
      {/* Light sweep on hover */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-out group-hover/btn:translate-x-full" />
      <span className="relative">{children}</span>
      {icon && (
        <span className="relative transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover/btn:translate-x-1">
          {icon}
        </span>
      )}
    </span>
  )
}

export function ButtonLink({ to, href, magnetic = true, ...props }: Common & { to?: string; href?: string }) {
  const content = <Inner {...props} />
  const node = to ? (
    <Link to={to} className="inline-block">
      {content}
    </Link>
  ) : (
    <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="inline-block">
      {content}
    </a>
  )
  return magnetic ? <Magnetic className="inline-block">{node}</Magnetic> : node
}

export function Button({ onClick, magnetic = true, ...props }: Common & { onClick?: () => void }) {
  const node = (
    <button type="button" onClick={onClick} className="inline-block">
      <Inner {...props} />
    </button>
  )
  return magnetic ? <Magnetic className="inline-block">{node}</Magnetic> : node
}
