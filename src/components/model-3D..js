import React, { useEffect, useRef } from "react"
import { useThree, extend, useFrame } from "react-three-fiber"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

extend({ OrbitControls })
const Controls = props => {
  const { gl, camera } = useThree()
  const ref = useRef()
  useFrame(() => ref.current.update())

  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />
}

const Camera = props => {
  const ref = useRef()
  const { setDefaultCamera } = useThree()

  // Make the camera known to the system
  useEffect(() => void setDefaultCamera(ref.current))
  // Update it every frame
  useFrame(() => ref.current.updateMatrixWorld())

  return (
    <group>
      <perspectiveCamera args={[35, 1, 0.1, 1000]} ref={ref} {...props} />
    </group>
  )
}

export const Model3D = ({ geometry }) => {
  return geometry ? (
    <mesh
      geometry={geometry}
      scale={[1, 1, 1]}
      rotation={[0, 0, 0]}
      castShadow
      position={[0, 0, 0]}
    >
      <meshLambertMaterial color={0x909090} attach="material" flatShading />
      <Camera
        position={[
          0,
          -Math.max(
            geometry.boundingBox.max.x * 4,
            geometry.boundingBox.max.y * 4,
            geometry.boundingBox.max.z * 4
          ),
          0,
        ]}
      />
      <ambientLight intensity={1} color={0x202020} position={[0, 1200, 100]} />
      <directionalLight
        args={[0xffffff, 0.75]}
        position={[
          geometry.boundingBox.min.x * 2,
          geometry.boundingBox.min.y * 2,
          geometry.boundingBox.min.z * 2,
        ]}
        castShadow
      />
      <directionalLight
        args={[0xffffff, 0.75]}
        position={[
          geometry.boundingBox.min.x * -2,
          geometry.boundingBox.min.y * -2,
          geometry.boundingBox.min.z * -2,
        ]}
        castShadow
      />
      <pointLight args={[0xffffff, 1]} position={[0, 1000, 2000]} />
      <Controls enabled enableDamping dampingFactor={0.1} />
    </mesh>
  ) : null
}
