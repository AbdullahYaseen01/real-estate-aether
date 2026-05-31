import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TESTIMONIALS, PRESS_LOGOS } from '../data/mock'

gsap.registerPlugin(ScrollTrigger)

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)

  const goTo = (index: number) => {
    setDirection(index > active ? 1 : -1)
    setActive((index + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -60) goTo(active + 1)
    else if (info.offset.x > 60) goTo(active - 1)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1)
      setActive((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const logos = section.querySelectorAll('[data-press-logo]')
    gsap.set(logos, { opacity: 0, y: 20 })

    ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(logos, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08,
        })
      },
    })
  }, [])

  const testimonial = TESTIMONIALS[active]
  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -60 }),
  }

  return (
    <section
      ref={sectionRef}
      className="relative px-6 py-24 md:px-12 md:py-32 lg:px-16"
      aria-label="Testimonials and press"
    >
      <span className="text-xs uppercase tracking-[0.4em] text-muted">
        06 — Press & Voices
      </span>

      <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div className="relative min-h-[280px]" data-lenis-prevent>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.blockquote
              key={testimonial.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <span className="font-display text-6xl leading-none text-accent md:text-8xl">
                "
              </span>
              <p className="mt-4 font-body text-xl leading-relaxed text-fg md:text-2xl">
                {testimonial.quote}
              </p>
              <footer className="mt-8">
                <cite className="not-italic">
                  <span className="font-display text-lg uppercase text-fg">
                    {testimonial.author}
                  </span>
                  <span className="ml-3 text-sm text-muted">{testimonial.role}</span>
                </cite>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="absolute -bottom-4 left-0 flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1 transition-all duration-500 ${
                  i === active ? 'w-8 bg-accent' : 'w-4 bg-fg/20'
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-8 text-xs uppercase tracking-[0.3em] text-muted">
            As Seen In
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {PRESS_LOGOS.map((logo) => (
              <div
                key={logo}
                data-press-logo
                className="flex h-16 items-center justify-center border border-fg/10 font-display text-sm tracking-widest text-fg/40 transition-colors hover:border-accent/30 hover:text-fg/70"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
