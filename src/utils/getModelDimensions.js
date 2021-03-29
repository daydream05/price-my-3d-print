export const getModelDimensions = geometry => {
  // needs geometry buffer object
  const bb = geometry.boundingBox
  const object3DWidth = bb.max.x - bb.min.x
  const object3DHeight = bb.max.y - bb.min.y
  const object3DDepth = bb.max.z - bb.min.z

  return {
    x: parseFloat(object3DDepth.toFixed(2)),
    y: parseFloat(object3DWidth.toFixed(2)),
    z: parseFloat(object3DHeight.toFixed(2)),
  }
}
