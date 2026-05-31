import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RevealImageProps {
  src: string
  alt: string
  wrapClassName?: string
  imgClassName?: string
  eager?: boolean
}

export function RevealImage({
  src,
  alt,
  wrapClassName = '',
  imgClassName = '',
  eager = false,
}: RevealImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const img = imgRef.current
    if (!wrap || !img) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) {
      gsap.set([wrap, img], { clearProps: 'all' })
      return
    }

    gsap.set(wrap, { clipPath: 'inset(100% 0 0 0)' })
    gsap.set(img, { scale: 1.08 })

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap
          .timeline()
          .to(wrap, {
            clipPath: 'inset(0% 0 0 0)',
            duration: 0.9,
            ease: 'power4.out',
          })
          .to(img, { scale: 1, duration: 1, ease: 'power3.out' }, '-=0.7')
      },
    })

    return () => st.kill()
  }, [src])

  return (
    <div ref={wrapRef} className={`h-full w-full overflow-hidden ${wrapClassName}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`h-full w-full ${imgClassName}`}
      />
    </div>
  )
}
