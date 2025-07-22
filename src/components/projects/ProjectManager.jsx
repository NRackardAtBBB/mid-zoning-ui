function ProjectManager({ isOpen, onClose, projects, onAddProject, onDeleteProject, selectedProjectId, newProjectName, setNewProjectName, newProjectDistrict, setNewProjectDistrict }) {
  if (!isOpen) return null;

  const handleAddProject = async () => {
    await onAddProject();
  };

  return (
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
            onClick={onClose}
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
                  opacity: (!newProjectName.trim() || !newProjectDistrict.trim()) ? 0.6 : 1
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
                      backgroundColor: selectedProjectId === project.id ? '#1e293b' : 'transparent'
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
                      onClick={() => onDeleteProject(project.id)}
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
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
  );
}

export default ProjectManager;