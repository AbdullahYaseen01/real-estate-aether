import {
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useRef,
} from 'react'
import gsap from 'gsap'

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  strength?: number
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  onMouseMove,
  onMouseLeave,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)

  const handleMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    gsap.to(el, {
      x: x * strength,
      y: y * strength,
      duration: 0.4,
      ease: 'power3.out',
    })

    onMouseMove?.(e)
  }

  const handleLeave = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current
    if (el) {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'power3.out' })
    }
    onMouseLeave?.(e)
  }

  return (
    <button
      ref={ref}
      type="button"
      className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...props}
    >
      {children}
    </button>
  )
}
