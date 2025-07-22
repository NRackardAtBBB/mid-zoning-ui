import { useState } from 'react';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import ViewerPage from './pages/ViewerPage';
import ProjectsPage from './pages/ProjectsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} setSelectedProject={setSelectedProject} />;
      case 'viewer':
        return <ViewerPage selectedProject={selectedProject} />;
      case 'projects':
        return <ProjectsPage setCurrentPage={setCurrentPage} setSelectedProject={setSelectedProject} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} setSelectedProject={setSelectedProject} />;
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
      <Header 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        selectedProject={selectedProject}
      />
      
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;