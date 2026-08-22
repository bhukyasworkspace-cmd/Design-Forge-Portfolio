import { Link } from 'react-router-dom'
import { ButtonLink } from '@/components/Button'
import { ArrowLeft } from '@/components/Icons'
import { categories } from '@/lib/content'

export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center px-5 py-32">
      <div className="w-full max-w-xl text-center">
        <p className="font-display text-[clamp(5rem,22vw,11rem)] font-medium leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/.18)]">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-medium tracking-tight text-white">This page isn&apos;t in the folder</h1>
        <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-white/45">
          The collection you were looking for may have been renamed or moved.
        </p>

        <div className="mt-8 flex justify-center">
          <ButtonLink to="/" icon={<ArrowLeft className="size-4" />} variant="glass">
            Back to the portfolio
          </ButtonLink>
        </div>

        {categories.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <Link key={c.slug} to={`/work/${c.slug}`} className="glass rounded-full px-4 py-2 text-[12.5px] text-white/70">
                {c.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
