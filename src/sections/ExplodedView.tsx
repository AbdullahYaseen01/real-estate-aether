import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LazyMount } from '../components/LazyMount'
import { ExplodedScene } from '../three/ExplodedScene'
import { EXPLODED_PARTS, SPECS } from '../data/mock'

gsap.registerPlugin(ScrollTrigger)

function formatSpec(value: number, suffix: string) {
  return `${Math.round(value)}${suffix}`
}

export function ExplodedView() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const [progress, setProgress] = useState(0)
  const [specValues, setSpecValues] = useState<number[]>(SPECS.map(() => 0))

  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    if (!section || !pin) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) {
      progressRef.current = 1
      setProgress(1)
      setSpecValues(SPECS.map((s) => s.value))
      return
    }

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=200%',
      pin: pin,
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress
        setProgress(self.progress)
      },
    })

    return () => st.kill()
  }, [])

  useEffect(() => {
    const targets = SPECS.map((spec) => (progress >= 0.4 ? spec.value : 0))
    const objs = targets.map((target, i) => ({ val: specValues[i], target }))

    objs.forEach((obj, i) => {
      gsap.to(obj, {
        val: obj.target,
        duration: 0.8,
        ease: 'power3.out',
        onUpdate: () => {
          setSpecValues((prev) => {
            const next = [...prev]
            next[i] = obj.val
            return next
          })
        },
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Math.floor(progress * 10)])

  const visibleParts = EXPLODED_PARTS.map((part, i) => ({
    ...part,
    visible: progress > 0.25 + i * 0.15,
  }))

  return (
    <section
      ref={sectionRef}
      className="relative bg-bg"
      aria-label="Technical breakdown"
    >
      <div ref={pinRef} className="relative flex min-h-screen flex-col lg:flex-row">
        <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-16 md:px-12 lg:px-16">
          <span className="mb-4 text-xs uppercase tracking-[0.4em] text-muted">
            03 — Anatomy
          </span>
          <h2 className="font-display text-[clamp(2.5rem,7vw,5rem)] uppercase leading-[0.9] text-fg">
            Built To
            <br />
            <span className="text-accent">Perform.</span>
          </h2>

          <div className="mt-10 space-y-6">
            {visibleParts.map((part) => (
              <div
                key={part.id}
                className="border-l-2 border-accent/40 pl-5 transition-all duration-700"
                style={{
                  opacity: part.visible ? 1 : 0,
                  transform: part.visible ? 'translateX(0)' : 'translateX(-20px)',
                }}
              >
                <h3 className="font-display text-xl uppercase tracking-wide text-fg">
                  {part.label}
                </h3>
                <p className="mt-1 text-sm text-muted">{part.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-fg/10 pt-8">
            {SPECS.map((spec, i) => (
              <div key={spec.label}>
                <span className="font-display text-[clamp(1.8rem,4vw,2.8rem)] text-accent">
                  {formatSpec(specValues[i], spec.suffix)}
                </span>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted">
                  {spec.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[45vh] flex-1 lg:h-auto">
          <LazyMount minHeight="45vh" className="h-full w-full">
            <ExplodedScene progressRef={progressRef} />
          </LazyMount>
        </div>
      </div>
    </section>
  )
}
