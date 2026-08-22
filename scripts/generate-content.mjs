/**
 * Portfolio content scanner
 * ------------------------------------------------------------------
 * Walks `public/portfolio` and turns the folder tree into structured JSON
 * that the React app renders. Nothing in the UI is hard-coded — drop a new
 * image into a folder, or create a brand new folder, and it shows up.
 *
 *   public/portfolio/
 *     01 Posters/                 <- CATEGORY  (top level folder)
 *       Original Creations/       <- SECTION   (sub folder)
 *         Neon Fest.jpg           <- ITEM      (title shown under the image)
 *
 * Optional, never required:
 *   _meta.json   -> custom title / description / order / per-file titles
 *   _links.json  -> embed externally hosted videos (YouTube, Vimeo, Drive)
 *
 * Run with `npm run content` (also runs automatically on dev + build).
 */
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, extname, basename, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const CONTENT_DIR = join(ROOT, 'public', 'portfolio')
const OUT_FILE = join(ROOT, 'src', 'generated', 'content.json')

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg'])
const VIDEO_EXT = new Set(['.mp4', '.webm', '.mov', '.m4v', '.ogv'])
const IGNORED = new Set(['.DS_Store', 'Thumbs.db', 'desktop.ini'])

/* ------------------------------------------------------------------ *
 * Naming helpers
 * ------------------------------------------------------------------ */

/** "01 Motion-Graphics" -> "Motion Graphics" (order prefixes are stripped). */
function prettify(raw) {
  const withoutOrder = raw.replace(/^\d+\s*[-._)]?\s+/, '').replace(/^\d+[-_.]/, '')
  const spaced = withoutOrder.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
  if (!spaced) return raw
  // Respect capitalisation the designer already typed; only fix all-lowercase.
  if (/[A-Z]/.test(spaced.slice(1))) return spaced
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Leading number in a folder/file name controls sort order: "02 Thumbnails" -> 2 */
function orderOf(raw) {
  const match = raw.match(/^(\d+)/)
  return match ? Number.parseInt(match[1], 10) : Number.POSITIVE_INFINITY
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section'
}

/** public/portfolio/a b/c.jpg -> "portfolio/a%20b/c.jpg" (BASE_URL is added in the app). */
function toUrl(absPath) {
  return relative(join(ROOT, 'public'), absPath).split(sep).map(encodeURIComponent).join('/')
}

function readJson(dir, name) {
  const file = join(dir, name)
  if (!existsSync(file)) return null
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch (error) {
    console.warn(`  ! Skipping malformed ${name} in ${relative(ROOT, dir)}: ${error.message}`)
    return null
  }
}

/* ------------------------------------------------------------------ *
 * Intrinsic image size — read from the file header so the masonry grid
 * can reserve exact space and never shift while loading.
 * ------------------------------------------------------------------ */
function imageSize(file) {
  let buf
  try {
    buf = readFileSync(file)
  } catch {
    return null
  }
  const ext = extname(file).toLowerCase()
  try {
    if (ext === '.png' && buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
    }
    if (ext === '.gif' && buf.length > 10) {
      return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) }
    }
    if ((ext === '.jpg' || ext === '.jpeg') && buf.readUInt16BE(0) === 0xffd8) {
      let offset = 2
      while (offset < buf.length - 9) {
        if (buf[offset] !== 0xff) { offset += 1; continue }
        const marker = buf[offset + 1]
        // SOF0..SOF15, skipping the non-dimension DHT/JPG/DAC markers.
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) }
        }
        offset += 2 + buf.readUInt16BE(offset + 2)
      }
    }
    if (ext === '.webp' && buf.length > 30 && buf.toString('ascii', 8, 12) === 'WEBP') {
      const format = buf.toString('ascii', 12, 16)
      if (format === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff }
      if (format === 'VP8L') {
        const bits = buf.readUInt32LE(21)
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
      }
      if (format === 'VP8X') {
        return {
          width: 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16)),
          height: 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16)),
        }
      }
    }
    if (ext === '.svg') {
      const head = buf.toString('utf8', 0, 2048)
      const vb = head.match(/viewBox\s*=\s*["']\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/i)
      if (vb) return { width: Math.round(+vb[1]), height: Math.round(+vb[2]) }
    }
  } catch {
    /* Unreadable header — fall through to the 4:3 default. */
  }
  return null
}

