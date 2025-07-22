import { useState, useEffect } from 'react';
import MapView from '../components/map/MapView';

function HomePage({ setCurrentPage, setSelectedProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock projects data - in real implementation this would fetch from your API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProjects([
        { 
          id: 1, 
          name: "Manhattan Office Complex", 
          district: "Manhattan", 
          block: "1234", 
          lot: "56",
          borough: "Manhattan",
          status: "active",
          iterations: 3
        },
        { 
          id: 2, 
          name: "Midtown Residential Tower", 
          district: "Manhattan", 
          block: "5678", 
          lot: "90",
          borough: "Manhattan", 
          status: "complete",
          iterations: 7
        },
        { 
          id: 3, 
          name: "Commercial Plaza", 
          district: "Manhattan", 
          block: "9012", 
          lot: "34",
          borough: "Manhattan",
          status: "planning",
          iterations: 2
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setCurrentPage('viewer');
  };

  const handleProjectHover = (project) => {
    // Could add additional hover effects here
    console.log('Hovering over project:', project.name);
  };

  const handleProjectLeave = () => {
    // Could add additional leave effects here
  };

  if (loading) {
    return (
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#0f172a'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #334155',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{ color: '#94a3b8', fontSize: '16px' }}>
            Loading map data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Map Header */}
      <div style={{
        padding: '20px 40px',
        backgroundColor: '#1e293b',
        borderBottom: '2px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            margin: '0 0 4px 0',
            color: '#e2e8f0'
          }}>
            Project Map
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#94a3b8',
            margin: '0'
          }}>
            {projects.length} active projects in Midtown Manhattan
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#0f172a',
            borderRadius: '6px',
            border: '1px solid #334155',
            fontSize: '12px',
            color: '#94a3b8'
          }}>
            🗺️ Mock Implementation
          </div>
          <button
            onClick={() => setCurrentPage('projects')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Manage Projects
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapView 
          projects={projects}
          onProjectClick={handleProjectClick}
          onProjectHover={handleProjectHover}
          onProjectLeave={handleProjectLeave}
        />
      </div>
    </div>
  );
}

export default HomePage;