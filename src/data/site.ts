/**
 * ────────────────────────────────────────────────────────────────
 *  SITE CONFIG — edit this file to update everything written on the
 *  portfolio. Project images/videos are NOT here: those come from the
 *  `public/portfolio/` folders automatically.
 * ────────────────────────────────────────────────────────────────
 */

export const site = {
  name: 'Bhukya Jithendar Nayak',
  firstName: 'Bhukya',
  lastName: 'Jithendar Nayak',
  role: 'Graphic & Motion Designer',
  location: 'India',
  availability: 'Available for freelance & full-time',
  intro:
    'I design social-media creatives, posters, thumbnails and motion graphics that earn attention in the first half-second. Colour grading in DaVinci Resolve, content shoots and campaign strategy sit alongside the design work — so a client gets one person who can take an idea from the shot list to the final export.',
  about: [
    'I am a creative graphic designer who lives in the space between a strong idea and a clean execution. Most of my work is built for feeds and thumbnails — formats where you have a fraction of a second to earn a click, so hierarchy, contrast and typography have to do real work.',
    'Beyond static design I grade footage in DaVinci Resolve, shoot and direct content, and run campaigns end to end. That mix means I can hand over a finished piece rather than an asset that still needs three more people to be useful.',
  ],
  quote: 'A design has half a second to earn the next five. I build for that half second.',
  resume: 'assets/docs/Resume.pdf',
  profileImage: 'assets/img/profile.png',
  aboutImage: 'assets/img/about.jpg',
  email: 'bhukyasworkspace@gmail.com',
  socials: [
    { label: 'Instagram', handle: '@designforge_9', url: 'https://www.instagram.com/designforge_9/' },
    { label: 'LinkedIn', handle: 'bhukya-jithendar-nayak', url: 'https://www.linkedin.com/in/bhukya-jithendar-nayak/' },
    { label: 'Email', handle: 'bhukyasworkspace@gmail.com', url: 'mailto:bhukyasworkspace@gmail.com' },
  ],
  stats: [
    { value: '1+', label: 'Years designing', sub: 'Graphic & motion' },
    { value: '150+', label: 'Creatives shipped', sub: 'Posters, thumbs, reels' },
    { value: '8', label: 'Disciplines', sub: 'Brief to delivery' },
    { value: '5', label: 'Tools mastered', sub: 'Adobe + DaVinci' },
  ],
  education: { degree: 'B.Tech — AI & Machine Learning', note: 'Bachelor of Technology' },
} as const

/* ── Marquee strip under the hero ─────────────────────────────── */
export const marqueeWords = [
  'Graphic Design',
  'Motion Graphics',
  'Colour Grading',
  'Thumbnail Design',
  'Poster Art',
  'Content Shoot',
  'Digital Marketing',
  'Client Management',
] as const

/* ── Skills ───────────────────────────────────────────────────── */
export type IconKey =
  | 'layers'
  | 'poster'
  | 'motion'
  | 'thumbnail'
  | 'grade'
  | 'camera'
  | 'handshake'
  | 'megaphone'

export type Skill = {
  title: string
  level: 'Basic' | 'Intermediate' | 'Advanced'
  strength: number // 0–100, drives the meter
  blurb: string
  detail: string
  icon: IconKey
  deliverables: string[]
}

