import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
// Postprocessing for toon outline
import { EffectComposer, Outline } from '@react-three/postprocessing';
import { MeshToonMaterial } from 'three';


function Model({ url }) {
  const { scene } = useGLTF(url);
  console.log('Loaded glTF scene for URL', url, scene);
  // Auto-center the model so small geometry is visible
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const min = box.min;
    scene.position.set(-center.x, -min.y, -center.z);
    // Apply white toon material to every mesh
    scene.traverse(child => {
      if (child.isMesh) {
        child.material = new MeshToonMaterial({ color: '#ffffff' });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);
  return <primitive object={scene} />;
}

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

function GridHelper() {
  return (
    <gridHelper 
      args={[20, 20, '#475569', '#334155']} 
      position={[0, 0, 0]}
    />
  );
}

export default function App() {
  const [sessionId, setSessionId] = useState('');
  const [status, setStatus] = useState(null);
  const [results, setResults] = useState(null);

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [iterations, setIterations] = useState([]);
  const [selectedIterationId, setSelectedIterationId] = useState('');
  const [iterationId, setIterationId] = useState('');

  // New project form state
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDistrict, setNewProjectDistrict] = useState('');
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false);


  console.log('projects:', projects);
  console.log('selectedProjectId:', selectedProjectId);
  console.log('iterations:', iterations);
  console.log('selectedIterationId:', selectedIterationId);
  console.log('sessionId:', sessionId);
  console.log('iterationId:', iterationId);

  // Create project handler
  const handleAddProject = async () => {
    const payload = {
      name: newProjectName,
      district: newProjectDistrict,
      metadata: {}
    };
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const project = await res.json();
      setProjects(prev => [...prev, project]);
      setNewProjectName('');
      setNewProjectDistrict('');
    } else {
      console.error('Failed to add project');
    }
  };

  // Delete project handler
  const handleDeleteProject = async (projectId) => {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
      // Clear selection if deleted project was selected
      if (selectedProjectId === projectId) {
        setSelectedProjectId('');
        setSelectedIterationId('');
        setIterations([]);
      }
    } else {
      console.error('Failed to delete project');
    }
  };

  useEffect(() => {
    if (!iterationId) return;
    setStatus('pending');
    setResults(null);
    const interval = setInterval(async () => {
      const res = await fetch(`/api/iterations/${iterationId}/results`);
      if (!res.ok) {
        clearInterval(interval);
        setStatus('error');
        return;
      }
      const json = await res.json();
      setStatus(json.status);
      if (json.status === 'complete') {
        setResults(json.results);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [iterationId]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data));
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    fetch(`/api/projects/${selectedProjectId}/iterations`)
      .then(res => res.json())
      .then(data => setIterations(data));
  }, [selectedProjectId]);

  const handleStartAnalysis = () => {
    if (selectedIterationId) {
      const iter = iterations.find(it => it.session_id === selectedIterationId);
      if (iter) {
        setSessionId(iter.session_id);
        setIterationId(iter.id);
      }
    }
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#0f172a',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden'
    }}>
      
      {/* Header Bar */}
      <div style={{ 
        padding: '20px 40px',
        borderBottom: '2px solid #1e293b',
        backgroundColor: '#1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#3b82f6',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid white',
              borderRadius: '4px',
              transform: 'rotate(45deg)'
            }}></div>
          </div>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold',
            margin: '0',
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            3D GEOMETRY ANALYZER
          </h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ 
            fontSize: '14px', 
            color: '#64748b',
            fontWeight: '500'
          }}>
            STATUS:
          </span>
          <div style={{
            padding: '8px 16px',
            borderRadius: '20px',
            backgroundColor: status === 'complete' ? '#059669' : 
                           status === 'pending' ? '#d97706' : 
                           status === 'error' ? '#dc2626' : '#475569',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {status === 'complete' ? 'COMPLETE' : 
             status === 'pending' ? 'ANALYZING' : 
             status === 'error' ? 'ERROR' : 'READY'}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex',
        overflow: 'hidden'
      }}>
        
        {/* Left Panel - Controls */}
        <div style={{ 
          width: '400px',
          backgroundColor: '#1e293b',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          borderRight: '2px solid #334155'
        }}>
          
          <div>
            {/* Project/Iteration Selection */}
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold',
              marginBottom: '24px',
              color: '#e2e8f0'
            }}>
              Session Control
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <label style={{ 
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  flex: 1
                }}>
                  Project
                </label>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsProjectManagerOpen(true)}
                    style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: '#374151',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#475569';
                      e.target.style.color = '#e2e8f0';
                      e.target.nextElementSibling.style.opacity = '1';
                      e.target.nextElementSibling.style.visibility = 'visible';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#374151';
                      e.target.style.color = '#94a3b8';
                      e.target.nextElementSibling.style.opacity = '0';
                      e.target.nextElementSibling.style.visibility = 'hidden';
                    }}
                    title="Manage Projects"
                  >
                    ⚙️
                  </button>
                  {/* Tooltip */}
                  <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: '8px',
                    padding: '6px 10px',
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#e2e8f0',
                    whiteSpace: 'nowrap',
                    opacity: 0,
                    visibility: 'hidden',
                    transition: 'all 0.2s ease',
                    pointerEvents: 'none',
                    zIndex: 10
                  }}>
                    Manage Projects
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '4px solid transparent',
                      borderRight: '4px solid transparent',
                      borderTop: '4px solid #1e293b'
                    }}></div>
                  </div>
                </div>
              </div>
              <select
                value={selectedProjectId}
                onChange={e => { setSelectedProjectId(e.target.value); setSelectedIterationId(''); }}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#0f172a',
                  border: '2px solid #334155',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select a project...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            {selectedProjectId && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Iteration
                </label>
                <select
                  value={selectedIterationId}
                  onChange={e => setSelectedIterationId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: '#0f172a',
                    border: '2px solid #334155',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select an iteration...</option>
                  {iterations.map(it => (
                    <option key={it.id} value={it.session_id}>
                      {new Date(it.created_at).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button
              onClick={handleStartAnalysis}
              disabled={!selectedIterationId || status === 'pending'}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: (!selectedIterationId || status === 'pending') ? '#475569' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: (!selectedIterationId || status === 'pending') ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                if (!(!selectedIterationId || status === 'pending')) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (!(!selectedIterationId || status === 'pending')) {
                  e.target.style.backgroundColor = '#3b82f6';
                }
              }}
            >
              {status === 'pending' ? 'ANALYZING...' : 'START ANALYSIS'}
            </button>
          </div>

          {sessionId && (
            <div style={{
              padding: '20px',
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              border: '1px solid #334155'
            }}>
              <div style={{ 
                fontSize: '12px', 
                color: '#64748b',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Active Session
              </div>
              <div style={{ 
                fontFamily: 'monospace',
                fontSize: '14px',
                color: '#3b82f6',
                fontWeight: 'bold'
              }}>
                {sessionId}
              </div>
            </div>
          )}

          {status === 'pending' && (
            <div style={{
              padding: '20px',
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              border: '2px solid #d97706',
              textAlign: 'center'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #d97706',
                borderTop: '3px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }}></div>
              <div style={{ 
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#d97706'
              }}>
                PROCESSING
              </div>
            </div>
          )}

          {status === 'error' && (
            <div style={{
              padding: '20px',
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              border: '2px solid #dc2626',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#dc2626',
                marginBottom: '8px'
              }}>
                ANALYSIS FAILED
              </div>
              <div style={{ 
                fontSize: '14px',
                color: '#94a3b8'
              }}>
                Please check your session ID and try again
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - 3D Viewer */}
        <div style={{ 
          flex: 1,
          backgroundColor: '#0f172a',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          
          {!sessionId || status !== 'complete' ? (
            <div style={{
              textAlign: 'center',
              color: '#64748b'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                border: '2px solid #334155',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '32px'
              }}>
                📐
              </div>
              <div style={{ 
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                3D Viewer Ready
              </div>
              <div style={{ fontSize: '16px' }}>
                Select a project and iteration to begin analysis
              </div>
            </div>
          ) : (
            <Canvas 
              style={{ 
                width: '100%', 
                height: '100%',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
              }}
              camera={{ position: [8, 6, 8], fov: 50 }}
              shadows
            >
              {/* Enhanced Lighting Setup */}
              <ambientLight intensity={0.6} color="#ffffff" />
              
              {/* Main directional light with shadows */}
              <directionalLight 
                position={[10, 15, 10]} 
                intensity={1.2} 
                color="#ffffff"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={50}
                shadow-camera-left={-15}
                shadow-camera-right={15}
                shadow-camera-top={15}
                shadow-camera-bottom={-15}
              />
              
              {/* Fill lights for better illumination */}
              <directionalLight position={[-8, 10, -8]} intensity={0.4} color="#64b5f6" />
              <directionalLight position={[5, -5, 5]} intensity={0.3} color="#81c784" />
              
              {/* Rim lighting */}
              <pointLight position={[0, 10, -10]} intensity={0.8} color="#3b82f6" />
              <pointLight position={[-10, 5, 0]} intensity={0.6} color="#8b5cf6" />
              
              {/* Environment lighting */}
              <hemisphereLight 
                skyColor="#87ceeb" 
                groundColor="#1e293b" 
                intensity={0.3} 
              />
              
              {/* Ground plane and grid */}
              <axesHelper args={[5]} />
              <GroundPlane />
              <GridHelper />

              {/* Black toon-outline effect */}
              <EffectComposer>
                <Outline
                  edgeStrength={100}
                  visibleEdgeColor="black"
                  hiddenEdgeColor="black"
                />
              </EffectComposer>
              
              <Suspense fallback={
                <Html center>
                  <div style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '2px solid #3b82f6',
                    textAlign: 'center',
                    color: 'white'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      border: '3px solid #3b82f6',
                      borderTop: '3px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto 12px'
                    }}></div>
                    <div style={{ fontWeight: 'bold' }}>Loading Model...</div>
                  </div>
                </Html>
              }>
                <group castShadow receiveShadow>
                  <Model url={`/api/iterations/${sessionId}/model`} />
                </group>
              </Suspense>
              
              
              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={3}
                maxDistance={30}
                maxPolarAngle={Math.PI * 0.8}
                dampingFactor={0.05}
                rotateSpeed={0.8}
                zoomSpeed={1.2}
                panSpeed={0.8}
                autoRotate={false}
                target={[0, 0, 0]}
              />
            </Canvas>
          )}
        </div>
      </div>

      {/* Project Manager Modal */}
      {isProjectManagerOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '16px',
            border: '2px solid #334155',
            width: '90%',
            maxWidth: '700px',
            maxHeight: '80vh',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '24px',
              borderBottom: '2px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0',
                color: '#e2e8f0'
              }}>
                Project Manager
              </h2>
              <button
                onClick={() => setIsProjectManagerOpen(false)}
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div style={{
              padding: '24px',
              maxHeight: '60vh',
              overflow: 'auto'
            }}>
              {/* Add New Project Form */}
              <div style={{
                backgroundColor: '#0f172a',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #334155',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 16px 0',
                  color: '#e2e8f0'
                }}>
                  Add New Project
                </h3>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={e => setNewProjectName(e.target.value)}
                    placeholder="Project name"
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#475569'}
                  />
                  <input
                    type="text"
                    value={newProjectDistrict}
                    onChange={e => setNewProjectDistrict(e.target.value)}
                    placeholder="District"
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#475569'}
                  />
                  <button
                    onClick={handleAddProject}
                    disabled={!newProjectName.trim() || !newProjectDistrict.trim()}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: (!newProjectName.trim() || !newProjectDistrict.trim()) ? '#374151' : '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: (!newProjectName.trim() || !newProjectDistrict.trim()) ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: (!newProjectName.trim() || !newProjectDistrict.trim()) ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (newProjectName.trim() && newProjectDistrict.trim()) {
                        e.target.style.backgroundColor = '#059669';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (newProjectName.trim() && newProjectDistrict.trim()) {
                        e.target.style.backgroundColor = '#10b981';
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Projects Table */}
              <div style={{
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                border: '1px solid #334155',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: '#1e293b',
                  borderBottom: '1px solid #334155'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: '0',
                    color: '#e2e8f0'
                  }}>
                    Existing Projects ({projects.length})
                  </h3>
                </div>

                {projects.length === 0 ? (
                  <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#64748b'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                      No projects yet
                    </div>
                    <div style={{ fontSize: '14px' }}>
                      Add your first project using the form above
                    </div>
                  </div>
                ) : (
                  <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                    {/* Table Header */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr auto',
                      gap: '16px',
                      padding: '12px 20px',
                      backgroundColor: '#1e293b',
                      borderBottom: '1px solid #334155',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      <div>Project Name</div>
                      <div>District</div>
                      <div>Actions</div>
                    </div>

                    {/* Table Rows */}
                    {projects.map((project, index) => (
                      <div 
                        key={project.id}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr auto',
                          gap: '16px',
                          padding: '16px 20px',
                          borderBottom: index < projects.length - 1 ? '1px solid #334155' : 'none',
                          backgroundColor: selectedProjectId === project.id ? '#1e293b' : 'transparent',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedProjectId !== project.id) {
                            e.target.style.backgroundColor = '#1e293b';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedProjectId !== project.id) {
                            e.target.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <div style={{
                          color: '#e2e8f0',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          {project.name}
                          {selectedProjectId === project.id && (
                            <span style={{
                              marginLeft: '8px',
                              fontSize: '12px',
                              color: '#10b981',
                              fontWeight: '600'
                            }}>
                              (Selected)
                            </span>
                          )}
                        </div>
                        <div style={{
                          color: '#94a3b8',
                          fontSize: '14px'
                        }}>
                          {project.district}
                        </div>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
}