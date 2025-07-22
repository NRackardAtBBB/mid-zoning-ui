import React from 'react';

function ViewerControls({ 
  projects, 
  selectedProjectId, 
  setSelectedProjectId,
  iterations,
  selectedIterationId,
  setSelectedIterationId,
  status,
  sessionId,
  onStartAnalysis,
  onOpenProjectManager
}) {
  return (
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
                onClick={onOpenProjectManager}
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
                title="Manage Projects"
              >
                ⚙️
              </button>
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
          onClick={onStartAnalysis}
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
  );
}

export default ViewerControls;