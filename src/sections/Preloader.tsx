import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface PreloaderProps {
  onComplete: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const sweepRef = useRef<HTMLDivElement>(null)
  const shoeRef = useRef<SVGSVGElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const overlay = overlayRef.current
    const counter = counterRef.current
    const sweep = sweepRef.current
    const shoe = shoeRef.current
    if (!overlay || !counter || !sweep || !shoe) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const counterObj = { value: 0 }

    if (prefersReducedMotion) {
      counter.textContent = '100'
      gsap.set(shoe, { opacity: 1 })
      gsap.to(overlay, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.6,
        delay: 0.3,
        ease: 'power4.inOut',
        onComplete: () => {
          setDone(true)
          onComplete()
        },
      })
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true)
        onComplete()
      },
    })

    gsap.set(shoe, { opacity: 0, scale: 0.85, transformOrigin: '50% 50%' })
    gsap.set(sweep, { scaleX: 0, transformOrigin: 'left center' })

    tl.to(counterObj, {
      value: 100,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        counter.textContent = String(Math.round(counterObj.value)).padStart(
          3,
          '0',
        )
      },
    })
      .to(
        sweep,
        { scaleX: 1, duration: 1.8, ease: 'power3.inOut' },
        0.2,
      )
      .to(
        shoe,
        { opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out' },
        0.6,
      )
      .to(
        overlay,
        {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.9,
          ease: 'power4.inOut',
        },
        '-=0.15',
      )

    return () => {
      tl.kill()
    }
  }, [onComplete])

  if (done) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg"
      style={{ clipPath: 'inset(0 0 0 0)' }}
    >
      <div className="relative flex flex-col items-center gap-10">
        <svg
          ref={shoeRef}
          viewBox="0 0 200 100"
          className="h-24 w-48 opacity-0 md:h-32 md:w-64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 65 Q30 55 55 52 L130 48 Q160 46 175 55 L185 62 Q188 68 180 72 L60 78 Q35 80 22 72 Z"
            stroke="#F4F4F0"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M55 52 L130 48"
            stroke="#CEFF00"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M70 48 L95 46 L110 50"
            stroke="#F4F4F0"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>

        <div className="relative overflow-hidden">
          <span
            ref={counterRef}
            className="font-display text-[clamp(4rem,15vw,10rem)] leading-none text-fg"
          >
            000
          </span>
          <div
            ref={sweepRef}
            className="absolute inset-0 bg-accent mix-blend-multiply"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        <p className="font-body text-xs uppercase tracking-[0.4em] text-muted">
          Loading experience
        </p>
      </div>
    </div>
  )
}
