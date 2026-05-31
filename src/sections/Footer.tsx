import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LINKS = [
  { label: 'Shop', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Drops', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'Twitter', href: '#' },
]

export function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    const content = contentRef.current
    if (!footer || !content) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) return

    gsap.set(content, { y: 60, opacity: 0 })

    ScrollTrigger.create({
      trigger: footer,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(content, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
        })
      },
    })
  }, [])

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden border-t border-fg/10 px-6 pb-8 pt-16 md:px-12 lg:px-16"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'linear-gradient(to top, rgba(206,255,0,0.05), transparent 50%)',
        }}
      />

      <div ref={contentRef} className="relative z-10">
        <div className="mb-16 overflow-hidden">
          <h2
            className="font-display text-[clamp(4rem,18vw,16rem)] uppercase leading-[0.8] text-fg/[0.08]"
            aria-hidden
          >
            Velocity
          </h2>
        </div>

        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-8 gap-y-4">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group relative text-xs uppercase tracking-[0.25em] text-muted transition-colors hover:text-fg"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              © {new Date().getFullYear()} Velocity
            </p>
            <p className="mt-1 text-[10px] text-fg/30">
              Portfolio showcase — Not affiliated with any brand
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
