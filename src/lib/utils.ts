export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}

/** Splits "150+" into { number: 150, suffix: "+" } for the count-up stats. */
export function splitStat(value: string): { number: number; prefix: string; suffix: string } {
  const match = value.match(/^([^\d]*)(\d+)(.*)$/)
  if (!match) return { number: 0, prefix: '', suffix: value }
  return { prefix: match[1], number: Number(match[2]), suffix: match[3] }
}
