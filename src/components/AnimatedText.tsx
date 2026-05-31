import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'p' | 'span'
}

export function AnimatedText({
  text,
  className = '',
  delay = 0,
  as: Tag = 'h1',
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const words = text.split(' ')
    el.innerHTML = words
      .map(
        (word) =>
          `<span class="line-mask inline-block overflow-hidden align-top"><span class="line-mask-inner inline-block">${word}&nbsp;</span></span>`,
      )
      .join('')

    const inners = el.querySelectorAll('.line-mask-inner')

    if (prefersReducedMotion) {
      gsap.set(inners, { y: 0 })
      return
    }

    gsap.fromTo(
      inners,
      { y: '110%' },
      {
        y: '0%',
        duration: 1,
        ease: 'power4.out',
        stagger: 0.08,
        delay,
      },
    )
  }, [text, delay])

  return (
    <Tag
      ref={ref as never}
      className={`font-display uppercase leading-[0.85] tracking-tight ${className}`}
    />
  )
}
