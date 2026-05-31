import { lazy, Suspense, useCallback, useState, useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomCursor } from './components/CustomCursor'
import { SmoothScrollProvider } from './providers/SmoothScrollProvider'
import { Preloader } from './sections/Preloader'
import { Hero } from './sections/Hero'
import { KineticMarquee } from './sections/KineticMarquee'

const ColorwaySwitcher = lazy(() =>
  import('./sections/ColorwaySwitcher').then((m) => ({ default: m.ColorwaySwitcher })),
)
const ExplodedView = lazy(() =>
  import('./sections/ExplodedView').then((m) => ({ default: m.ExplodedView })),
)
const FeaturedDrops = lazy(() =>
  import('./sections/FeaturedDrops').then((m) => ({ default: m.FeaturedDrops })),
)
const StatsSection = lazy(() =>
  import('./sections/StatsSection').then((m) => ({ default: m.StatsSection })),
)
const Testimonials = lazy(() =>
  import('./sections/Testimonials').then((m) => ({ default: m.Testimonials })),
)
const CTASection = lazy(() =>
  import('./sections/CTASection').then((m) => ({ default: m.CTASection })),
)
const Footer = lazy(() =>
  import('./sections/Footer').then((m) => ({ default: m.Footer })),
)

function SectionFallback() {
  return <div className="min-h-[40vh]" aria-hidden />
}

function App() {
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)

  const handlePreloaderComplete = useCallback(() => {
    setLoading(false)
    requestAnimationFrame(() => {
      setReady(true)
      ScrollTrigger.refresh()
    })
  }, [])

  useEffect(() => {
    if (ready) {
      const t = setTimeout(() => ScrollTrigger.refresh(), 500)
      return () => clearTimeout(t)
    }
  }, [ready])

  return (
    <SmoothScrollProvider enabled={!loading}>
      <div className="grain" aria-hidden />
      <CustomCursor />

      {loading && <Preloader onComplete={handlePreloaderComplete} />}

      <main>
        <Hero ready={ready} />
        <KineticMarquee />
        <Suspense fallback={<SectionFallback />}>
          <ColorwaySwitcher />
          <ExplodedView />
          <FeaturedDrops />
          <StatsSection />
          <Testimonials />
          <CTASection />
          <Footer />
        </Suspense>
      </main>
    </SmoothScrollProvider>
  )
}

export default App
