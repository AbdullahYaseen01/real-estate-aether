import { Suspense, type RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { StylizedSneaker } from './SneakerModel'
import { StudioLights } from './StudioLights'

interface ExplodedSceneProps {
  upperColor?: string
  accentColor?: string
  progressRef: RefObject<number>
}

function Scene({
  upperColor = '#f4f4f0',
  accentColor = '#ceff00',
  progressRef,
}: ExplodedSceneProps) {
  return (
    <>
      <StudioLights accent={accentColor} />
      <StylizedSneaker
        upperColor={upperColor}
        accentColor={accentColor}
        explodeProgressRef={progressRef}
        autoRotate={false}
      />
      <ContactShadows
        position={[0, -0.72, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
        frames={30}
      />
    </>
  )
}

export function ExplodedScene({
  upperColor = '#f4f4f0',
  accentColor = '#ceff00',
  progressRef,
}: ExplodedSceneProps) {
  return (
    <div className="h-full w-full">
      <Canvas
        shadows
        dpr={[1, 1.25]}
        camera={{ fov: 40, near: 0.1, far: 100, position: [0, 0.2, 5] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Scene
            upperColor={upperColor}
            accentColor={accentColor}
            progressRef={progressRef}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
