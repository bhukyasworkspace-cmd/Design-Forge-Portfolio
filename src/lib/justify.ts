import { useEffect, useRef, useState } from 'react'

/**
 * Justified-rows gallery maths.
 * ------------------------------------------------------------------
 * CSS columns give every image the same WIDTH, which is wrong for mixed
 * aspect ratios — a wide banner gets squeezed into one narrow column while a
 * tall poster towers beside it, and the row never fills out.
 *
 * This packs images into rows that each span the full container width and
 * share a single height, so a 3:1 banner naturally takes the space of two or
 * three thumbnails. Every frame is given the image's real aspect ratio, so
 * nothing is cropped: YouTube thumbs (16:9), Instagram posts (1:1, 4:5),
 * portrait flyers and wide banners all sit on the same grid.
 */

export type Justifiable = { width: number; height: number }
export type JustifiedCell<T> = { item: T; width: number; height: number; letterboxed: boolean }
export type JustifiedRow<T> = { cells: JustifiedCell<T>[]; height: number }

/** Past these, an image is letterboxed rather than allowed to dictate the row. */
const MIN_ASPECT = 0.42 // taller than ~1:2.4
const MAX_ASPECT = 5 // wider than 5:1

const rawAspect = (i: Justifiable) => (i.width > 0 && i.height > 0 ? i.width / i.height : 4 / 3)
const aspectOf = (i: Justifiable) => Math.min(MAX_ASPECT, Math.max(MIN_ASPECT, rawAspect(i)))

export type JustifyOptions = {
  targetHeight: number
  gap: number
  /** How far the final row may stretch past the target before it is left alone. */
  lastRowTolerance?: number
  /** Hard ceiling, so a single tall image can never become a full-screen band. */
  maxHeight?: number
}

export function justifyRows<T extends Justifiable>(
  items: readonly T[],
  containerWidth: number,
  options: JustifyOptions,
): JustifiedRow<T>[] {
  const { targetHeight, gap, lastRowTolerance = 1.4 } = options
  const maxHeight = options.maxHeight ?? targetHeight * 2
  if (containerWidth <= 0 || items.length === 0) return []

  /** Lay a run of items out at `height`; `fill` snaps the row flush to both edges. */
  const build = (members: T[], height: number, fill: boolean): JustifiedRow<T> => {
    const h = Math.round(Math.min(height, maxHeight))
    const gaps = gap * (members.length - 1)
    const cells: JustifiedCell<T>[] = members.map((item) => ({
      item,
      width: Math.max(1, Math.round(aspectOf(item) * h)),
      height: h,
      letterboxed: Math.abs(rawAspect(item) - aspectOf(item)) > 0.001,
    }))

    if (fill && cells.length > 0) {
      // Push any rounding drift into the last cell so the row lands exactly on the edge.
      const used = cells.slice(0, -1).reduce((n, c) => n + c.width, 0)
      cells[cells.length - 1].width = Math.max(1, containerWidth - gaps - used)
    }
    return { cells, height: h }
  }

  const rows: JustifiedRow<T>[] = []
  let run: T[] = []
  let aspectSum = 0

  for (const item of items) {
    const aspect = aspectOf(item)
    const heightWith = (containerWidth - gap * run.length) / (aspectSum + aspect)

    // Still short of the target height — keep filling this row.
    if (heightWith >= targetHeight) {
      run.push(item)
      aspectSum += aspect
      continue
    }

    // A single image wider than the whole row gets a row of its own.
    if (run.length === 0) {
      rows.push(build([item], heightWith, true))
      continue
    }

    // Adding it overshoots. Keep whichever option lands closer to the target,
    // measured on a log scale so over- and under-shoot are weighed evenly.
    const heightWithout = (containerWidth - gap * (run.length - 1)) / aspectSum
    const takeIt = Math.abs(Math.log(heightWith / targetHeight)) <= Math.abs(Math.log(heightWithout / targetHeight))

    if (takeIt) {
      run.push(item)
      rows.push(build(run, heightWith, true))
      run = []
      aspectSum = 0
    } else {
      rows.push(build(run, heightWithout, true))
      run = [item]
      aspectSum = aspect
    }
  }

  if (run.length > 0) {
    const fillHeight = (containerWidth - gap * (run.length - 1)) / aspectSum
    // Measure the last row against the row above it so the rhythm holds: stretch
    // it flush when that only means a modest bump, otherwise leave it at the
    // established height, aligned left, rather than blowing one image up.
    const reference = Math.max(rows[rows.length - 1]?.height ?? targetHeight, targetHeight)
    const stretch = fillHeight <= reference * lastRowTolerance
    rows.push(build(run, stretch ? fillHeight : Math.min(fillHeight, reference), stretch))
  }

  return rows
}

/** Container width, kept live through resizes, zoom and sidebar changes. */
export function useContainerWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const next = entry.contentRect.width
      setWidth((prev) => (Math.abs(prev - next) > 0.5 ? next : prev))
    })
    observer.observe(el)
    setWidth(el.getBoundingClientRect().width)
    return () => observer.disconnect()
  }, [])

  return { ref, width }
}

/** Row height scales with the viewport so phones don't get postage stamps. */
export function targetRowHeight(containerWidth: number): number {
  // Tall relative to the container on phones, which pushes most images onto
  // their own full-width row rather than pairing them into a cramped two-up.
  if (containerWidth < 520) return 240
  if (containerWidth < 900) return 260
  return 270
}
