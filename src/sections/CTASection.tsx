import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatedText } from '../components/AnimatedText'
import { MagneticButton } from '../components/MagneticButton'

gsap.registerPlugin(ScrollTrigger)

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null)
  const washRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const wash = washRef.current
    if (!section || !wash) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) return

    gsap.fromTo(
      wash,
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1,
        },
      },
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-32 md:px-12 md:py-40 lg:px-16"
      aria-label="Call to action"
    >
      <div
        ref={washRef}
        className="pointer-events-none absolute inset-0 bg-accent/10"
        style={{ transform: 'scaleX(0)' }}
      />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <AnimatedText
          text="SHOP THE DROP."
          className="text-[clamp(3rem,12vw,10rem)] text-fg"
        />
        <p className="mx-auto mt-8 max-w-lg text-sm leading-relaxed text-muted">
          Limited quantities. No restocks. Join the waitlist or secure your pair
          before the next sellout.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticButton
            className="bg-accent px-12 py-5 font-body text-xs font-bold uppercase tracking-[0.35em] text-bg transition-opacity hover:opacity-90"
            data-cursor="view"
          >
            Shop The Drop
          </MagneticButton>
          <MagneticButton
            className="border border-fg/20 px-12 py-5 font-body text-xs font-semibold uppercase tracking-[0.35em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            Join Waitlist
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
