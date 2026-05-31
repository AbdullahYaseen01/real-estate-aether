import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { StudioLights } from './StudioLights'
import { HeroShoeGroup } from './HeroEffects'

const ACCENT = '#ceff00'

type MouseTiltRef = React.RefObject<{ x: number; y: number }>

function useIsMobile() {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return mobile
}

function LoadedShoe({
  path,
  mouseTiltRef,
}: {
  path: string
  mouseTiltRef: MouseTiltRef
}) {
  const { scene } = useGLTF(path)
  const groupRef = useRef<THREE.Group>(null)
  const cloned = useRef<THREE.Group | null>(null)

  if (!cloned.current) {
    cloned.current = scene.clone(true)
    cloned.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }

  useFrame((_, delta) => {
    const group = groupRef.current
    const tilt = mouseTiltRef.current
    if (!group || !tilt) return

    group.rotation.y += delta * 0.2
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, tilt.y * 0.12, 0.08)
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, -tilt.x * 0.08, 0.08)
  })

  return (
    <group ref={groupRef} scale={1.8} rotation={[0, -0.4, 0]}>
      <primitive object={cloned.current} />
    </group>
  )
}

function ShoeWithFallback({
  mouseTiltRef,
  modelPath,
}: {
  mouseTiltRef: MouseTiltRef
  modelPath: string | null
}) {
  if (modelPath) {
    return (
      <Suspense fallback={<HeroShoeGroup mouseTiltRef={mouseTiltRef} />}>
        <LoadedShoe path={modelPath} mouseTiltRef={mouseTiltRef} />
      </Suspense>
    )
  }

  return <HeroShoeGroup mouseTiltRef={mouseTiltRef} />
}

function CameraParallax({ mouseTiltRef }: { mouseTiltRef: MouseTiltRef }) {
  const { camera } = useThree()

  useFrame(() => {
    const tilt = mouseTiltRef.current
    if (!tilt) return
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tilt.x * 0.12, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.35 + tilt.y * 0.08, 0.05)
    camera.lookAt(0, 0, 0)
  })

  return null
}

function SceneContent({
  mouseTiltRef,
  modelPath,
  enableOrbit,
}: {
  mouseTiltRef: MouseTiltRef
  modelPath: string | null
  enableOrbit: boolean
}) {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0.35, 3.4)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return (
    <>
      <StudioLights accent={ACCENT} />
      <CameraParallax mouseTiltRef={mouseTiltRef} />
      <ShoeWithFallback mouseTiltRef={mouseTiltRef} modelPath={modelPath} />
      <ContactShadows
        position={[0, -0.85, 0]}
        opacity={0.65}
        scale={12}
        blur={2.8}
        far={4}
      />
      {enableOrbit && (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.6}
          dampingFactor={0.08}
          enableDamping
        />
      )}
    </>
  )
}

interface HeroSceneProps {
  modelPath?: string | null
}

export function HeroScene({ modelPath = null }: HeroSceneProps) {
  const mouseTiltRef = useRef({ x: 0, y: 0 })
  const isMobile = useIsMobile()

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseTiltRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseTiltRef.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="absolute inset-0 z-10" data-cursor="drag">
      {/* CSS glow behind canvas */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
        style={{
          background:
            'radial-gradient(circle, rgba(206,255,0,0.12) 0%, rgba(206,255,0,0.04) 40%, transparent 70%)',
        }}
      />
      <Canvas
        shadows
        dpr={[1, 1.25]}
        camera={{ fov: 38, near: 0.1, far: 100, position: [0, 0.35, 3.4] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <SceneContent
            mouseTiltRef={mouseTiltRef}
            modelPath={modelPath}
            enableOrbit={!isMobile}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export function preloadShoeModel(path: string) {
  useGLTF.preload(path)
}
