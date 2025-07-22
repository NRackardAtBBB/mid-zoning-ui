function ProjectTooltip({ project, position }) {
  if (!project) return null;

  return (
    <div style={{
      position: 'fixed',
      left: position.x + 15,
      top: position.y - 60,
      backgroundColor: '#1e293b',
      border: '2px solid #3b82f6',
      borderRadius: '8px',
      padding: '12px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
      zIndex: 1000,
      pointerEvents: 'none',
      minWidth: '200px'
    }}>
      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '4px' }}>
        {project.name}
      </div>
      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
        {project.district}
      </div>
      <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>
        Block: {project.block}, Lot: {project.lot}
      </div>
      <div style={{ 
        fontSize: '11px', 
        color: '#3b82f6',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <span>📐</span>
        Click to view 3D model
      </div>
      
      {/* Tooltip Arrow */}
      <div style={{
        position: 'absolute',
        bottom: '-6px',
        left: '20px',
        width: 0,
        height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: '6px solid #3b82f6'
      }}></div>
    </div>
  );
}

export default ProjectTooltip;