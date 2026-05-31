import { useEffect, useRef, type MouseEvent } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RevealImage } from '../components/RevealImage'
import { DROPS } from '../data/mock'

gsap.registerPlugin(ScrollTrigger)

function TiltCard({
  product,
  featured = false,
}: {
  product: (typeof DROPS)[0]
  featured?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    gsap.to(card, {
      rotateY: x * 12,
      rotateX: -y * 12,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 800,
    })
  }

  const handleLeave = () => {
    const card = cardRef.current
    if (!card) return
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.7,
      ease: 'power3.out',
    })
    if (infoRef.current) {
      gsap.to(infoRef.current, {
        y: 20,
        opacity: 0.7,
        duration: 0.4,
        ease: 'power2.in',
      })
    }
  }

  const handleEnter = () => {
    if (infoRef.current) {
      gsap.to(infoRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
      })
    }
  }

  return (
    <div
      ref={cardRef}
      className="group relative cursor-none overflow-hidden bg-fg/5"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={handleEnter}
      data-cursor="view"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        className={`relative overflow-hidden bg-[#141414] ${featured ? 'aspect-[16/10] sm:aspect-[2/1]' : 'aspect-[3/4]'}`}
      >
        <RevealImage
          src={product.image}
          alt={product.name}
          wrapClassName="absolute inset-0"
          imgClassName="object-contain p-5 transition-transform duration-700 group-hover:scale-[1.03] md:p-6"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-bg/20" />
        <span className="absolute left-4 top-4 z-10 bg-accent px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-widest text-bg">
          {product.tag}
        </span>
      </div>
      <div
        ref={infoRef}
        className="flex items-end justify-between p-5 opacity-70"
        style={{ transform: 'translateY(10px)' }}
      >
        <div>
          <h3 className="font-display text-xl uppercase text-fg">{product.name}</h3>
          <p className="mt-1 text-xs uppercase tracking-widest text-muted">
            Drop Collection
          </p>
        </div>
        <span className="font-display text-2xl text-accent">
          ${product.price.toLocaleString()}
        </span>
      </div>
    </div>
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

    gsap.set(cards, { y: 80, opacity: 0 })

    ScrollTrigger.create({
      trigger: grid,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
        })
      },
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative px-6 py-24 md:px-12 md:py-32 lg:px-16"
      aria-label="Featured drops"
    >
      <div className="pointer-events-none absolute right-8 top-16 font-display text-[clamp(5rem,15vw,12rem)] leading-none text-fg/[0.03]">
        04
      </div>

      <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-muted">
            Featured Drops
          </span>
          <h2 className="mt-4 font-display text-[clamp(2.5rem,7vw,5rem)] uppercase leading-[0.9]">
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

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {DROPS.map((product, i) => (
          <div
            key={product.id}
            data-drop-card
            className={i === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}
          >
            <TiltCard product={product} featured={i === 0} />
          </div>
        ))}
      </div>
    </section>
  )
}
