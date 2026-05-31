import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Counter } from '../components/Counter'
import { STATS } from '../data/mock'

gsap.registerPlugin(ScrollTrigger)

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const decorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const decor = decorRef.current
    if (!section || !decor) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) return

    gsap.fromTo(
      decor,
      { y: 60 },
      {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      },
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-fg/10 bg-bg px-6 py-24 md:px-12 md:py-32"
      aria-label="Statistics"
    >
      <div
        ref={decorRef}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[clamp(8rem,25vw,20rem)] leading-none text-fg/[0.02]"
      >
        100K
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-muted">
            05 — By The Numbers
          </span>
          <h2 className="mt-4 font-display text-[clamp(2.5rem,7vw,5rem)] uppercase leading-[0.9]">
            Global <span className="text-accent">Hype.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {STATS.map((stat) => (
            <div key={stat.id} className="text-center md:text-left">
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                decimals={stat.decimals}
                className="font-display text-[clamp(2.5rem,6vw,4.5rem)] text-accent"
              />
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
