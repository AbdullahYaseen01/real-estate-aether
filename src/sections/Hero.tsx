import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { AnimatedText } from '../components/AnimatedText'
import { MagneticButton } from '../components/MagneticButton'
import { HeroScene } from '../three/HeroScene'
import { HERO_PRODUCT } from '../data/mock'

interface HeroProps {
  ready?: boolean
}

export function Hero({ ready = true }: HeroProps) {
  const indicatorRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const shoeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ready) return

    const indicator = indicatorRef.current
    const grid = gridRef.current
    const shoe = shoeRef.current
    if (!indicator) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) return

    gsap.fromTo(
      grid,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, delay: 0.5, ease: 'power2.out' },
    )

    if (shoe) {
      gsap.to(shoe, {
        y: -10,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    }

    gsap.to(indicator.querySelector('.scroll-line'), {
      scaleY: 0,
      transformOrigin: 'top center',
      duration: 1.2,
      ease: 'power2.inOut',
      repeat: -1,
    })
  }, [ready])

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-bg px-4 pb-14 sm:px-6">
      <div
        ref={gridRef}
        className="pointer-events-none absolute inset-0 opacity-0"
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(244,244,240,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(244,244,240,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
        <div className="absolute right-4 top-[18%] font-display text-[clamp(6rem,22vw,16rem)] leading-none text-fg/[0.04] md:right-8">
          01
        </div>
      </div>

      {/* Headline — large, above shoe, no overlap */}
      <div className="relative z-20 shrink-0 pt-20 text-center sm:pt-24 md:pt-28">
        {ready && (
          <AnimatedText
            text="MOVE DIFFERENT."
            className="mx-auto max-w-[95vw] text-[clamp(3rem,12vw,10.5rem)] leading-[0.88] tracking-tight text-fg"
            delay={0.3}
          />
        )}
      </div>

      {/* 3D shoe — premium canvas with effects */}
      <div
        ref={shoeRef}
        className="relative z-10 mx-auto mt-2 h-[min(54vh,580px)] w-full max-w-6xl sm:mt-3 md:mt-4 md:h-[min(60vh,660px)]"
      >
        {/* Animated accent lines */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2">
            <div className="hero-ring h-full w-full rounded-full border border-accent/10" />
          </div>
          <div className="absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2">
            <div className="hero-ring-delay h-full w-full rounded-full border border-accent/5" />
          </div>
        </div>
        {ready && <HeroScene />}
      </div>

      <div className="relative z-20 mx-auto mt-1 flex max-w-xl shrink-0 flex-col items-center gap-3 text-center sm:mt-2 md:gap-4">
        <p className="font-display text-xl uppercase tracking-[0.12em] text-fg sm:text-2xl md:text-3xl">
          {HERO_PRODUCT.name}
        </p>
        <p className="text-xs uppercase tracking-[0.25em] text-muted sm:text-sm">
          {HERO_PRODUCT.subtitle} — Engineered for motion
        </p>
        <MagneticButton
          className="group mt-1 border border-fg/20 bg-fg px-10 py-4 font-body text-xs font-semibold uppercase tracking-[0.3em] text-bg transition-colors hover:bg-accent hover:text-bg sm:px-12 sm:py-5"
          data-cursor="view"
        >
          <span className="relative z-10">Customize Yours</span>
        </MagneticButton>
      </div>

      <div
        ref={indicatorRef}
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-8"
      >
        <span className="text-[10px] uppercase tracking-[0.35em] text-muted">
          Scroll
        </span>
        <div className="relative h-12 w-px overflow-hidden bg-fg/20">
          <div className="scroll-line absolute inset-0 bg-accent" />
        </div>
      </div>
    </section>
  )
}
