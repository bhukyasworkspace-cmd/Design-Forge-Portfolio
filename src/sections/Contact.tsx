import { site } from '@/data/site'
import { asset } from '@/lib/content'
import { useSpotlight } from '@/lib/hooks'
import { Reveal, RevealText } from '@/components/Reveal'
import { ButtonLink } from '@/components/Button'
import Marquee from '@/components/Marquee'
import { ArrowUpRight, Download, Mail, socialIcons } from '@/components/Icons'

export default function Contact() {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>()

  return (
    <section id="contact" className="relative scroll-mt-24 pt-6 sm:pt-10">
      {/* Oversized invitation strip */}
      <div className="border-y border-white/[0.07] py-6">
        <Marquee words={['Let’s work together', 'Open for briefs', 'Say hello']} tone="solid" speed={38} reverse />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pb-24">
        <div
          ref={ref}
          onPointerMove={onPointerMove}
          className="spotlight glass-tile relative overflow-hidden p-7 sm:p-12 lg:p-16"
        >
          {/* Ember bloom */}
          <div className="pointer-events-none absolute -right-24 -top-24 size-[28rem] rounded-full bg-[radial-gradient(circle,rgb(255_92_26/.24),transparent_65%)] blur-3xl" />

          <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="flex items-center gap-3">
                  <span className="font-body text-[11px] tracking-[0.3em] text-ember-500">04</span>
                  <span className="h-px w-7 bg-linear-to-r from-ember-500 to-transparent" />
                  <span className="eyebrow">Get in touch</span>
                </div>
              </Reveal>

              <h2 className="mt-5 font-display text-[clamp(2.2rem,6vw,4.25rem)] font-medium leading-[0.95] tracking-[-0.045em] text-white">
                <RevealText text="Have something" />
                <br />
                <RevealText text="worth designing?" className="text-ember" delay={0.1} />
              </h2>

              <Reveal delay={0.18}>
                <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-white/50">
                  Posters, thumbnails, motion graphics, a full content shoot, or a grade on footage you already have —
                  tell me what you need and I&apos;ll come back with a plan and a timeline.
                </p>
              </Reveal>

              <Reveal delay={0.26}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <ButtonLink href={`mailto:${site.email}`} icon={<ArrowUpRight className="size-4" />}>
                    Start a project
                  </ButtonLink>
                  <ButtonLink href={asset(site.resume)} variant="glass" icon={<Download className="size-4" />}>
                    Download résumé
                  </ButtonLink>
                </div>
              </Reveal>

              <Reveal delay={0.32}>
                <a
                  href={`mailto:${site.email}`}
                  className="group mt-10 inline-flex items-center gap-3 text-white/45 transition-colors hover:text-white"
                >
                  <Mail className="size-4" />
                  <span className="border-b border-white/15 pb-0.5 text-[14px] tracking-tight transition-colors group-hover:border-ember-500">
                    {site.email}
                  </span>
                </a>
              </Reveal>
            </div>

            {/* Channels */}
            <div className="lg:col-span-5">
              <Reveal delay={0.2} direction="left">
                <p className="eyebrow mb-4">Channels</p>
                <div className="space-y-2.5">
                  {site.socials.map((social) => {
                    const Icon = socialIcons[social.label]
                    return (
                      <a
                        key={social.label}
                        href={social.url}
                        target={social.url.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                        className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:border-white/22 hover:bg-white/[0.07]"
                      >
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/[0.05] text-white/70 transition-all duration-500 group-hover:border-ember-500/45 group-hover:text-ember-400">
                          <Icon className="size-[18px]" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13.5px] font-medium tracking-tight text-white">{social.label}</span>
                          <span className="block truncate text-[12px] text-white/35">{social.handle}</span>
                        </span>
                        <ArrowUpRight className="size-4 shrink-0 text-white/25 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember-400" />
                      </a>
                    )
                  })}
                </div>

                <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-[12.5px] font-medium tracking-tight text-white/75">{site.availability}</span>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-white/35">
                    Based in {site.location}. Replies usually land within a day.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
