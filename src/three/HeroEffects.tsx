import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import type { RefObject } from 'react'
import { StylizedSneaker } from './SneakerModel'

const ACCENT = '#ceff00'

type MouseTiltRef = RefObject<{ x: number; y: number }>

function OrbitRing({
  radius,
  speed,
  tilt,
  opacity,
}: {
  radius: number
  speed: number
  tilt: number
  opacity: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const mesh = ref.current
    if (!mesh) return
    mesh.rotation.y = clock.elapsedTime * speed
    mesh.rotation.x = tilt + Math.sin(clock.elapsedTime * 0.6) * 0.08
  })

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.012, 8, 128]} />
      <meshBasicMaterial color={ACCENT} transparent opacity={opacity} />
    </mesh>
  )
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null)
  const count = 48

  const positions = useRef(
    (() => {
      const arr = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2
        const r = 1.8 + Math.random() * 1.4
        const y = (Math.random() - 0.5) * 2.2
        arr[i * 3] = Math.cos(theta) * r
        arr[i * 3 + 1] = y
        arr[i * 3 + 2] = Math.sin(theta) * r
      }
      return arr
    })(),
  ).current

  useFrame(({ clock }) => {
    const pts = ref.current
    if (!pts) return
    pts.rotation.y = clock.elapsedTime * 0.08
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={ACCENT}
        size={0.025}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function Pedestal() {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const ring = ringRef.current
    if (!ring) return
    ring.rotation.z = clock.elapsedTime * 0.4
    const pulse = 0.35 + Math.sin(clock.elapsedTime * 1.5) * 0.15
    ;(ring.material as THREE.MeshBasicMaterial).opacity = pulse
  })

  return (
    <group position={[0, -0.85, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.6, 64]} />
        <meshBasicMaterial color="#1a1a1a" transparent opacity={0.6} />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.45, 1.55, 64]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function PulsingRimLight() {
  const ref = useRef<THREE.SpotLight>(null)

  useFrame(({ clock }) => {
    const light = ref.current
    if (!light) return
    light.intensity = 2 + Math.sin(clock.elapsedTime * 1.2) * 0.8
  })

  return (
    <spotLight
      ref={ref}
      position={[-4, 2, -3]}
      angle={0.4}
      penumbra={1}
      intensity={2.5}
      color={ACCENT}
    />
  )
}

interface HeroShoeProps {
  mouseTiltRef: MouseTiltRef
}

export function HeroShoeGroup({ mouseTiltRef }: HeroShoeProps) {
  return (
    <>
      <PulsingRimLight />
      <ParticleField />
      <OrbitRing radius={2.1} speed={0.35} tilt={0.55} opacity={0.45} />
      <OrbitRing radius={2.35} speed={-0.22} tilt={-0.35} opacity={0.25} />
      <Pedestal />
      <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.35}>
        <StylizedSneaker
          mouseTiltRef={mouseTiltRef}
          accentColor={ACCENT}
          scale={1.45}
        />
      </Float>
    </>
  )
}
