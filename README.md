# VELOCITY — 3D Animated Sneaker Showcase

A premium, scroll-driven sneaker landing page built with React Three Fiber, GSAP, and Lenis smooth scrolling. Designed as a portfolio showcase piece.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

- **Vite + React + TypeScript**
- **Three.js** via `@react-three/fiber` + `@react-three/drei`
- **GSAP + ScrollTrigger** for scroll-driven animation
- **Framer Motion** for UI transitions
- **Lenis** (`@studio-freight/lenis`) for smooth scrolling
- **Tailwind CSS v4** for styling

## Sections

1. **Preloader** — Counter, silhouette, curtain reveal
2. **Hero** — Interactive 3D sneaker with orbit controls
3. **Kinetic Marquee** — Scroll-velocity-driven infinite scroll
4. **Colorway Switcher** — Pinned section with live 3D material swap
5. **Exploded View** — Scroll-driven part separation + spec counters
6. **Featured Drops** — 3D tilt cards with clip-reveal images
7. **Stats** — Animated counters with parallax numerals
8. **Testimonials** — Auto-advancing quote carousel + press logos
9. **CTA** — Masked headline + magnetic buttons
10. **Footer** — Reveal-on-scroll with oversized wordmark

## Product Imagery

Hero and product shots use high-resolution photography from [Unsplash](https://unsplash.com) (1600px, q=90). Image URLs are centralized in `src/data/mock.ts` under `IMAGES`.

## 3D Shoe Model (Optional)

By default, the site uses a **stylized procedural sneaker** built from Three.js primitives.

To use a real GLB model:

1. Place your `.glb` file at `public/models/shoe.glb`
2. In `src/sections/Hero.tsx`, change the `HeroScene` prop:

```tsx
<HeroScene modelPath="/models/shoe.glb" />
```

Recommended: a single mesh or grouped shoe model, ~50k triangles or fewer for best performance.

## Deploy to Vercel

Connect the repo to [Vercel](https://vercel.com) — no extra config needed; Vite builds out of the box.

## Design Tokens

| Token      | Value     |
|------------|-----------|
| Background | `#0D0D0D` |
| Foreground | `#F4F4F0` |
| Accent     | `#CEFF00` |

## Project Structure

```
src/
├── components/   CustomCursor, MagneticButton, AnimatedText, Counter, etc.
├── data/         Mock products, colorways, stats
├── hooks/        useSmoothScroll
├── providers/    SmoothScrollProvider
├── sections/     One file per page section
└── three/        R3F scenes and SneakerModel
```
