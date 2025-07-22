function Header({ currentPage, setCurrentPage, selectedProject }) {
  return (
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
      
      {/* Navigation */}
      <nav style={{ display: 'flex', gap: '24px' }}>
        {[
          { id: 'home', label: 'Map View', icon: '🗺️' },
          { id: 'viewer', label: '3D Viewer', icon: '📐' },
          { id: 'projects', label: 'Projects', icon: '📋' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            style={{
              background: currentPage === item.id ? '#3b82f6' : 'transparent',
              color: currentPage === item.id ? 'white' : '#94a3b8',
              border: currentPage === item.id ? 'none' : '1px solid #475569',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== item.id) {
                e.target.style.backgroundColor = '#374151';
                e.target.style.color = '#e2e8f0';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== item.id) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#94a3b8';
              }
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Header;