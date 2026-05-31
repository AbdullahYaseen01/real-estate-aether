import { useEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CounterProps {
  value: number
  suffix?: string
  decimals?: number
  className?: string
  duration?: number
}

export function Counter({
  value,
  suffix = '',
  decimals = 0,
  className = '',
  duration = 2,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const objRef = useRef({ val: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const format = (n: number) =>
      decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString()

    if (prefersReducedMotion) {
      el.textContent = `${format(value)}${suffix}`
      return
    }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(objRef.current, {
          val: value,
          duration,
          ease: 'power3.out',
          onUpdate: () => {
            el.textContent = `${format(objRef.current.val)}${suffix}`
          },
        })
      },
    })

    return () => trigger.kill()
  }, [value, suffix, decimals, duration])

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  )
}

interface CounterGroupProps {
  triggerRef: RefObject<HTMLElement | null>
  counters: Array<{ key: string; value: number; suffix?: string; decimals?: number }>
  onUpdate: (values: Record<string, number>) => void
}

export function useScrollCounters({
  triggerRef,
  counters,
  onUpdate,
}: CounterGroupProps) {
  useEffect(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const objs = counters.map((c) => ({ key: c.key, val: 0, target: c.value }))

    if (prefersReducedMotion) {
      const result: Record<string, number> = {}
      counters.forEach((c) => {
        result[c.key] = c.value
      })
      onUpdate(result)
      return
    }

    const st = ScrollTrigger.create({
      trigger,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        objs.forEach((obj) => {
          gsap.to(obj, {
            val: obj.target,
            duration: 2,
            ease: 'power3.out',
            onUpdate: () => {
              onUpdate(
                Object.fromEntries(objs.map((o) => [o.key, o.val])),
              )
            },
          })
        })
      },
    })

    return () => st.kill()
  }, [triggerRef, counters, onUpdate])
}
