import { motion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/lib/hooks'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 34 },
  down: { x: 0, y: -34 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
}

/** Fade + slide into view once, with an optional stagger delay. */
export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  blur = true,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  direction?: Direction
  blur?: boolean
  className?: string
  as?: 'div' | 'section' | 'li' | 'span' | 'p' | 'header'
}) {
  const reduced = usePrefersReducedMotion()
  const Tag = motion[as] as typeof motion.div
  const { x, y } = OFFSET[direction]

  if (reduced) return <Tag className={className}>{children}</Tag>

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, x, y, filter: blur ? 'blur(10px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-12% 0px -8% 0px' }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  )
}

/** Word-by-word headline reveal — the signature type animation. */
export function RevealText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.055,
}: {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  stagger?: number
}) {
  const reduced = usePrefersReducedMotion()
  const words = text.split(' ')

  if (reduced) return <span className={className}>{text}</span>

  const container: Variants = {
    hidden: {},
    show: { transition: { delayChildren: delay, staggerChildren: stagger } },
  }
  const word: Variants = {
    hidden: { y: '110%', opacity: 0, rotate: 3 },
    show: { y: '0%', opacity: 1, rotate: 0, transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <motion.span variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-10% 0px' }} className={className}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className={`inline-flex overflow-hidden pb-[0.14em] align-bottom${i < words.length - 1 ? ' mr-[0.26em]' : ''}`}
        >
          <motion.span variants={word} className={wordClassName}>
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