/* ------------------------------------------------------------------ *
 * External embeds (_links.json)
 * ------------------------------------------------------------------ */
function youtubeId(url) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/)
  return m ? m[1] : null
}
function vimeoId(url) {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return m ? m[1] : null
}

function buildEmbed(link, index, sectionId) {
  if (!link || typeof link.url !== 'string') return null
  const yt = youtubeId(link.url)
  const vm = vimeoId(link.url)
  return {
    id: `${sectionId}/embed-${index}`,
    title: link.title || (yt ? 'Video' : 'External Piece'),
    description: link.description || '',
    tags: Array.isArray(link.tags) ? link.tags : [],
    type: 'embed',
    src: link.url,
    embed: yt
      ? `https://www.youtube-nocookie.com/embed/${yt}`
      : vm
        ? `https://player.vimeo.com/video/${vm}`
        : link.url,
    poster: link.thumbnail || (yt ? `https://i.ytimg.com/vi/${yt}/maxresdefault.jpg` : ''),
    width: 1920,
    height: 1080,
  }
}

/* ------------------------------------------------------------------ *
 * Walkers
 * ------------------------------------------------------------------ */
function listDir(dir) {
  const entries = readdirSync(dir, { withFileTypes: true }).filter((e) => !IGNORED.has(e.name) && !e.name.startsWith('.'))
  return {
    dirs: entries.filter((e) => e.isDirectory()).sort((a, b) => orderOf(a.name) - orderOf(b.name) || a.name.localeCompare(b.name, undefined, { numeric: true })),
    files: entries.filter((e) => e.isFile()).sort((a, b) => orderOf(a.name) - orderOf(b.name) || a.name.localeCompare(b.name, undefined, { numeric: true })),
  }
}

/** Collect the media items that live directly inside `dir`. */
function collectItems(dir, sectionId, meta) {
  const { files } = listDir(dir)
  const itemMeta = (meta && meta.items) || {}

  const videos = files.filter((f) => VIDEO_EXT.has(extname(f.name).toLowerCase()))
  const images = files.filter((f) => IMAGE_EXT.has(extname(f.name).toLowerCase()))

  // An image sharing a video's basename is treated as that video's poster frame.
  const posterFor = new Map()
  const usedAsPoster = new Set()
  for (const video of videos) {
    const stem = basename(video.name, extname(video.name)).toLowerCase()
    const poster = images.find((img) => {
      const imgStem = basename(img.name, extname(img.name)).toLowerCase()
      return imgStem === stem || imgStem === `${stem}-poster` || imgStem === `${stem}.poster`
    })
    if (poster) {
      posterFor.set(video.name, poster.name)
      usedAsPoster.add(poster.name)
    }
  }

  const media = files.filter(
    (f) => (VIDEO_EXT.has(extname(f.name).toLowerCase()) || IMAGE_EXT.has(extname(f.name).toLowerCase())) && !usedAsPoster.has(f.name),
  )

  return media.map((file) => {
    const abs = join(dir, file.name)
    const ext = extname(file.name).toLowerCase()
    const isVideo = VIDEO_EXT.has(ext)
    const stem = basename(file.name, extname(file.name))
    const custom = itemMeta[file.name] || itemMeta[stem] || {}
    const posterName = posterFor.get(file.name)
    const dims = (isVideo ? (posterName ? imageSize(join(dir, posterName)) : null) : imageSize(abs)) || { width: 1600, height: 1200 }

    return {
      id: `${sectionId}/${slugify(stem)}`,
      title: typeof custom === 'string' ? custom : custom.title || prettify(stem),
      description: custom.description || '',
      tags: Array.isArray(custom.tags) ? custom.tags : [],
      type: isVideo ? 'video' : 'image',
      src: toUrl(abs),
      poster: posterName ? toUrl(join(dir, posterName)) : '',
      width: dims.width,
      height: dims.height,
      bytes: statSync(abs).size,
    }
  })
}

