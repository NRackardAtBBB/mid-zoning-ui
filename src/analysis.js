// analysis.js
const { NodeIO } = require('@gltf-transform/core');
const { vec3 } = require('gl-matrix');

async function analyzeGLB(filePath) {
  const io = new NodeIO();
  const doc = io.read(filePath);

  let vertexCount = 0;
  const bbox = { min: [Infinity,Infinity,Infinity], max: [-Infinity,-Infinity,-Infinity] };

  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION');
      if (!pos) continue;
      const arr = pos.getArray();
      vertexCount += arr.length / 3;
      for (let i = 0; i < arr.length; i += 3) {
        bbox.min[0] = Math.min(bbox.min[0], arr[i]);
        bbox.min[1] = Math.min(bbox.min[1], arr[i+1]);
        bbox.min[2] = Math.min(bbox.min[2], arr[i+2]);
        bbox.max[0] = Math.max(bbox.max[0], arr[i]);
        bbox.max[1] = Math.max(bbox.max[1], arr[i+1]);
        bbox.max[2] = Math.max(bbox.max[2], arr[i+2]);
      }
    }
  }

  return { vertexCount, boundingBox: bbox };
}

module.exports = { analyzeGLB };