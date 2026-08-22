import { Link } from 'react-router-dom'
import { site } from '@/data/site'
import { categories } from '@/lib/content'
import { scrollTo } from './SmoothScroll'
import { ArrowUpRight } from './Icons'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/[0.07] pt-14">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-display text-lg font-bold uppercase tracking-[0.02em] text-white">{site.name}</p>
            <p className="mt-2 max-w-sm text-[13px] font-light leading-relaxed text-white/40">
              {site.role} working across posters, thumbnails, motion graphics, colour grading and content production.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-5 inline-flex items-center gap-2 text-[13px] text-white/60 transition-colors hover:text-ember-400"
            >
              {site.email}
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>

          <nav>
            <p className="eyebrow mb-4">Sections</p>
            <ul className="space-y-2.5">
              {['about', 'expertise', 'work', 'contact'].map((id) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(`#${id}`)}
                    className="text-[13px] capitalize text-white/40 transition-colors hover:text-white"
                  >
                    {id}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav>
            <p className="eyebrow mb-4">Collections</p>
            <ul className="space-y-2.5">
              {categories.length === 0 && <li className="text-[13px] text-white/25">Coming soon</li>}
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/work/${c.slug}`}
                    className="group inline-flex items-center gap-2 text-[13px] text-white/40 transition-colors hover:text-white"
                  >
                    {c.title}
                    <span className="text-[11px] text-white/20 tabular-nums">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Oversized wordmark */}
        <div
          aria-hidden
          className="select-none overflow-hidden border-t border-white/[0.06] pt-8 text-center font-display text-[clamp(1.6rem,8.4vw,7rem)] font-extrabold leading-[0.85] tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/.1)]"
        >
          BHUKYA JITHENDAR NAYAK
        </div>

        <div className="flex flex-col items-center justify-between gap-3 py-7 text-[11.5px] text-white/30 sm:flex-row">
          <p>© {year} {site.name}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {site.socials.slice(0, 2).map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
                {s.label}
              </a>
            ))}
            <button type="button" onClick={() => scrollTo(0, 0)} className="transition-colors hover:text-white">
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
