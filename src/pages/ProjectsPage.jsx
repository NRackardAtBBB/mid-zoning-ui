function ProjectsPage({ setCurrentPage, setSelectedProject }) {
  const sampleProjects = [
    { id: 1, name: "Sample Project A", district: "Manhattan", block: "1234", lot: "56" },
    { id: 2, name: "Sample Project B", district: "Manhattan", block: "5678", lot: "90" },
  ];

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '24px',
      padding: '40px'
    }}>
      <div style={{
        padding: '40px',
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        border: '2px solid #334155',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>📋</div>
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          color: '#e2e8f0'
        }}>
          Project Management
        </h2>
        <p style={{ 
          fontSize: '16px', 
          color: '#94a3b8',
          marginBottom: '24px'
        }}>
          Manage project metadata, iterations, and settings.
        </p>
        
        {/* Sample project list */}
        <div style={{ textAlign: 'left', marginBottom: '24px' }}>
          {sampleProjects.map(project => (
            <div key={project.id} style={{
              padding: '16px',
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              border: '1px solid #334155',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#e2e8f0' }}>
                  {project.name}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Block: {project.block}, Lot: {project.lot}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    setSelectedProject(project);
                    setCurrentPage('viewer');
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  View 3D
                </button>
                <button
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#475569',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ 
          fontSize: '14px', 
          color: '#64748b',
          fontStyle: 'italic'
        }}>
          🚧 Full project management components coming next...
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;