export const skills: Skill[] = [
  {
    title: 'Graphic Design',
    level: 'Intermediate',
    strength: 88,
    icon: 'layers',
    blurb: 'Layout, type and composition for social-first creatives.',
    detail:
      'Every layout starts with the one thing it has to communicate, then everything else is built to point at it — scale, contrast, negative space and a type system that holds up at thumbnail size.',
    deliverables: ['Social creatives', 'Ad sets', 'Carousels', 'Type systems'],
  },
  {
    title: 'Branding & Posters',
    level: 'Intermediate',
    strength: 84,
    icon: 'poster',
    blurb: 'Identity systems and print-ready poster art with a point of view.',
    detail:
      'Poster work is where an idea has to survive without motion or sound. I build key visuals that read from across a room and still hold detail up close, with print-ready files at the end.',
    deliverables: ['Key visuals', 'Event posters', 'Logo & marks', 'Brand sheets'],
  },
  {
    title: 'Motion Graphics',
    level: 'Intermediate',
    strength: 80,
    icon: 'motion',
    blurb: 'Kinetic type, logo stings and animated explainers in After Effects.',
    detail:
      'Motion is timing before it is movement. I animate type, logo reveals and segment transitions in After Effects with easing that feels deliberate rather than decorative.',
    deliverables: ['Logo stings', 'Kinetic type', 'Lower thirds', 'Explainers'],
  },
  {
    title: 'Thumbnail Design',
    level: 'Advanced',
    strength: 92,
    icon: 'thumbnail',
    blurb: 'Click-driven compositions built around faces, contrast and negative space.',
    detail:
      'Thumbnails are the most measurable design work there is. I build around a clear focal face, aggressive contrast and a maximum of three readable elements — then test the composition at actual feed size.',
    deliverables: ['YouTube thumbnails', 'Reel covers', 'Podcast art', 'A/B variants'],
  },
  {
    title: 'Colour Grading',
    level: 'Intermediate',
    strength: 78,
    icon: 'grade',
    blurb: 'Node-based grading and look development in DaVinci Resolve.',
    detail:
      'Grading in DaVinci Resolve: balance the shot first, then build the look on separate nodes so it stays editable. Consistent skin tones across a whole shoot matter more than a dramatic LUT.',
    deliverables: ['Shot balancing', 'Look dev', 'LUT sets', 'Delivery exports'],
  },
  {
    title: 'Content Shoot',
    level: 'Intermediate',
    strength: 74,
    icon: 'camera',
    blurb: 'Concepting, shot lists and on-set direction for brand content.',
    detail:
      'I plan shoots the way I plan a layout — knowing the final crop before the camera comes out. Concept, shot list, direction on the day, and footage that actually cuts together afterwards.',
    deliverables: ['Concept decks', 'Shot lists', 'On-set direction', 'Product & lifestyle'],
  },
  {
    title: 'Client Management',
    level: 'Intermediate',
    strength: 82,
    icon: 'handshake',
    blurb: 'Briefs, revision rounds and delivery timelines handled end to end.',
    detail:
      'A clear brief prevents most revisions. I scope the work up front, set revision rounds, keep one channel for feedback and deliver on the date agreed — no chasing required.',
    deliverables: ['Scoping & briefs', 'Revision rounds', 'Timelines', 'Asset handover'],
  },
  {
    title: 'Digital Marketing',
    level: 'Intermediate',
    strength: 76,
    icon: 'megaphone',
    blurb: 'Campaign creatives shaped by what the analytics actually reward.',
    detail:
      'Design decisions get better when they are checked against numbers. I build campaign creative around platform behaviour, then read what performed and fold it back into the next round.',
    deliverables: ['Campaign creative', 'Platform-native cuts', 'Performance reads', 'Content calendars'],
  },
]

/* ── Tools ────────────────────────────────────────────────────── */
export type Tool = {
  name: string
  short: string
  mark?: 'davinci'
  level: 'Basic' | 'Intermediate' | 'Advanced'
  use: string
  color: string
  tint: string
}

export const tools: Tool[] = [
  { name: 'Photoshop', short: 'Ps', level: 'Advanced', use: 'Composite & retouch', color: '#31A8FF', tint: '#001E36' },
  { name: 'After Effects', short: 'Ae', level: 'Intermediate', use: 'Motion & VFX', color: '#9D9DFF', tint: '#1D0B36' },
  { name: 'Premiere Pro', short: 'Pr', level: 'Intermediate', use: 'Edit & assembly', color: '#EA77FF', tint: '#2A0634' },
  { name: 'DaVinci Resolve', short: 'Dr', mark: 'davinci', level: 'Intermediate', use: 'Colour grading', color: '#5BC0E8', tint: '#22303C' },
  { name: 'Illustrator', short: 'Ai', level: 'Basic', use: 'Vector & marks', color: '#FF9A00', tint: '#330000' },
]

/* ── Fallback copy for portfolio categories ───────────────────── *
 * Matched by folder slug. Anything not listed here still renders —
 * add a _meta.json in the folder to give it a custom tagline.       */
export const categoryCopy: Record<string, { tagline: string; description: string }> = {
  posters: {
    tagline: 'Print & social',
    description: 'Poster art and key visuals — built around a single strong idea, then pushed with type and colour.',
  },
  thumbnails: {
    tagline: 'Built to be clicked',
    description: 'Original concepts and studied recreations. Every frame is a test of contrast, focus and hierarchy.',
  },
  'motion-graphics': {
    tagline: 'Frame by frame',
    description: 'Kinetic typography, logo reveals and animated segments composited in After Effects.',
  },
  videos: {
    tagline: 'Shot, cut, graded',
    description: 'Edits and short-form content — from the shoot through the cut to the final DaVinci grade.',
  },
}
