import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

function Logo() {
  const meshRef = useRef()
  const [aspect, setAspect] = useState(1)
  const [visible, setVisible] = useState(false)

  const texture = new THREE.TextureLoader().load('/main_tz_logo.png', (tex) => {
    setAspect(tex.image.width / tex.image.height)
  })

  // Delay start
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 6000)
    return () => clearTimeout(timer)
  }, [])

  const initialZ = 5      // start close to camera
  const targetZ = 0       // move slightly backward into view
  const initialScale = 30 // huge start
  const targetScale = 3   // final logo size

  useFrame((state) => {
    if (!meshRef.current || !visible) return
    const t = state.clock.getElapsedTime()

    // Move logo away from viewer
    meshRef.current.position.z = THREE.MathUtils.lerp(
      meshRef.current.position.z,
      targetZ,
      0.02
    )

    // Scale down as it moves back
    meshRef.current.scale.x = THREE.MathUtils.lerp(
      meshRef.current.scale.x,
      targetScale,
      0.02
    )
    meshRef.current.scale.y = THREE.MathUtils.lerp(
      meshRef.current.scale.y,
      targetScale / aspect,
      0.02
    )

    // Slight rotation for style
    meshRef.current.rotation.y = Math.sin(t * 0.3) * 0.05
  })

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, initialZ]}
      scale={[initialScale, initialScale / aspect, 1]}
      visible={visible}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={1} />
    </mesh>
  )
}

export default function FlyingLogo() {
  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <ambientLight intensity={0.5} />
      <Logo />
    </Canvas>
  )
}
