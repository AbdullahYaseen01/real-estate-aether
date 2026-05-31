import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence } from 'framer-motion'
import { ColorSwatch, ColorwayLabel } from '../components/ColorSwatch'
import { LazyMount } from '../components/LazyMount'
import { ColorwayScene } from '../three/ColorwayScene'
import { COLORWAYS } from '../data/mock'

gsap.registerPlugin(ScrollTrigger)

export function ColorwaySwitcher() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const colorway = COLORWAYS[active]

  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    if (!section || !pin) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) return

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=120%',
      pin: pin,
      pinSpacing: true,
    })

    return () => st.kill()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    gsap.to(section, {
      backgroundColor: colorway.bg,
      duration: 0.8,
      ease: 'power3.out',
    })
  }, [colorway.bg])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[140vh] bg-bg transition-colors duration-700"
      aria-label="Colorway switcher"
    >
      <div ref={pinRef} className="flex min-h-screen flex-col lg:flex-row">
        <div className="flex flex-1 flex-col justify-center px-6 py-20 md:px-12 lg:px-16">
          <span className="mb-4 text-xs uppercase tracking-[0.4em] text-muted">
            02 — Colorways
          </span>
          <h2 className="mb-8 font-display text-[clamp(2.5rem,7vw,5rem)] uppercase leading-[0.9] text-fg">
            Pick Your
            <br />
            <span style={{ color: colorway.accent }}>Energy.</span>
          </h2>

          <AnimatePresence mode="wait">
            <ColorwayLabel
              key={colorway.id}
              name={colorway.name}
              accent={colorway.accent}
            />
          </AnimatePresence>

          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
            Four limited palettes. Real-time material swap. Each drop ships with
            matching accent hardware and reflective details.
          </p>

          <div className="mt-10 flex flex-wrap gap-6 md:gap-8">
            {COLORWAYS.map((cw, i) => (
              <ColorSwatch
                key={cw.id}
                color={cw.upper}
                accent={cw.accent}
                name={cw.name}
                active={i === active}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>

        <div className="relative flex-1">
          <div
            className="absolute inset-0 opacity-20 transition-colors duration-700"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${colorway.accent}, transparent 70%)`,
            }}
          />
          <div className="relative h-[50vh] lg:h-full lg:min-h-screen">
            <LazyMount minHeight="50vh" className="h-full w-full">
              <ColorwayScene
                upperColor={colorway.upper}
                accentColor={colorway.accent}
              />
            </LazyMount>
          </div>
        </div>
      </div>
    </section>
  )
}