/** Recursively turn folders into sections. A folder with media becomes a section. */
function collectSections(dir, categorySlug, trail = []) {
  const sections = []
  const { dirs } = listDir(dir)

  for (const child of dirs) {
    const childPath = join(dir, child.name)
    const meta = readJson(childPath, '_meta.json') || {}
    const links = readJson(childPath, '_links.json')
    const title = meta.title || prettify(child.name)
    const slug = slugify(meta.slug || title)
    const sectionId = `${categorySlug}/${slug}`

    const items = collectItems(childPath, sectionId, meta)
    if (Array.isArray(links)) {
      links.forEach((link, i) => {
        const embed = buildEmbed(link, i, sectionId)
        if (embed) items.push(embed)
      })
    }

    if (items.length > 0) {
      sections.push({
        slug,
        title,
        description: meta.description || '',
        order: typeof meta.order === 'number' ? meta.order : orderOf(child.name),
        breadcrumb: [...trail, title],
        count: items.length,
        items,
      })
    }

    // Nested sub-sub-folders become their own sections, labelled by their trail.
    sections.push(...collectSections(childPath, categorySlug, [...trail, title]))
  }

  return sections
}

function buildCategory(dirName) {
  const dir = join(CONTENT_DIR, dirName)
  const meta = readJson(dir, '_meta.json') || {}
  const links = readJson(dir, '_links.json')
  const title = meta.title || prettify(dirName)
  const slug = slugify(meta.slug || title)

  const sections = collectSections(dir, slug)

  // Loose files sitting directly in the category folder still get shown.
  const looseId = `${slug}/featured`
  const loose = collectItems(dir, looseId, meta)
  if (Array.isArray(links)) {
    links.forEach((link, i) => {
      const embed = buildEmbed(link, i, looseId)
      if (embed) loose.push(embed)
    })
  }
  if (loose.length > 0) {
    sections.unshift({
      slug: 'featured',
      title: meta.looseTitle || 'Selected Work',
      description: '',
      order: -1,
      breadcrumb: [meta.looseTitle || 'Selected Work'],
      count: loose.length,
      items: loose,
    })
  }

  sections.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))

  const allItems = sections.flatMap((s) => s.items)
  const coverItem =
    allItems.find((i) => i.id === meta.cover || i.title === meta.cover) ||
    allItems.find((i) => i.type === 'image') ||
    allItems[0]

  return {
    slug,
    title,
    dirName,
    tagline: meta.tagline || '',
    description: meta.description || '',
    order: typeof meta.order === 'number' ? meta.order : orderOf(dirName),
    accent: meta.accent || '',
    count: allItems.length,
    cover: coverItem ? coverItem.poster || coverItem.src : '',
    coverType: coverItem ? coverItem.type : 'image',
    sections,
  }
}

/* ------------------------------------------------------------------ *
 * Entry point
 * ------------------------------------------------------------------ */
export function scanContent({ quiet = false } = {}) {
  if (!existsSync(CONTENT_DIR)) {
    mkdirSync(CONTENT_DIR, { recursive: true })
  }

  const { dirs } = listDir(CONTENT_DIR)
  const categories = dirs
    .map((d) => buildCategory(d.name))
    .filter((c) => c.count > 0)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))

  const payload = {
    generatedAt: new Date().toISOString(),
    totals: {
      categories: categories.length,
      sections: categories.reduce((n, c) => n + c.sections.length, 0),
      items: categories.reduce((n, c) => n + c.count, 0),
    },
    categories,
  }

  mkdirSync(join(ROOT, 'src', 'generated'), { recursive: true })
  const json = `${JSON.stringify(payload, null, 2)}\n`
  const previous = existsSync(OUT_FILE) ? readFileSync(OUT_FILE, 'utf8') : ''
  const changed = previous !== json
  if (changed) writeFileSync(OUT_FILE, json)

  if (!quiet) {
    console.log(`\n  ▸ Portfolio content — ${payload.totals.items} items in ${payload.totals.sections} sections across ${payload.totals.categories} categories`)
    for (const c of categories) {
      console.log(`    ${c.title.padEnd(20)} ${String(c.count).padStart(3)} items`)
      for (const s of c.sections) console.log(`      · ${s.title.padEnd(24)} ${String(s.count).padStart(3)}`)
    }
    if (payload.totals.items === 0) {
      console.log('    (empty — drop files into public/portfolio/<Category>/<Section>/)')
    }
    console.log('')
  }

  return { payload, changed }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  scanContent()
}
