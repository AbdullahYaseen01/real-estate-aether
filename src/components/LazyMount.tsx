import { useEffect, useRef, useState, type ReactNode } from 'react'

interface LazyMountProps {
  children: ReactNode
  rootMargin?: string
  minHeight?: string
  className?: string
}

/** Mount children only when near viewport — saves GPU/CPU for 3D & heavy sections */
export function LazyMount({
  children,
  rootMargin = '200px',
  minHeight = '400px',
  className = '',
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return (
    <div ref={ref} className={className} style={{ minHeight: visible ? undefined : minHeight }}>
      {visible ? children : null}
    </div>
  )
}
