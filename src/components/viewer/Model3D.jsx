import React from 'react';
import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import * as THREE from 'three';

function Model3D({ url }) {
  const { scene } = useGLTF(url);
  console.log('Loaded glTF scene for URL', url, scene);
  
  // Auto-center and scale the model so small geometry is visible
  useEffect(() => {
    if (!scene) return;
    
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const min = box.min;
    scene.position.set(-center.x, -min.y, -center.z);
    
    // Apply white toon material to every mesh
    scene.traverse(child => {
      if (child.isMesh) {
        child.material = new THREE.MeshToonMaterial({ color: '#ffffff' });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);
  
  return <primitive object={scene} />;
}


export default Model3D;