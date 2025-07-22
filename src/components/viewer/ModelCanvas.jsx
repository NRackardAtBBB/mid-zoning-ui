import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import GridHelper from './GridHelper';
import GroundPlane from './GroundPlane';
import Model3D from './Model3D';

function ModelCanvas({ projectId, sessionId, status }) {
  const [lotLines, setLotLines] = useState([]);

  // reload lot‐lines any time you switch projects
  useEffect(() => {
    if (!projectId) {
      setLotLines([]);
      return;
    }
    fetch(`/api/projects/${projectId}/lot-lines`)
      .then(res => {
        if (!res.ok) throw new Error('Network error fetching lot-lines');
        return res.json();
      })
      .then(setLotLines)
      .catch(err => {
        console.error(err);
        setLotLines([]);
      });
  }, [projectId]);

  // show the “choose a project/iteration” placeholder until the model is ready
  if (!sessionId || status !== 'complete') {
    return (
      <div style={{
        flex: 1, backgroundColor: '#0f172a',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <div style={{
            width: '80px', height: '80px', border: '2px solid #334155',
            borderRadius: '12px', margin: '0 auto 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px'
          }}>📐</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: 8 }}>
            3D Viewer Ready
          </div>
          <div style={{ fontSize: '16px' }}>
            Select a project and iteration to begin analysis
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
          <style>{`
        @keyframes spin {
          from { transform: rotate(0deg) }
          to   { transform: rotate(360deg) }
        }
      `}</style>
    <Canvas 
      style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
      }}
      camera={{ position: [8, 6, 8], fov: 50 }}
      shadows
    >
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10,15,10]} intensity={1.2} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-far={50} shadow-camera-left={-15}
        shadow-camera-right={15} shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <directionalLight position={[-8,10,-8]} intensity={0.4} />
      <directionalLight position={[5,-5,5]} intensity={0.3} />
      <pointLight position={[0,10,-10]} intensity={0.8} />
      <pointLight position={[-10,5,0]} intensity={0.6} />
      <hemisphereLight skyColor="#87ceeb" groundColor="#1e293b" intensity={0.3} />

      {/* Ground & grid */}
      <GroundPlane />
      <GridHelper />

      {/* 3D model loader */}
      <Suspense fallback={
        <Html center>
          <div style={{
            background: 'rgba(15,23,42,0.9)',
            padding: 20, borderRadius: 12,
            border: '2px solid #3b82f6',
            color: 'white', textAlign: 'center'
          }}>
            <div style={{
              width: 32, height: 32,
              border: '3px solid #3b82f6',
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 12px'
            }} />
            <div style={{ fontWeight: 'bold' }}>Loading Model…</div>
          </div>
        </Html>
      }>
        <group castShadow receiveShadow>
          {/* <- note: we use the sessionId here, which matches your /api/iterations/:sessionId/model.glb route */}
          <Model3D url={`/api/iterations/${sessionId}/model`} />
        </group>
      </Suspense>

      {/* Lot‐lines overlay */}
      {lotLines.map(line => (
        <Line
          key={line.id}
          points={line.geometry}               // expects [[x,y,z], …] 
          color={line.is_street_frontage ? '#3b82f6' : '#e5e7eb'}
          lineWidth={2}
        />
      ))}

      {/* Debug cube */}
      <group position={[0,0,0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1,1,1]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.4} roughness={0.2} />
        </mesh>
        <mesh>
          <boxGeometry args={[1.01,1.01,1.01]} />
          <meshBasicMaterial color="#60a5fa" wireframe transparent opacity={0.3} />
        </mesh>
      </group>

      <OrbitControls 
        enablePan enableZoom enableRotate
        minDistance={3} maxDistance={30}
        maxPolarAngle={Math.PI * 0.8}
        dampingFactor={0.05} rotateSpeed={0.8}
        zoomSpeed={1.2} panSpeed={0.8}
        autoRotate={false} target={[0,0,0]}
      />

      {/* keyframes for spinner */}

    </Canvas>
    </>
  );
}

export default ModelCanvas;