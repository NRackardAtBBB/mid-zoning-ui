import React from 'react';

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial 
        color="#1e293b" 
        roughness={0.8}
        metalness={0.1}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}


export default GroundPlane;