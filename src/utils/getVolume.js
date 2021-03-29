import * as THREE from 'three'

export const getVolume = geometry => {
  let position = geometry.attributes.position
  let faces = position.count / 3
  let sum = 0
  let p1 = new THREE.Vector3()
  let p2 = new THREE.Vector3()
  let p3 = new THREE.Vector3()

  for (let i = 0; i < faces; i++) {
    p1.fromBufferAttribute(position, i * 3 + 0)
    p2.fromBufferAttribute(position, i * 3 + 1)
    p3.fromBufferAttribute(position, i * 3 + 2)

    sum += signedVolumeOfTriangle(p1, p2, p3)
  }

  return parseFloat(sum).toFixed(2)
}

const signedVolumeOfTriangle = (p1, p2, p3) => {
  return p1.dot(p2.cross(p3)) / 6.0
}