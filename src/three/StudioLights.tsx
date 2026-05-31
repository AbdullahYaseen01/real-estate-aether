/** Lightweight studio lighting — avoids heavy HDR Environment downloads */
export function StudioLights({ accent = '#ceff00' }: { accent?: string }) {
  return (
    <>
      <ambientLight intensity={0.45} />
      <hemisphereLight args={['#ffffff', '#222222', 0.5]} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} castShadow />
      <spotLight
        position={[-4, 2, -3]}
        angle={0.45}
        penumbra={1}
        intensity={1.6}
        color={accent}
      />
    </>
  )
}
