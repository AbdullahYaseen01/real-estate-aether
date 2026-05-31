import { useEffect, useRef, type MouseEvent } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RevealImage } from '../components/RevealImage'
import { DROPS } from '../data/mock'

gsap.registerPlugin(ScrollTrigger)

function DropCard({ product }: { product: (typeof DROPS)[0] }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    const imgWrap = imageWrapRef.current
    if (!card || !imgWrap) return

    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    gsap.to(card, {
      rotateY: x * 10,
      rotateX: -y * 8,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 900,
    })
    gsap.to(imgWrap, {
      y: y * -8,
      x: x * 8,
      duration: 0.5,
      ease: 'power2.out',
    })
  }

  const handleLeave = () => {
    const card = cardRef.current
    const imgWrap = imageWrapRef.current
    if (!card) return

    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.7,
      ease: 'power3.out',
    })
    if (imgWrap) {
      gsap.to(imgWrap, { x: 0, y: 0, duration: 0.7, ease: 'power3.out' })
    }
  }

  return (
    <article
      ref={cardRef}
      className="group flex h-full flex-col border border-fg/[0.08] bg-[#0f0f0f] transition-colors duration-500 hover:border-accent/30"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor="view"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Fixed-height image zone — uniform across all cards */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#141414]">
        <div
          ref={imageWrapRef}
          className="absolute inset-0 flex items-center justify-center p-6 md:p-8"
        >
          <RevealImage
            src={product.image}
            alt={product.name}
            wrapClassName="flex h-full w-full items-center justify-center"
            imgClassName="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        {/* Vignette — hides colored photo backgrounds */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#141414_95%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-[#141414]/60" />
        <span className="absolute left-3 top-3 z-10 bg-accent px-2.5 py-1 font-body text-[9px] font-bold uppercase tracking-[0.2em] text-bg md:left-4 md:top-4 md:text-[10px]">
          {product.tag}
        </span>
      </div>

      {/* Info row — consistent height */}
      <div className="flex flex-1 items-end justify-between gap-3 border-t border-fg/[0.06] p-4 md:p-5">
        <div className="min-w-0">
          <h3 className="truncate font-display text-base uppercase tracking-wide text-fg md:text-lg">
            {product.name}
          </h3>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted md:text-xs">
            Drop Collection
          </p>
        </div>
        <span className="shrink-0 font-display text-xl text-accent md:text-2xl">
          ${product.price.toLocaleString()}
        </span>
      </div>
    </article>
  )
}

export function FeaturedDrops() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) return

    const cards = grid.querySelectorAll('[data-drop-card]')
    gsap.set(cards, { y: 60, opacity: 0 })

    ScrollTrigger.create({
      trigger: grid,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.1,
        })
      },
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative px-4 py-20 sm:px-6 md:px-12 md:py-28 lg:px-16"
      aria-label="Featured drops"
    >
      <div className="pointer-events-none absolute right-4 top-12 font-display text-[clamp(4rem,14vw,11rem)] leading-none text-fg/[0.03] md:right-8 md:top-16">
        04
      </div>

      <div className="mb-12 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-muted">
            Featured Drops
          </span>
          <h2 className="mt-3 font-display text-[clamp(2.5rem,7vw,5rem)] uppercase leading-[0.9]">
            The Latest
            <br />
            <span className="text-accent">Heat.</span>
          </h2>
        </div>
        <p className="max-w-xs text-sm text-muted">
          Curated silhouettes from our current season. Each pair numbered and
          limited.
        </p>
      </div>

      {/* Uniform 4-column row — equal sizing */}
      <div
        ref={gridRef}
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5"
      >
        {DROPS.map((product) => (
          <div key={product.id} data-drop-card className="h-full">
            <DropCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
