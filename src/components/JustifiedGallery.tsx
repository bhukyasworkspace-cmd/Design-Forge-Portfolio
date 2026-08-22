import { useMemo } from 'react'
import type { WorkItem } from '@/lib/content'
import { justifyRows, targetRowHeight, useContainerWidth } from '@/lib/justify'
import WorkCard from './WorkCard'

const GAP = 16

/**
 * Renders a set of pieces as justified rows — each row spans the full width at
 * a shared height, and every image keeps its true aspect ratio. A wide banner
 * takes the space of two or three thumbnails; a portrait flyer takes less.
 */
export default function JustifiedGallery({
  items,
  onOpen,
  eagerCount = 0,
}: {
  items: WorkItem[]
  onOpen: (index: number) => void
  eagerCount?: number
}) {
  const { ref, width } = useContainerWidth<HTMLDivElement>()

  // Index the items so a cell can still map back to its position for the lightbox.
  const indexed = useMemo(() => items.map((item, index) => ({ ...item, index })), [items])
  const target = targetRowHeight(width)
  const rows = useMemo(
    () => justifyRows(indexed, width, { targetHeight: target, gap: GAP }),
    [indexed, width, target],
  )

  return (
    <div ref={ref} className="w-full">
      {/* First paint has no measurement yet — reserve the space to avoid a jump. */}
      {width === 0 ? (
        <div style={{ height: target }} />
      ) : (
        <div className="flex flex-col" style={{ gap: GAP + 18 }}>
          {rows.map((row, r) => (
            <div key={r} className="flex" style={{ gap: GAP }}>
              {row.cells.map((cell) => (
                <WorkCard
                  key={cell.item.id}
                  item={cell.item}
                  index={cell.item.index}
                  eager={cell.item.index < eagerCount}
                  frame={{ width: cell.width, height: cell.height, letterboxed: cell.letterboxed }}
                  onOpen={() => onOpen(cell.item.index)}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
