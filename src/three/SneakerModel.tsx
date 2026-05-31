import { useMemo, useRef, type ReactNode, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

export interface SneakerConfig {
  upperColor?: string
  accentColor?: string
  explodeProgress?: number
  explodeProgressRef?: RefObject<number>
  autoRotate?: boolean
  mouseTiltRef?: RefObject<{ x: number; y: number }>
  scale?: number
}

const EXPLODE_OFFSETS: Record<string, THREE.Vector3> = {
  outsole: new THREE.Vector3(0, -1.1, 0),
  midsole: new THREE.Vector3(0, -0.45, 0.35),
  heel: new THREE.Vector3(-0.75, 0.35, -0.25),
  upper: new THREE.Vector3(0.25, 0.45, 0.15),
  toe: new THREE.Vector3(0.95, 0.25, 0.25),
  tongue: new THREE.Vector3(0.15, 0.85, 0.35),
  swoosh: new THREE.Vector3(0.45, 0.05, 0.75),
  collar: new THREE.Vector3(-0.55, 0.75, 0.1),
  eyelets: new THREE.Vector3(0, 0.55, 0.55),
}

function useColorLerp(initial: string) {
  const colorRef = useRef(new THREE.Color(initial))
  const targetRef = useRef(new THREE.Color(initial))

  const setTarget = (hex: string) => {
    targetRef.current.set(hex)
  }

  const lerp = (speed = 0.08) => {
    colorRef.current.lerp(targetRef.current, speed)
    return colorRef.current
  }

  return { colorRef, setTarget, lerp }
}

function PartGroup({
  partId,
  position,
  explodeProgress,
  explodeProgressRef,
  children,
}: {
  partId: string
  position: [number, number, number]
  explodeProgress: number
  explodeProgressRef?: RefObject<number>
  children: ReactNode
}) {
  const ref = useRef<THREE.Group>(null)
  const base = useMemo(() => new THREE.Vector3(...position), position)
  const offset = EXPLODE_OFFSETS[partId] ?? new THREE.Vector3()

  useFrame(() => {
    const group = ref.current
    if (!group) return
    const progress = explodeProgressRef?.current ?? explodeProgress
    group.position.set(
      base.x + offset.x * progress,
      base.y + offset.y * progress,
      base.z + offset.z * progress,
    )
  })

  return <group ref={ref}>{children}</group>
}

export function StylizedSneaker({
  upperColor = '#f4f4f0',
  accentColor = '#ceff00',
  explodeProgress = 0,
  explodeProgressRef,
  autoRotate = true,
  mouseTiltRef,
  scale = 1,
}: SneakerConfig) {
  const groupRef = useRef<THREE.Group>(null)
  const upper = useColorLerp(upperColor)
  const accent = useColorLerp(accentColor)

  upper.setTarget(upperColor)
  accent.setTarget(accentColor)

  const soleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        roughness: 0.85,
        metalness: 0.1,
      }),
    [],
  )

  const midsoleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e8e8e0',
        roughness: 0.4,
        metalness: 0.05,
      }),
    [],
  )

  const upperMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: upperColor,
        roughness: 0.55,
        metalness: 0.05,
      }),
    [],
  )

  const accentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: accentColor,
        roughness: 0.35,
        metalness: 0.2,
        emissive: accentColor,
        emissiveIntensity: 0.22,
      }),
    [],
  )

  const partProps = { explodeProgress, explodeProgressRef }

  useFrame((_, delta) => {
    const group = groupRef.current
    const tilt = mouseTiltRef?.current
    if (!group) return

    if (autoRotate) {
      group.rotation.y += delta * 0.25
    }

    if (tilt) {
      group.rotation.x = THREE.MathUtils.lerp(
        group.rotation.x,
        tilt.y * 0.15,
        0.08,
      )
      group.rotation.z = THREE.MathUtils.lerp(
        group.rotation.z,
        -tilt.x * 0.1,
        0.08,
      )
    }

    const uc = upper.lerp()
    const ac = accent.lerp()
    upperMaterial.color.copy(uc)
    accentMaterial.color.copy(ac)
    accentMaterial.emissive.copy(ac)
  })

  return (
    <group ref={groupRef} rotation={[0.15, -0.6, 0]} scale={scale}>
      <PartGroup partId="outsole" position={[0, -0.55, 0.05]} {...partProps}>
        <RoundedBox args={[2.4, 0.22, 1.05]} radius={0.06} material={soleMaterial} />
      </PartGroup>

      <PartGroup partId="midsole" position={[0, -0.35, 0.02]} {...partProps}>
        <RoundedBox args={[2.2, 0.28, 0.95]} radius={0.05} material={midsoleMaterial} />
      </PartGroup>

      <PartGroup partId="heel" position={[-0.75, 0.05, 0]} {...partProps}>
        <RoundedBox args={[0.7, 0.75, 0.85]} radius={0.08} material={upperMaterial} />
      </PartGroup>

      <PartGroup partId="upper" position={[0.15, 0.02, 0]} {...partProps}>
        <RoundedBox args={[1.5, 0.65, 0.9]} radius={0.1} material={upperMaterial} />
      </PartGroup>

      <PartGroup partId="toe" position={[0.95, -0.05, 0.02]} {...partProps}>
        <RoundedBox args={[0.85, 0.45, 0.82]} radius={0.12} material={upperMaterial} />
      </PartGroup>

      <PartGroup partId="tongue" position={[0.35, 0.35, 0.05]} {...partProps}>
        <RoundedBox args={[0.35, 0.55, 0.55]} radius={0.06} rotation={[0.25, 0, 0]}>
          <meshStandardMaterial color="#d8d8d0" roughness={0.6} />
        </RoundedBox>
      </PartGroup>

      <PartGroup partId="swoosh" position={[0.1, -0.05, 0.48]} {...partProps}>
        <mesh rotation={[0, 0, -0.15]}>
          <boxGeometry args={[1.1, 0.12, 0.04]} />
          <primitive object={accentMaterial} attach="material" />
        </mesh>
      </PartGroup>

      <PartGroup partId="eyelets" position={[0, 0.28, 0.42]} {...partProps}>
        {[-0.15, 0.15, 0.45].map((x) => (
          <mesh key={x} position={[x, 0, 0]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup partId="collar" position={[-0.55, 0.42, 0]} {...partProps}>
        <RoundedBox args={[0.55, 0.2, 0.7]} radius={0.05} material={upperMaterial} />
      </PartGroup>
    </group>
  )
}
