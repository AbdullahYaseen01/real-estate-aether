import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MARQUEE_ITEMS } from '../data/mock'

gsap.registerPlugin(ScrollTrigger)

const TEXT = MARQUEE_ITEMS.join(' · ') + ' · '

export function KineticMarquee() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)
  const velocityRef = useRef(0)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) return

    let lastScroll = 0

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        velocityRef.current = (self.scroll() - lastScroll) * 0.15
        lastScroll = self.scroll()
      },
    })

    const tick = () => {
      velocityRef.current *= 0.92
      xRef.current -= 0.8 + Math.abs(velocityRef.current) * 0.05
      if (xRef.current <= -track.scrollWidth / 2) xRef.current = 0
      gsap.set(track, { x: xRef.current })
    }

    gsap.ticker.add(tick)

    return () => {
      st.kill()
      gsap.ticker.remove(tick)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden border-y border-fg/10 bg-bg py-6 md:py-8"
      aria-label="Brand marquee"
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-8 px-4 md:gap-12"
            aria-hidden={i === 1}
          >
            {Array.from({ length: 3 }).map((_, j) => (
              <span
                key={j}
                className="font-display text-[clamp(2rem,6vw,4.5rem)] uppercase leading-none text-accent"
              >
                {TEXT}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
