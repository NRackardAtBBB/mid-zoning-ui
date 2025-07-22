import { useState, useEffect } from "react";
import ViewerControls from '../components/viewer/ViewerControls'
import ModelCanvas from '../components/viewer/ModelCanvas';
import ProjectManager from '../components/projects/ProjectManager';

function ViewerPage({ selectedProject }) {
  const [sessionId, setSessionId] = useState('');
  const [status, setStatus] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [iterations, setIterations] = useState([]);
  const [selectedIterationId, setSelectedIterationId] = useState('');
  const [iterationId, setIterationId] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDistrict, setNewProjectDistrict] = useState('');
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false);

  // Create project handler
  const handleAddProject = async () => {
    try {
      const payload = { name: newProjectName, district: newProjectDistrict, metadata: {} };
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Create failed');
      const project = await res.json();
      setProjects(prev => [...prev, project]);
      setNewProjectName('');
      setNewProjectDistrict('');
    } catch (e) {
      console.error(e);
      alert('Could not add project');
    }
  };

  // Delete project handler
  const handleDeleteProject = async (projectId) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setProjects(prev => prev.filter(p => p.id !== projectId));
      if (selectedProjectId === projectId) {
        setSelectedProjectId('');
        setSelectedIterationId('');
        setIterations([]);
      }
    } catch (e) {
      console.error(e);
      alert('Could not delete project');
    }
  };

  // Kick off analysis
  const handleStartAnalysis = () => {
    if (!selectedIterationId) return;
    const iter = iterations.find(it => it.session_id === selectedIterationId);
    if (iter) {
      setSessionId(iter.session_id);
      setIterationId(iter.id);
      setStatus('pending');
    }
  };

  // Poll for results
  useEffect(() => {
    if (!iterationId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/iterations/${iterationId}/results`);
        if (!res.ok) throw new Error('Status fetch failed');
        const { status: s } = await res.json();
        setStatus(s);
        if (s === 'complete') clearInterval(interval);
      } catch (e) {
        console.error(e);
        clearInterval(interval);
        setStatus('error');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [iterationId]);

  // Load all projects once
  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(setProjects)
      .catch(console.error);
  }, []);

  // Load iterations whenever project changes
  useEffect(() => {
    if (!selectedProjectId) return;
    fetch(`/api/projects/${selectedProjectId}/iterations`)
      .then(r => r.json())
      .then(setIterations)
      .catch(console.error);
  }, [selectedProjectId]);

  // Sync with external selectedProject prop
  useEffect(() => {
    if (selectedProject?.id && selectedProject.id !== selectedProjectId) {
      setSelectedProjectId(selectedProject.id);
    }
  }, [selectedProject, selectedProjectId]);

  return (
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <ViewerControls
        projects={projects}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        iterations={iterations}
        selectedIterationId={selectedIterationId}
        setSelectedIterationId={setSelectedIterationId}
        status={status}
        sessionId={sessionId}
        onStartAnalysis={handleStartAnalysis}
        disableStart={status === 'pending'}
        onOpenProjectManager={() => setIsProjectManagerOpen(true)}
      />

      <ModelCanvas
        projectId={selectedProjectId}
        sessionId={sessionId}
        status={status}
      />

      <ProjectManager
        isOpen={isProjectManagerOpen}
        onClose={() => setIsProjectManagerOpen(false)}
        projects={projects}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
        selectedProjectId={selectedProjectId}
        newProjectName={newProjectName}
        setNewProjectName={setNewProjectName}
        newProjectDistrict={newProjectDistrict}
        setNewProjectDistrict={setNewProjectDistrict}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `
      }} />
    </div>
  );
}

export default ViewerPage;