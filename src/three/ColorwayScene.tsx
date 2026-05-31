import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { StylizedSneaker } from './SneakerModel'
import { StudioLights } from './StudioLights'

interface ColorwaySceneProps {
  upperColor: string
  accentColor: string
}

function Scene({ upperColor, accentColor }: ColorwaySceneProps) {
  return (
    <>
      <StudioLights accent={accentColor} />
      <StylizedSneaker upperColor={upperColor} accentColor={accentColor} autoRotate />
      <ContactShadows
        position={[0, -0.72, 0]}
        opacity={0.5}
        scale={8}
        blur={2}
        far={4}
        frames={30}
      />
    </>
  )
}

export function ColorwayScene({ upperColor, accentColor }: ColorwaySceneProps) {
  return (
    <div className="h-full w-full" data-cursor="drag">
      <Canvas
        shadows
        dpr={[1, 1.25]}
        camera={{ fov: 42, near: 0.1, far: 100, position: [0, 0.3, 4] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Scene upperColor={upperColor} accentColor={accentColor} />
        </Suspense>
      </Canvas>
    </div>
  )
}
