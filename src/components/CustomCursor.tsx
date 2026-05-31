import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const LABELS: Record<string, string> = {
  drag: 'DRAG',
  view: 'VIEW',
  default: '',
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(false)
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) {
      setDisabled(true)
      return
    }

    const dot = dotRef.current
    const label = labelRef.current
    if (!dot || !label) return

    setVisible(true)

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const target = { ...pos }

    gsap.set(dot, { x: pos.x, y: pos.y, xPercent: -50, yPercent: -50 })

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
    }

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      const cursorType = el.closest('[data-cursor]')?.getAttribute('data-cursor')
      const interactive = el.closest('a, button, [data-cursor]')

      if (cursorType && LABELS[cursorType]) {
        label.textContent = LABELS[cursorType]
        gsap.to(dot, { scale: 2.8, duration: 0.35, ease: 'power3.out' })
        gsap.to(label, { opacity: 1, duration: 0.25 })
      } else if (interactive) {
        label.textContent = ''
        gsap.to(dot, { scale: 1.8, duration: 0.35, ease: 'power3.out' })
        gsap.to(label, { opacity: 0, duration: 0.2 })
      } else {
        label.textContent = ''
        gsap.to(dot, { scale: 1, duration: 0.35, ease: 'power3.out' })
        gsap.to(label, { opacity: 0, duration: 0.2 })
      }
    }

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.18
      pos.y += (target.y - pos.y) * 0.18
      gsap.set(dot, { x: pos.x, y: pos.y })
    }

    gsap.ticker.add(tick)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [])

  if (disabled) return null

  return (
    <div
      ref={dotRef}
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-[10000] mix-blend-difference transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-fg">
        <span
          ref={labelRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[10px] tracking-widest text-bg opacity-0"
        >
          DRAG
        </span>
      </div>
    </div>
  )
}
